import { ExpressServer } from "./express-server";
import { app } from "./app";

// create server
(async () => {
  const server = new ExpressServer();
  try {
    await server.init();
    await app.initialize();
  } catch (error) {
    console.error(error);
  }
})();
