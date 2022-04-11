import cuid from "cuid";
import arc from "@architect/functions";

type LogPageViewProps = {
    utm_source: string | null;
    blogPostId: string;
}

export async function logPageView({blogPostId, utm_source}: LogPageViewProps) {

  const db = await arc.tables();

  await db.analytics.put({
    pk: `view#${cuid()}`,
    blogPostId: `blog_post#${blogPostId}`,
    utm_source,
    createdAt: (new Date()).toISOString()
  });

}

export async function getBlogPostAnalytics({blogPostId}: any) {

  const db = await arc.tables();

  const result = await db.analytics.query({
    IndexName: 'byBlogPostId',
    KeyConditionExpression: "blogPostId = :blogPostId",
    ExpressionAttributeValues: { ":blogPostId": `blog_post#${blogPostId}`}
  })


  return result.Items.map((n: any) => ({
    createdAt: n.createdAt,
    id: n.pk.replace(/^view#/, ""),
    blogPostId: n.blogPostId.replace(/^blog_post#/, ""),
    utm_source: n.utm_source
  }));

}

