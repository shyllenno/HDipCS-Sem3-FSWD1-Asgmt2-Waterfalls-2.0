import Mongoose from "mongoose";
import * as mongooseSeeder from "mais-mongoose-seeder";
import dotenv from "dotenv";
import { seedData } from "./seed-data.js";

dotenv.config();


const seedLib = mongooseSeeder.default;

async function seed() {
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
    await seed();
  });

  db.on("disconnected", () => {
    console.log("database disconnected");
  });

  return db;
}
