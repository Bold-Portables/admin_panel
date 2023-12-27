// import { io } from "socket.io-client";

// const URL = `${process.env.REACT_APP_SOCKET}`;

// export const socket = io(URL);


import {io} from "socket.io-client";

 const URL = `${process.env.REACT_APP_SOCKET}`;

export const socketService = {
  connect,
};
//window.location.hostname
function connect() {
  return new Promise((resolve, reject) => {
    const socket = io(URL, {
     // query: { token: JSON.parse(localStorage.getItem()).token },
    });
    socket.on("connect", () => {
      resolve(socket);
    });
  });
}


