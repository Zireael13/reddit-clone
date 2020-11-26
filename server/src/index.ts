import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { COOKIE_NAME, __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { MyContext } from "./types";
import cors from "cors";
import { sendEmail } from "./utils/sendEmail";

const main = async () => {
  const orm = await MikroORM.init();
  await orm.getMigrator().up();

  const app = express();

  sendEmail("mattwilki17@gmail.com", "ohshitwaddup!", "itsdatboi!");

  app.use(cors({ origin: "http://localhost:3000", credentials: true }));

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10yrs
        httpOnly: true,
        secure: __prod__,
        sameSite: "lax", //csrf
      },
      saveUninitialized: false,
      secret: "iwantjoebiden",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  /* const post = orm.em.create(Post, { title: "my post" });
  await orm.em.persistAndFlush(post);

  const posts = await orm.em.find(Post, {});
  console.log(posts); */

  app.listen(4000, () => console.log("server started on port 4000"));
};

main().catch((err) => {
  console.error(err);
});

console.log("ello world");
