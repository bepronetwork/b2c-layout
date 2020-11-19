import io from "socket.io-client";
import { createContext } from "react";
import _ from "lodash";
import { apiUrl } from "../../../lib/api/apiConfig";

export const WEBSOCKET_KYC_URL = `${apiUrl}`.replace(/https:/g, "wss:");

const socketKycConnection = !_.isEmpty(WEBSOCKET_KYC_URL)
  ? createContext({
      connection: io(WEBSOCKET_KYC_URL, {
        transport: ["websocket"]
      })
    })
  : {};

export default socketKycConnection;
