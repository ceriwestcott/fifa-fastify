 import fp from "fastify-plugin";
 import fastifyJwt from "@fastify/jwt";
 import {
   FastifyInstance,
   FastifyRequest,
   FastifyReply,
   FastifyPluginAsync,
   FastifyPluginOptions,
 } from "fastify";
import { Db } from "../config";
import {
  MatchAttributes,
  UpdateMatchAttributes,
  MatchSearchParams,
} from "../models/fifa/params/match-params";

declare module "fastify" {
  export interface FastifyInstance {
    db: Db;
   authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
}

const MatchRoute: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  fastify.get("/matches", {}, async (request, reply) => {
    try {
      const { Match } = fastify.db.models;
      const matches = await Match.find();
      return reply.code(200).send(matches);
    } catch (err) {
      request.log.error(err);
      reply.status(500).send({ error: "Internal Server Error" });
    }
  });

  fastify.post<{ Body: MatchAttributes }>(
    "/matches",
    {
      onRequest: [fastify.authenticate],
    },
    async (request, reply) => {
      try {
        const { Match } = fastify.db.models;
        const match = await Match.addOne(request.body);
        return reply.code(201).send(match);
      } catch (err) {
        request.log.error(err);
        reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );

  fastify.post<{ Body: UpdateMatchAttributes }>(
    "/matches/update",
    {},
    async (request, reply) => {
      try {
        const { Match } = fastify.db.models;
        const match = await Match.findByIdAndUpdate(request.body.id, {
          $set: {
            "home.score": request.body.home.goals,
            "away.score": request.body.away.goals,
            inPlay: false,
          },
        });
        return reply.code(200).send(match);
      } catch (err) {
        request.log.error(err);
        reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );

  //
  fastify.get<{ Params: MatchSearchParams }>(
    "/matches/:id",
    {},
    async (request, reply) => {
      try {
        const { Match } = fastify.db.models;
        const match = await Match.findById(request.params.id);
        return reply.code(200).send(match);
      } catch (err) {
        request.log.error(err);
        reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );

};

export default fp(MatchRoute);
