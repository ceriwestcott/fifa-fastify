import { config } from "dotenv";
config();
import { fastify } from "fastify";
import cors from "@fastify/cors";
import pino from "pino";
const PORT = process.env.PORT || 4210;
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/matches";
import db from "./config";
import AuthRoutes from "./routes/auth-route";
import authenticate from "./middleware/authMiddleWare";
import MatchRoute from "./routes/match-route";
const server = fastify({
  logger: pino({
    level: "debug", // main log level, must be lower than the transport level
  }),
});

// Register middlewared

server.register(cors, {
  origin: "*",
});
server.register(authenticate);
// Register database
server.register(db, { uri: uri });

// Register routes
server.register(AuthRoutes);
server.register(MatchRoute);

const start = async () => {
  try {
    await server.listen({ port: Number(PORT), host: "0.0.0.0" });
    console.log("Server started successfully");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
