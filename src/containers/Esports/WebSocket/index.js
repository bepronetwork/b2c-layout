import io from 'socket.io-client';
import { createContext } from 'react';
import _ from 'lodash'

export const WEBSOCKET_ESPORTS_URL = process.env.REACT_APP_WEBSOCKET_ESPORTS_LISTENER;

const socketConnection = !_.isEmpty(WEBSOCKET_ESPORTS_URL) ? createContext({
    connection: io(WEBSOCKET_ESPORTS_URL, {
      transport: ["websocket"]
    })
}) : {};

export default socketConnection;