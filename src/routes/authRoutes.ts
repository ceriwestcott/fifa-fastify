import {
  FastifyPluginAsync,
  FastifyInstance,
  FastifyPluginOptions,
} from "fastify";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import fp from "fastify-plugin";
interface UserFormAttributes {
  email: string;
  password: string;
}

const SECRET_KEY = "secret";

const AuthRoutes: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  fastify.post<{ Body: UserFormAttributes }>(
    "/register",
    {},
    async (request, reply) => {
      const { email, password } = request.body;

      const existingUser = await fastify.db.models.User.findOne({ email });
      if (existingUser) {
        return reply.code(400).send({ message: "User already exists" });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = await fastify.db.models.User.addOne({
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
        return reply.code(400).send({ message: "User does not exist" });
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
