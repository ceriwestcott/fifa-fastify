import { FastifyPluginAsync, FastifyInstance } from "fastify";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import fp from "fastify-plugin";
import { sendResponse } from "../service/send-response";
interface UserFormAttributes {
  email: string;
  password: string;
}

const SECRET_KEY = "secret";

const AuthRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.post<{ Body: UserFormAttributes }>(
    "/register",
    {},
    async (request, reply) => {
      const { email, password } = request.body;

      const existingUser = await fastify.db.models.User.findOne({ email });
      if (existingUser) {
        sendResponse(reply, 400, {
          errorDetails: "User already exists",
        });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      await fastify.db.models.User.addOne({
        email,
        password: hashedPassword,
      });

      const token = jwt.sign({ email }, SECRET_KEY, {
        expiresIn: "1h",
      });
      return reply.code(201).send({ token });
    }
  );

  fastify.post<{
    Body: UserFormAttributes;
  }>("/login", {}, async (request, reply) => {
    try {
      const { email, password } = request.body;
      const user = await fastify.db.models.User.findOne({ email: email });
      if (!user) {
        sendResponse(reply, 400, {
          errorDetails: "User not found",
        });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return reply.code(400).send({ message: "Invalid password" });
      }
      const token = jwt.sign({ email }, SECRET_KEY, {
        expiresIn: "1h",
      });
      return reply.code(200).send({ token });
    } catch (err) {
      request.log.error(err);
      reply.status(500).send({ error: "Internal Server Error" });
    }
  });
};

export default fp(AuthRoutes);
