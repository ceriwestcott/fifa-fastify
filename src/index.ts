import { fastify } from "fastify";
import pino from "pino";
const Port = process.env.PORT || 7000;
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/matches";
import db from "./config";
import MatchRoute from "./config/routes/matchRoute";
const server = fastify({
  logger: pino({ level: "info" }),
});

server.register(db, { uri });
server.register(MatchRoute);

const start = async () => {
  try {
    await server.listen({ port: 7000 });
    console.log("Server started successfully");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
