import axios from "axios";
import handleError from "./handleError";
import { apiUrl, appId } from "./apiConfig";

export default async function getAppInfo() {
  try {
    const response = await axios.post(`${apiUrl}/app/get`, {
      app: appId
    });

    return response.data.data.message;
  } catch (error) {
    return handleError(error);
  }
}
