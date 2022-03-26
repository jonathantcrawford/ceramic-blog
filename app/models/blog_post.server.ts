import cuid from "cuid";
import arc from "@architect/functions";

export type BlogPost = {
  id: string;
  userId: string;
  title: string;
  subTitle: string;
  emoji: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  body: string;
};


export async function getBlogPostById({
  id,
}: {
  id: string;
}): Promise<Omit<BlogPost, "userId"> | null> {
  const db = await arc.tables();
  const result = await await db.blog_post.get({ pk: `blog_post#${id}`});

  if (result) {
    return {
      id: result.pk.replace(/^blog_post#/, ""),
      title: result.title,
      subTitle: result.subTitle,
      emoji: result.emoji,
      slug: result.slug.replace(/^slug#/, ""),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      body: result.body,
    };
  }
  return null;
}

export async function getBlogPostBySlug({
  slug,
}: {
  slug: string;
}): Promise<Omit<BlogPost, "userId"> | null> {
  const db = await arc.tables();

  const result = await await db.blog_post.query({
    IndexName: 'bySlug',
    KeyConditionExpression: "slug = :slug",
    ExpressionAttributeValues: { ":slug": `slug#${slug}` },
  })
  console.log(result)

  const [record] = result.Items;

  if (record) {
    return {
      id: record.pk.replace(/^blog_post#/, ""),
      title: record.title,
      subTitle: record.subTitle,
      emoji: record.emoji,
      slug: record.slug.replace(/^slug#/, ""),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      body: record.body,
    };
  }
  return null;
}

export async function getBlogPostListItemsByUserId({
  userId,
}: {
  userId: string;
}): Promise<Array<Omit<BlogPost, "body" >>> {
  const db = await arc.tables();
  const result = await db.blog_post.query({
    IndexName: 'byUserId',
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: { ":userId": `user#${userId}` },
  });

  return result.Items.map((n: any) => ({
    title: n.title,
    id: n.pk.replace(/^blog_post#/, ""),
    emoji: n.emoji,
    subTitle: n.subTitle,
    createdAt: n.createdAt,
    updatedAt: n.updatedAt,
    slug: n.slug.replace(/^slug#/, "")
  }));
}

export async function getBlogPostListItems()
: Promise<Array<Omit<BlogPost, "body" >>> {
  const db = await arc.tables();

  const result = await db.blog_post.scan({
    ExpressionAttributeValues: { ":pk": `blog_post#` },
    FilterExpression: 'begins_with(pk, :pk)'
  });

  return result.Items.map((n: any) => ({
    title: n.title,
    id: n.pk.replace(/^blog_post#/, ""),
    emoji: n.emoji,
    subTitle: n.subTitle,
    createdAt: n.createdAt,
    updatedAt: n.updatedAt,
    slug: n.slug.replace(/^slug#/, ""),
  }));
}

export async function createBlogPost({
  title,
  subTitle,
  emoji,
  slug,
  body,
  userId,
}: {
  title: string,
  subTitle: string,
  emoji: string,
  slug: string,
  body: string,
  userId: string;
}): Promise<BlogPost | {errors: any}> {
 

  const client = await arc.tables();
  
  //@ts-ignore
  const reflect = await client.reflect()

  
  try {
    const newCuid = cuid();
    const createdAt = (new Date()).toISOString();
    const updatedAt = createdAt;

    //@ts-ignore
    await client._doc.transactWrite({
      TransactItems: [
        {
          Put: {
            TableName: reflect.blog_post,
            Item: {
              pk: `slug#${slug}`
            },
            ConditionExpression: 'attribute_not_exists(pk)'
          }
        },
        {
          Put: {
            Item: {
              pk: `blog_post#${newCuid}`,
              userId:  `user#${userId}`,
              title: title,
              subTitle: subTitle,
              emoji: emoji,
              slug: `slug#${slug}`,
              createdAt: createdAt,
              updatedAt: updatedAt,
              body: body,
            },
            TableName: reflect.blog_post
          }
        }
      ]
    }).promise();

    return {
      id: newCuid,
      userId:  userId,
      title: title,
      subTitle: subTitle,
      emoji: emoji,
      slug: slug,
      createdAt: createdAt,
      updatedAt: updatedAt,
      body: body,
    };
  } catch (err) {
    console.log(err)
    return {
      errors: {
        slug: "slug already exists"
      }
    }
  }
}

export async function deleteBlogPost({
  id,
}: {
  id: string;
}) {
  const db = await arc.tables();
  const result = await db.blog_post.get({pk: `blog_post#${id}`});
  await db.blog_post.delete({ pk: `blog_post#${id}` });
  return db.blog_post.delete({ pk: result.slug });
}
