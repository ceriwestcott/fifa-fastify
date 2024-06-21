import { fastify } from "fastify";
import pino from "pino";
const PORT = process.env.PORT || 7000;
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/matches";
import db from "./config";
import AuthRoutes from "./routes/authRoutes";
import authenticate from "./middleware/authMiddleWare";
import matchRoute from "./routes/matchRoute";
const server = fastify({
  logger: pino({ level: "info" }),
});

server.register(authenticate);
// Register middlewared
// Register database
server.register(db, { uri: uri });

// Register routes
server.register(AuthRoutes);
server.register(matchRoute);

const start = async () => {
  try {
    await server.listen({ port: Number(PORT) });
    console.log("Server started successfully");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
