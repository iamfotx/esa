import type { CallbackError } from "mongoose";
import type { User } from "~/types.server";
import dotenv from "dotenv";
import mongoose from "mongoose";
import invariant from "tiny-invariant";
import UserModel from "~/models/user.server";
dotenv.config();

const connectionString = process.env.MONGODB_CONNECTION_STRING;
const dbName = process.env.MONGODB_DATABASE;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
invariant(connectionString, "MONGODB_CONNECTION_STRING must be set");
invariant(dbName, "MONGODB_DATABASE must be set");

mongoose.connect(
  connectionString,
  {
    dbName,
  },
  onConnect
);

async function onConnect(err: CallbackError) {
  invariant(!err, "Error connecting to db");
  console.log(`Connected to db!`);
  try {
    await seed();
    console.log(`Database has been seeded. 🌱`);
  } catch (err) {
    invariant(!err, "Error seeding db");
  } finally {
    await mongoose.disconnect();
  }
}

async function seed() {
  invariant(adminEmail, "ADMIN_EMAIL must be set");
  invariant(adminPassword, "ADMIN_PASSWORD must be set");
  await seedAdminUser({ email: adminEmail, password: adminPassword });
  await seedEventsCollection();
}

async function seedEventsCollection() {}

async function seedAdminUser({ email, password }: User) {
  // cleanup the existing database
  await UserModel.findOneAndDelete({ email });

  // create a new user
  const user = new UserModel({
    email,
    password,
  });
  // save the new user
  await user.save();
}
