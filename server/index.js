const path = require("path");
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const compression = require("compression");
const morgan = require("morgan");
const mongoose = require("mongoose");
const invariant = require("tiny-invariant");
const { createRequestHandler } = require("@remix-run/express");
require("dotenv").config();

const port = process.env.PORT || 3000;
const connectionString = process.env.MONGODB_CONNECTION_STRING;
const dbName = process.env.MONGODB_DATABASE;
invariant(connectionString, "MONGODB_CONNECTION_STRING must be set");
invariant(dbName, "MONGODB_DATABASE must be set");

const BUILD_DIR = path.join(process.cwd(), "server/build");

const app = express();

// You need to create the HTTP server from the Express app
const httpServer = createServer(app);

// And then attach the socket.io server to the HTTP server
const io = new Server(httpServer);

// Then you can use `io` to listen the `connection` event and get a socket
// from a client
io.on("connection", onSocketConnect);

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// Remix fingerprints its assets so we can cache forever.
app.use(express.static("public/build", { immutable: true, maxAge: "1y" }));

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("public", { maxAge: "1h" }));

app.use(morgan("tiny"));

app.all(
  "*",
  process.env.NODE_ENV === "development"
    ? (req, res, next) => {
        purgeRequireCache();

        return createRequestHandler({
          build: require(BUILD_DIR),
          mode: process.env.NODE_ENV,
        })(req, res, next);
      }
    : createRequestHandler({
        build: require(BUILD_DIR),
        mode: process.env.NODE_ENV,
      })
);

// connect to db and start server
console.log(`Connecting to db...`);

mongoose.connect(
  connectionString,
  {
    dbName,
  },
  onMongooseConnect
);

function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, but then you'll have to reconnect to databases/etc on each
  // change. We prefer the DX of this, so we've included it for you by default
  for (let key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key];
    }
  }
}

function onMongooseConnect(error) {
  if (error) {
    console.error(`Error connecting to db: ${error}`);
    process.exit(1);
  }
  console.log(`Connected to db!`);

  // start the server
  httpServer.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
  });
}

function onSocketConnect(socket) {
  mongoose.connection.db
    .collection("events")
    .watch()
    .on("change", (change) => {
      if (change.operationType === "insert") {
        const { _id: id, __v, ...event } = change.fullDocument;
        socket.emit("EVENT_CREATED", { ...event, id });
      }
    });
}
