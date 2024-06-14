import { User, UserModel } from "../models/user/user";
import fastify, {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import mongoose from "mongoose";
import { Match, MatchModel } from "../models/fifa/fifaModel";
import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";

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
    const db = await mongoose.connect(options.uri);
    const models: Models = { Match, User };
    fastify.decorate("db", { models });
  } catch (error) {
    console.error(error);
  }
};

const Authenticate: FastifyPluginAsync<FastifyInstance> = async (
  fastify,
  opts
) => {
  fastify.register(fastifyJwt, {
    secret: "secret",
  });

  fastify.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    }
  );
};
export default fp(ConnectDB);
