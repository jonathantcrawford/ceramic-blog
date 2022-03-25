import cuid from "cuid";
import arc from "@architect/functions";

export type BlogPost = {
  id: string;
  userId: string;
  title: string;
  subTitle: string;
  emoji: string;
  slug: string;
  date: string;
  body: string;
};

const skToId = (sk: string) => sk.replace(/^blog_post#/, "");
const idToSk = (id: string) => `blog_post#${id}`;

export async function getBlogPost({
  userId,
  id,
}: {
  userId: string;
  id: string;
}): Promise<BlogPost | null> {
  const db = await arc.tables();

  const result = await await db.blog_post.get({ pk: userId, sk: idToSk(id) });

  if (result) {
    return {
      userId: result.pk,
      id: result.sk,
      title: result.title,
      subTitle: result.subTitle,
      emoji: result.emoji,
      slug: result.slug,
      date: result.date,
      body: result.body,
    };
  }
  return null;
}

export async function getBlogPostListItems({
  userId,
}: {
  userId: string;
}): Promise<Array<Omit<BlogPost, "body" >>> {
  const db = await arc.tables();

  const result = await db.blog_post.query({
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: { ":pk": userId },
  });

  return result.Items.map((n: any) => ({
    title: n.title,
    id: skToId(n.sk),
    emoji: n.emoji,
    subTitle: n.subTitle,
    date: n.date,
    slug: n.slug
  }));
}

export async function createBlogPost({
  title,
  subTitle,
  emoji,
  slug,
  date,
  body,
  userId,
}: {
  title: string,
  subTitle: string,
  emoji: string,
  slug: string,
  date: string
  body: string,
  userId: string;
}): Promise<BlogPost> {
  const db = await arc.tables();

  const result = await db.blog_post.put({
    pk: userId,
    sk: `blog_post#${cuid()}`,
    title: title,
    subTitle: subTitle,
    emoji: emoji,
    slug: slug,
    date: date,
    body: body,
  });
  return {
    id: skToId(result.sk),
    userId: result.pk,
    title: result.title,
    subTitle: result.subTitle,
    emoji: result.emoji,
    slug: result.slug,
    date: result.date,
    body: result.body,
  };
}

export async function deleteBlogPost({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  const db = await arc.tables();
  return db.blog_post.delete({ pk: userId, sk: idToSk(id) });
}
