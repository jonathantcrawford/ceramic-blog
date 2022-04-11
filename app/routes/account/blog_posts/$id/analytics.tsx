import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/session.server";
import { getBlogPostById } from "~/models/blog_post.server";
import { getBlogPostAnalytics } from "~/models/analytics.server";

export const loader: LoaderFunction = async ({request, params}: any) => {
    await requireUserId(request);
    const id = params.id;
    if (!id) return json(null, {status: 500});
    
    const blogPost = await getBlogPostById({id});
    const analytics = await getBlogPostAnalytics({blogPostId: blogPost?.id });
    console.log(analytics)
    const url = new URL(request.url);
    return {analytics, blogPost, host: url.host, protocol: url.protocol}
}

export default function BlogPostAnalytics() {

    const {blogPost, host, protocol, analytics} = useLoaderData();

    const linkedInViews = analytics.filter((analytic: any) => analytic.utm_source === 'linkedin');
    const twitterViews = analytics.filter((analytic: any) => analytic.utm_source === 'twitter');
    const slackViews = analytics.filter((analytic: any) => analytic.utm_source === 'slack');
    const directViews = analytics.filter((analytic: any) => analytic.utm_source === '');

    return (
        <div className="flex flex-col">
            <div className="flex flex-col">
                <span className="font-saygon text-yellow-100 text-base">LinkedIn Views: {linkedInViews.length}</span>
                <code className="font-mono text-pink-200 bg-gray-100">{`${protocol}//${host}/blog/${blogPost?.slug}?utm_source=linkedin`}</code>
            </div>
            <div className="flex flex-col">
                <span className="font-saygon text-yellow-100 text-base">Twitter Views: {twitterViews.length}</span>
                <code className="font-mono text-pink-200 bg-gray-100">{`${protocol}//${host}/blog/${blogPost?.slug}?utm_source=twitter`}</code>
            </div>
            <div className="flex flex-col">
                <span className="font-saygon text-yellow-100 text-base">Slack Views: {slackViews.length}</span>
                <code className="font-mono text-pink-200 bg-gray-100">{`${protocol}//${host}/blog/${blogPost?.slug}?utm_source=slack`}</code>
            </div>

            <div className="flex flex-col">
                <span className="font-saygon text-yellow-100 text-base">Direct Views: {directViews.length}</span>
                <code className="font-mono text-pink-200 bg-gray-100">{`${protocol}//${host}/blog/${blogPost?.slug}`}</code>
            </div>
        </div>
    )
}