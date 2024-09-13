import mongoose, { ConnectOptions } from "mongoose";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

const url = process.env.DB_URL;

export const dbConnect = async () => {
  // use mongoose to connect this app to our database on mongoDB using the DB_URL (connection string)
  mongoose.set("strictQuery", true);
  mongoose
    .connect(
      url as string,
      {
        // these are options to ensure that the connection is done properly
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions
    )
    .then(() => {
      console.log("Successfully connected to MongoDB Atlas!");
    })
    .catch((error) => {
      console.log("Unable to connect to MongoDB Atlas!");
      console.error(error);
    });
};
