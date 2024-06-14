import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
  FastifyPluginAsync,
} from "fastify";

const authenticate: FastifyPluginAsync = async (fastify) => {
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

export default fp(authenticate);
