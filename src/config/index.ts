import fastify, {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions,
} from "fastify";
import mongoose from "mongoose";
import { Match, MatchModel } from "./models/fifaModel";
import fp from "fastify-plugin";

export interface Models {
  Match: MatchModel;
}

export interface Db {
  models: Models;
}

export interface PluginOptions {
  uri: string;
}

const ConnectDB: FastifyPluginAsync<PluginOptions> = async (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  try {
    mongoose.connection.on("connected", () => {
      fastify.log.info({ actor: "MongoDB" }, "connected");
    });
    mongoose.connection.on("disconnected", () => {
      fastify.log.error({ actor: "MongoDB" }, "disconnected");
    });
    const db = await mongoose.connect(options.uri);
    const models: Models = { Match };
    fastify.decorate("db", { models });
  } catch (error) {
    console.error(error);
  }
};
export default fp(ConnectDB);
