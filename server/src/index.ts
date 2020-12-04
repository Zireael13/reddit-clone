import "reflect-metadata";
import "dotenv-safe/config";
import { COOKIE_NAME, __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import { MyContext } from "./types";
import cors from "cors";
import { User } from "./entities/User";
import { createConnection } from "typeorm";
import { Post } from "./entities/Post";
import path from "path";
import { Updoot } from "./entities/Updoot";
import { createUserLoader } from "./utils/createUserLoader";
import { createUpdootLoader } from "./utils/createUpdootLoader";
// rerun
const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    database: "readit",
    username: "postgres",
    password: "postgres",
    url: process.env.DATABASE_URL,
    logging: !__prod__,
    synchronize: false,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [Post, User, Updoot],
  });

  await conn.runMigrations();

  const app = express();
  app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);

  if (__prod__) {
    app.set("trust proxy", 1);
  }

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10yrs
        httpOnly: true,
        secure: __prod__,
        sameSite: "lax", //csrf
        //domain: __prod__ ? process.env.DOMAIN : undefined,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),
      updootLoader: createUpdootLoader(),
    }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  /* const post = orm.em.create(Post, { title: "my post" });
  await orm.em.persistAndFlush(post);

  const posts = await orm.em.find(Post, {});
  console.log(posts); */

  app.listen(parseInt(process.env.PORT), () =>
    console.log(`server started on port ${process.env.PORT}`)
  );
};

main().catch((err) => {
  console.error(err);
});

console.log("ello world");
