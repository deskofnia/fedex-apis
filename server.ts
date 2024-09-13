import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { fedexRoutes } from "./src/routes/fedexRoutes";
import { dbConnect } from "./src/db/db.config";
import { getFedexAccessToken } from "./src/utils/helper";
dotenv.config({ path: ".env" });

// execute database connection
dbConnect();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); //convert body into json
app.use("/api/fedex", fedexRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});

getFedexAccessToken();
