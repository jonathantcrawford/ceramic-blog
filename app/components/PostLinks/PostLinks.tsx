import { useEffect, useState } from "react";

import { NavLink, useResolvedPath, useTransition } from "@remix-run/react";


import { BlogPost } from "~/models/blog_post.server";



function PendingNavLink({ className, to, prefetch, children }: any) {
  const transition = useTransition();
  const path = useResolvedPath(to);

  const isPending =
    transition.state === "loading" &&
    transition.location.pathname === path.pathname;

  return (
    <NavLink
      className={[className, isPending ? "border-pink-200 text-pink-200" : "border-yellow-100 text-yellow-100 hover:text-yellow-200 hover:cursor-pointer hover:border-yellow-200"].join(" ")}
      data-pending={isPending ? "true" : null}
      to={to}
      prefetch={prefetch}
    >
      {children}
    </NavLink>
  );
}

export const PostLinks = ({title, linkPrefix, linkAttribute, posts}: {title: string, linkPrefix: string, linkAttribute: string, posts: Omit<BlogPost, "body">[] }) => {

  //const [blogPosts, setBlogPosts] = useState<Array<BlogPostItem> | []>([])
  

  // useEffect(() => {
  //   const load = async () => {
  //     const model: ModelTypesToAliases<ModelTypes> = publishedModel;
  //     const core = new Core<ModelTypes>({ ceramic: 'testnet-clay', model });
  //     const blogPostDefinitionID = await core.dataModel.getDefinitionID("blogPosts");
  //     const doc = await core.dataStore.getRecordDocument(blogPostDefinitionID as string, did);
  //     doc?.subscribe((value) => {
  //       if (value?.next) {
  //           setBlogPosts(value?.next?.content.blogPosts);
  //       } else {
  //           setBlogPosts(value.content.blogPosts);
  //       }
  //     });

  //   }
  //   load();
  // },[])

  return (
    <>
      <div className="font-saygon text-2xl font-normal text-pink-200 mb-6 pb-2 border-b-2 border-b-solid border-b-pink-200">
        {title}
      </div>
      <div className="grid auto-rows-min grid-flow-row gap-6 mb-6">
        {posts.sort((a,b) => {
          const aDate: any = new Date(a.createdAt);
          const bDate: any = new Date(b.createdAt);
          return bDate.getTime() - aDate.getTime();
        } ).map((post: any) => (
          <PendingNavLink
            key={post.slug}
            prefetch="intent"
            to={`${linkPrefix}${post[linkAttribute]}`}
            className="p-5 rounded-[2vmin] border-[0.05vmin] no-underline flex mobile:flex-col md:flex-row md:items-center md:flex-wrap"
          >
                <span className="text-xl font-normal font-saygon mb-2 md:flex-[1_1_100%]">
                  {post.emoji} {`${post.title}`}
                </span>
                <span className="text-lg font-light font-saygon mb-2 md:flex-[1_1_70%]">
                  {post.subTitle}
                </span>
                <span className="text-base font-light font-saygon mb-2 md:flex-[1_1_30%] md:text-right">
                  {new Date(post.updatedAt).toDateString()}
                </span>
          </PendingNavLink>
          ))}
      </div>
    </>
  );
};
