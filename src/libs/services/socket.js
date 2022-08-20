import { io } from "socket.io-client";

const socket = () => {
  const _socket = io(process.env.REACT_APP_DEV_API_URL);

  return _socket;
};

export default socket;
