import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import {
  MatchAttributes,
  UpdateMatchAttributes,
  MatchSearchParams,
} from "../models/fifa/params/match-params";
import { sendResponse } from "../service/send-response";

const MatchRoute: FastifyPluginAsync = async (fastify: FastifyInstance) => {
 fastify.get(
    "/matches",
    {
      onRequest: [fastify.authenticate], // Ensure this is correctly referenced
    },
    async (request, reply) => {
      try {
        const { Match } = fastify.db.models;
        const matches = await Match.find();
        sendResponse(reply, 200, {
          data: matches,
        });
      } catch (err) {
        request.log.error(err);
        sendResponse(reply, 500, { errorDetails: "Internal Server Error" });
      }
    }
  );

  fastify.post<{ Body: MatchAttributes }>(
    "/matches/create",
    {
      onRequest: [fastify.authenticate], // Ensure this is correctly referenced
    },
    async (request, reply) => {
      try {
        const { Match } = fastify.db.models;
        const match = await Match.addOne(request.body);
        return reply.code(201).send(match);
      } catch (err) {
        request.log.error(err);
        sendResponse(reply, 500, { errorDetails: "Internal Server Error" });
      }
    }
  );

  fastify.put<{ Body: UpdateMatchAttributes }>(
    "/matches/update-score",
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
        sendResponse(reply, 500, { errorDetails: "Internal Server Error" });
      }
    }
  );

  fastify.delete<{ Params: MatchSearchParams }>(
    "/matches/delete/:id",
    {
      onRequest: [fastify.authenticate],
    },
    async (request, reply) => {
      try {
        if (!request.params.id) {
          sendResponse(reply, 400, { errorDetails: "Match ID is required" });
        }
        const { Match } = fastify.db.models;
        const match = await Match.findByIdAndDelete(request.params.id);
        if (!match) {
          sendResponse(reply, 404, { errorDetails: "Match not found" });
        } else {
          sendResponse(reply, 200, {
            message: "Match deleted successfully",
          });
        }
      } catch (err) {
        request.log.error(err);
        sendResponse(reply, 500, { errorDetails: "Internal Delete Error" });
      }
    }
  );

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
        sendResponse(reply, 500, { errorDetails: "Internal Server Error" });
      }
    }
  );
};

export default fp(MatchRoute);
