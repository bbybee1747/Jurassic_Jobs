// index.ts
import express, { RequestHandler } from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import schema from "./src/schemas";
import { ExpressContextFunctionArgument } from "@apollo/server/express4";
import db from "./src/config/db"; 

dotenv.config();

db();

const app = express();
app.use(cors());
app.use(express.json());

const context = async (integrationContext: ExpressContextFunctionArgument) => {
  const { req } = integrationContext;
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (token) {
    try {
      const secretKey = process.env.JWT_SECRET_KEY as string;
      const decoded = jwt.verify(token, secretKey);
      return { user: decoded };
    } catch (err) {
      console.error("Error decoding token:", err);
    }
  }
  return {};
};

const startServer = async () => {
  const server = new ApolloServer({ schema });
  await server.start();

  const graphqlMiddleware = expressMiddleware(server, { context }) as unknown as RequestHandler;

  app.use("/graphql", express.json(), graphqlMiddleware);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`GraphQL endpoint available at http://localhost:${PORT}/graphql`);
  });
};

startServer();
