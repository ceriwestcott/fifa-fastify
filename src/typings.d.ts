// typings.d.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { Db } from "./path/to/your/config"; // Adjust the path as per your project structure

declare module "fastify" {
  export interface FastifyInstance {
    db: Db;
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
}
