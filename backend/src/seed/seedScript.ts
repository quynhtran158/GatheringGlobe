import mongoose from "mongoose";

import "dotenv/config";
import dotenv from 'dotenv';
import { generateEvents } from "./seedEvents";
import { generateTickets } from "./seedTickets";
import { generateUsers } from "./seedUsers";



dotenv.config()

const sleep = (s:number) => {
    return new Promise((resolve) => {
      setTimeout(resolve, s * 1000);
    });
  };

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)
        await sleep(3);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB: ", error);
        process.exit(1);
    }
    }

const generate = async () => {
    try {
        const users = await generateUsers(20); // Generate 10 users
        const events = await generateEvents(40, users); // Generate 20 events
        const tickets = await generateTickets(events); // Generate tickets for the events

        console.log('----------------------');
        console.log('Total data generated:');
        console.log(`- ${users.length} users`);
        console.log(`- ${events.length} events`);
        console.log(`- ${tickets.length} tickets`);

        return;
    } catch (error) {
        console.error("Error generating data: ", error);
        throw error; // Re-throw to handle in the calling function
    }
}

const run = async () => {
    console.log('Running seeds...');
    await connectDB();
    console.log('Generating mock data...');
    await generate();
    console.log('Finished running seeds!');
    process.exit(0);
};

run().catch(err => {
    console.error('An error occurred:', err);
    process.exit(1);
});