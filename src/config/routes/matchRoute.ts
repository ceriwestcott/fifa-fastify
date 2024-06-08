import {
  Match,
  MatchSearchParams,
  UpdateMatchAttributes,
  updateMatchAttributes,
} from "./../models/fifaModel";
import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions,
} from "fastify";
import { Db } from "..";
import fp from "fastify-plugin";
import { MatchAttributes } from "../models/fifaModel";

declare module "fastify" {
  export interface FastifyInstance {
    db: Db;
  }
}

interface matchSearchParams {
  id: string;
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
    {},
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
