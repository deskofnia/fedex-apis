import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const getFedexAccessToken = async () => {
  const { FEDEX_API_KEY, FEDEX_SECRET } = process.env;
  const input = `grant_type=client_credentials&client_id=${FEDEX_API_KEY}&client_secret=${FEDEX_SECRET}`;
  const config = {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  };

  try {
    const response = await axios.post(
      "https://apis-sandbox.fedex.com/oauth/token",
      input,
      config
    );

    console.log(">>>>>", response.data.access_token);

    return response.data.access_token;
  } catch (error) {
    console.error(error);
  }
};
