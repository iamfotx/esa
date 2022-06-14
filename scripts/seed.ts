import type { CallbackError, ObjectId } from "mongoose";
import type { User } from "~/types.server";
import dotenv from "dotenv";
import mongoose from "mongoose";
import invariant from "tiny-invariant";
import UserModel from "~/models/user.model.server";
import EventModel from "~/models/event.model.server";
import { createFakeEvents } from "~/utils.server";
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
  console.error(err);
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
  const { id } = await seedAdminUser({
    email: adminEmail,
    password: adminPassword,
  });
  invariant(id, "seedAdminUser must return a user with an id");
  await seedEventsCollection(id);
}

async function seedEventsCollection(id: ObjectId) {
  try {
    const events = createFakeEvents(id, 100);
    const bulkEvents: any[] = events.map((event) => ({
      updateOne: {
        filter: { slug: event.slug },
        update: { $set: event },
        upsert: true,
      },
    }));
    await EventModel.bulkWrite(bulkEvents);
  } catch (err) {
    console.error(err);
    invariant(!err, "Error seeding events");
  }
}

async function seedAdminUser({ email, password }: User): Promise<User> {
  // cleanup the existing database
  await UserModel.findOneAndDelete({ email });

  // create a new user
  const user = new UserModel({
    email,
    password,
  });
  // save the new user
  await user.save();
  return user;
}
