import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

// load the environment variables from the .env file

const auth = async (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const verify = jwt.verify(
          token,
          process.env.JWT_SECRET as string
        ) as jwt.JwtPayload;
        if (verify) {
          req.body["_id"] = verify._id;
          next();
        }
      } else {
        console.log("Token Not Found.");
      }
    } catch (error) {
      res.status(401).send({
        message: "YOUR SESSION HAS EXPIRED. PLEASE LOGIN AGAIN.",
        success: false,
        error: "token-expired",
      });
    }
  }
};
export default auth;
