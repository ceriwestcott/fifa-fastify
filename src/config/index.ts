import { User, UserModel } from "../models/user/user";
import mongoose from "mongoose";
import { Match, MatchModel } from "../models/fifa/fifaModel";
import fp from "fastify-plugin";
import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions,
} from "fastify";
export interface Models {
  Match: MatchModel;
  User: UserModel;
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
    await mongoose.connect(options.uri);
    const models: Models = { Match, User };
    fastify.decorate("db", { models });
  } catch (error) {
    fastify.log.error(error);
  }
};

export default fp(ConnectDB);
