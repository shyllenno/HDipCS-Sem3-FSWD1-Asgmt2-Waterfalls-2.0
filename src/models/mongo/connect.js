import Mongoose from "mongoose";
import * as mongooseSeeder from "mais-mongoose-seeder";
import dotenv from "dotenv";
import { seedData } from "./seed-data.js";
import bcrypt from "bcrypt"

dotenv.config();

const seedLib = mongooseSeeder.default;

async function seed() {
  const users = seedData.users;

  for (const key of Object.keys(users)) {
    const user = users[key];

    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  }
  const seeder = seedLib(Mongoose);
  await seeder.seed(seedData, { dropDatabase: false, dropCollections: true });
}

export async function connectMongo() {
  await Mongoose.set("strictQuery", true);

  const connection = await Mongoose.connect(process.env.DB);

  const db = connection.connection;

  db.on("error", (err) => {
    console.log(`database connection error: ${err}`);
  });

  db.once("open", async function () {
    console.log(`database connected to ${this.name} on ${this.host}`);
  });

  db.on("disconnected", () => {
    console.log("database disconnected");
  });

  await seed();

  return db;
}
