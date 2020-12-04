import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { Post } from "../entities/Post";
import { Updoot } from "../entities/Updoot";
import { User } from "../entities/User";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";

@InputType()
class PostInput {
  @Field()
  title: string;

  @Field()
  text: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];

  @Field()
  hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() post: Post): string {
    return post.text.slice(0, 50);
  }

  @FieldResolver(() => User)
  creator(
    @Root() post: Post,
    @Ctx() { userLoader }: MyContext
  ): Promise<User | undefined> {
    return userLoader.load(post.creatorId);
  }

  @FieldResolver(() => Int, { nullable: true })
  async voteStatus(
    @Root() post: Post,
    @Ctx() { updootLoader, req }: MyContext
  ): Promise<number | null> {
    if (!req.session.userId) {
      return null;
    }
    const updoot = await updootLoader.load({
      postId: post.id,
      userId: req.session.userId,
    });

    return updoot ? updoot.value : null;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("postId", () => Int) postId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    const { userId } = req.session;

    const updoot = await Updoot.findOne({ where: { postId, userId } });

    console.log(userId);

    const isUpdoot = value !== -1;
    const realValue = isUpdoot ? 1 : -1;

    const voteSuceeded = await getConnection().transaction(async (em) => {
      if (updoot && updoot.value !== realValue) {
        await em.query(
          `
        update updoot
        set value = value + $1
        where "postId" = $2 and "userId" = $3`,
          [realValue * 2, postId, userId]
        );

        await em.query(
          `
        update post
        set points = points + $1
        where id = $2`,
          [realValue * 2, postId]
        );

        return true;
      } else if (updoot && updoot.value === realValue) {
        await em.query(
          `
        delete from updoot
        where "postId" = $1 and "userId" = $2`,
          [postId, userId]
        );

        await em.query(
          `
        update post
        set points = points - $1
        where id = $2`,
          [realValue, postId]
        );

        return true;
      } else if (!updoot) {
        await em.query(
          `
        insert into updoot ("userId", "postId", value)
        values ($1, $2, $3)`,
          [userId, postId, realValue]
        );

        await em.query(
          `
        update post
        set points = points + $1
        where id = $2`,
          [realValue, postId]
        );

        return true;
      } else {
        return false;
      }
    });

    return voteSuceeded;
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null,
    @Ctx() { req }: MyContext
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;

    const replacements: any[] = [realLimitPlusOne];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    console.log(req.session);

    const posts = await getConnection().query(
      `
    select p.*
    from post p
    ${cursor ? `where p."createdAt" < $2` : ""}
    order by p."createdAt" DESC
    limit $1
    `,
      replacements
    );

    // const qb = getConnection()
    //   .getRepository(Post)
    //   .createQueryBuilder("p")
    //   .innerJoinAndSelect("p.creator", "u", 'u.id = p."creatorId"')
    //   .orderBy('p."createdAt"', "DESC")
    //   .take(realLimitPlusOne);

    // // if (cursor) {
    // //   qb.where('p."createdAt" < :cursor', {
    // //     cursor: new Date(parseInt(cursor)),
    // //   });
    // // }

    // // const posts = await qb.getMany();
    // console.log(posts);

    //console.log(posts);

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlusOne,
    };
  }

  @Query(() => Post, { nullable: true })
  async post(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    return Post.create({ ...input, creatorId: req.session.userId }).save();
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
    @Arg("text", () => String, { nullable: true }) text: string,
    @Ctx() { req }: MyContext
  ): Promise<Post | null> {
    const { userId } = req.session;
    //const post = await Post.findOne(id)

    const result = await getConnection()
      .createQueryBuilder()
      .update(Post)
      .set({ title, text })
      .where('id = :id and "creatorId" = :creatorId', { id, creatorId: userId })
      .returning("*")
      .execute();

    console.log("result: ", result);

    return result.raw[0];
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    // const post = await Post.findOne({ id, creatorId: req.session.userId });
    // if (!post) {
    //   return false;
    // }

    // await Updoot.delete({ postId: id });
    // await Post.delete({ id, creatorId: req.session.userId });

    await Post.delete({ id, creatorId: req.session.userId });
    return true;
  }
}
