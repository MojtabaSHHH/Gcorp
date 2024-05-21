import dotenv from "dotenv";
import index from "./app";
import http from "http";
import logger from "./middleware/logger";
import database from "./utils/Database";


dotenv.config();
const Server = http.createServer(index);

Server.listen(process.env.PORT, async () => {
  await database();
  logger.info(`Server is up and running on port: ${process.env.PORT}`);
});