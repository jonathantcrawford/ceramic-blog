import cuid from "cuid";
import arc from "@architect/functions";

export type BlogPost = {
  id: string;
  userId: string;
  title: string;
  subTitle: string;
  emoji: string;
  slug: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  body: string;
  images: string[];
  previewImageMDX: string;
  previewImageUrl: string;
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
      status: result.status,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      images: result.images,
      body: result.body,
      previewImageMDX: result.previewImageMDX,
      previewImageUrl: result.previewImageUrl
    };
  }
  return null;
}

export async function getBlogPostBySlug({
  slug,
}: {
  slug: string;
}): Promise<Omit<BlogPost, "userId" | "images"> | null> {
  const db = await arc.tables();

  const result = await await db.blog_post.query({
    IndexName: 'bySlug',
    KeyConditionExpression: "slug = :slug",
    ExpressionAttributeValues: { ":slug": `slug#${slug}` },
  })

  const [record] = result.Items;

  if (record) {
    return {
      id: record.pk.replace(/^blog_post#/, ""),
      title: record.title,
      subTitle: record.subTitle,
      emoji: record.emoji,
      slug: record.slug.replace(/^slug#/, ""),
      status: record.status,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      body: record.body,
      previewImageMDX: record.previewImageMDX,
      previewImageUrl: record.previewImageUrl
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
    ExpressionAttributeValues: { ":userId": `user#${userId}`, ':pk': 'blog_post#' },
    FilterExpression: 'begins_with(pk, :pk)'
  });

  return result.Items.map((n: any) => ({
    title: n.title,
    id: n.pk.replace(/^blog_post#/, ""),
    emoji: n.emoji,
    status: n.status,
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
    status: n.status,
    createdAt: n.createdAt,
    updatedAt: n.updatedAt,
    slug: n.slug.replace(/^slug#/, ""),
  }));
}

export async function getPublishedBlogPostItems()
: Promise<Array<Omit<BlogPost, "body" >>> {
  const blogPostItems = await getBlogPostListItems();
  return blogPostItems.filter(blogPost => blogPost.status === 'published');
}

export async function createBlogPost({
  userId,
}: {
  userId: string,
}): Promise<{blogPost?: Pick<BlogPost, "id">, errors?: any}> {
 

  const client = await arc.tables();
  
  //@ts-ignore
  const reflect = await client.reflect()

  
  try {
    const newCuid = cuid();
    const createdAt = (new Date()).toISOString();
    const updatedAt = createdAt;

    const newSlug = `slug#${cuid()}`;


    //@ts-ignore
    await client._doc.transactWrite({
      TransactItems: [
        {
          Put: {
            Item: {
              pk: `blog_post#${newCuid}`,
              userId:  `user#${userId}`,
              title: '',
              subTitle: '',
              emoji: '',
              slug: newSlug,
              status: 'draft',
              createdAt: createdAt,
              updatedAt: updatedAt,
              body: '',
              previewImageMDX: ''
            },
            TableName: reflect.blog_post
          }
        }
      ]
    }).promise();

    return {
      blogPost: {
        id: newCuid
      }
    };
  } catch (err) {
    console.log(err)
    return {
      errors: {
        generic: "unknown error"
      }
    }
  }
}

export async function updateBlogPostContent({
  title,
  subTitle,
  emoji,
  status,
  body,
  id,
  userId,
}: {
  title: string,
  subTitle: string,
  emoji: string,
  status: string,
  body: string,
  id: string,
  userId: string;
}): Promise<{blogPost?: Pick<BlogPost, "id" | "userId" | "title" | "subTitle" | "emoji" | "status" | "updatedAt" | "body">, errors?: any}> {
 

  const client = await arc.tables();
  
  //@ts-ignore
  const reflect = await client.reflect()

  
  try {
    const updatedAt = (new Date()).toISOString();

    const result = await getBlogPostById({id});
    if (!result) {
      return {
        errors: {
          generic: "could not perform update. blog post id was not found."
        }
      }
    }
    
    //@ts-ignore
    await client._doc.transactWrite({
      TransactItems: [
        {
          Update: {
            Key: {
              pk: `blog_post#${id}`,
            },
            UpdateExpression: "SET title = :title, subTitle = :subTitle, emoji = :emoji, updatedAt = :updatedAt, body = :body, #status = :status",
            ExpressionAttributeNames: {
              '#status': 'status'
            },
            ExpressionAttributeValues: {
              ':title': title,
              ':subTitle': subTitle,
              ':emoji': emoji,
              ':status': status,
              ':updatedAt': updatedAt,
              ':body': body,
            },
            TableName: reflect.blog_post
          }
        }
      ]
    }).promise();

    return {
      blogPost: {
        id: id,
        userId:  userId,
        title: title,
        subTitle: subTitle,
        emoji: emoji,
        status: status,
        updatedAt: updatedAt,
        body: body,
      }
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

export async function updateBlogPost({
  title,
  subTitle,
  emoji,
  slug,
  status,
  body,
  id,
  userId,
  previewImageMDX,
  previewImageUrl
}: {
  title?: string,
  subTitle?: string,
  emoji?: string,
  slug?: string,
  status?: string,
  body?: string,
  id: string,
  userId: string;
  previewImageMDX?: string;
  previewImageUrl?: string;
}): Promise<{blogPost?: Omit<BlogPost, "createdAt" | "images">, errors?: any}> {
 

  const client = await arc.tables();
  
  //@ts-ignore
  const reflect = await client.reflect()

  
  try {
    const updatedAt = (new Date()).toISOString();

    const result = await getBlogPostById({id});
    if (!result) {
      return {
        errors: {
          generic: "could not perform update. blog post id was not found."
        }
      }
    }

    const {slug: oldSlug} = result;


    const slugUpdates = slug === oldSlug || slug === undefined ? [] : [
      {
        Put: {
          TableName: reflect.blog_post,
          Item: {
            pk: `slug#${slug}`,
            userId: `user#${userId}`
          },
          ConditionExpression: 'attribute_not_exists(pk)'
        }
      },
      {
        Delete: {
          TableName: reflect.blog_post,
          Key: {
            pk: `slug#${oldSlug}`,
          },
          ConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':userId': `user#${userId}`
          }
        }
      },
    ];

    const updateExpression = [];
    const expressionAttributeValues: any = {};
    const expressionAttributeNames: any = {};
    if (title) {
      updateExpression.push('title = :title');
      expressionAttributeValues[':title'] = title;
    }

    if (subTitle) {
      updateExpression.push('subTitle = :subTitle');
      expressionAttributeValues[':subTitle'] = subTitle;
    }

    if (emoji) {
      updateExpression.push('emoji = :emoji');
      expressionAttributeValues[':emoji'] = emoji;
    }

    if (slug) {
      updateExpression.push('slug = :slug');
      expressionAttributeValues[':slug'] = `slug#${slug}`;
    }

    if (body) {
      updateExpression.push('body = :body');
      expressionAttributeValues[':body'] = body;
    }

    if (previewImageMDX) {
      updateExpression.push('previewImageMDX = :previewImageMDX')
      expressionAttributeValues[':previewImageMDX'] = previewImageMDX;
    }

    if (previewImageUrl) {
      updateExpression.push('previewImageUrl = :previewImageUrl')
      expressionAttributeValues[':previewImageUrl'] = previewImageUrl;
    }

    if (status) {
      updateExpression.push('#status = :status')
      expressionAttributeValues[':status'] = status;
      expressionAttributeNames['#status'] = 'status';
    }

    if (updateExpression.length === 0) {
      return {
        errors: {
          generic: 'no fields were provided'
        }
      }
    }

    updateExpression.push('updatedAt = :updatedAt');
    expressionAttributeValues[':updatedAt'] = updatedAt;

    
    
    //@ts-ignore
    await client._doc.transactWrite({
      TransactItems: [
        ...slugUpdates,
        {
          Update: {
            Key: {
              pk: `blog_post#${id}`,
            },
            UpdateExpression: `SET ${updateExpression.join(', ')}`,
            ...(Object.keys(expressionAttributeNames).length > 0 ? {ExpressionAttributeNames: expressionAttributeNames } : {}),
            ExpressionAttributeValues: expressionAttributeValues,
            TableName: reflect.blog_post
          }
        }
      ]
    }).promise();

    return {
      blogPost: {
        id: id,
        userId:  userId,
        title: title ?? result.title,
        subTitle: subTitle ?? result.subTitle,
        emoji: emoji ?? result.emoji,
        slug: slug ?? result.slug,
        status: status ?? result.slug, 
        updatedAt: updatedAt,
        previewImageMDX: previewImageMDX ?? result.previewImageMDX,
        previewImageUrl: previewImageUrl ?? result.previewImageUrl,
        body: body ?? result.body,
      }
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

export async function updateBlogPostImages({
  images,
  id,
  userId,
}: {
  images: string[],
  id: string,
  userId: string;
}): Promise<{blogPost?: Pick<BlogPost, "id" | "userId" | "images" | "updatedAt">, errors?: any}> {
 

  const client = await arc.tables();
  
  //@ts-ignore
  const reflect = await client.reflect()

  
  try {
    const updatedAt = (new Date()).toISOString();

    const result = await getBlogPostById({id});
    if (!result) {
      return {
        errors: {
          generic: "could not perform update. blog post id was not found."
        }
      }
    }

    
    //@ts-ignore
    await client._doc.transactWrite({
      TransactItems: [
        {
          Update: {
            Key: {
              pk: `blog_post#${id}`,
            },
            UpdateExpression: "SET images = :images, updatedAt = :updatedAt",
            ExpressionAttributeValues: {
              ':images': images,
              ':updatedAt': updatedAt
            },
            TableName: reflect.blog_post
          }
        }
      ]
    }).promise();

    return {
      blogPost: {
        id: id,
        userId:  userId,
        images: images,
        updatedAt: updatedAt
      }
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
