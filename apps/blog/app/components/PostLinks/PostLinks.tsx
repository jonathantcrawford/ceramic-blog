import { useEffect, useState } from "react";

import { NavLink, useResolvedPath, useTransition } from "@remix-run/react";

import { Core, PublicID } from '@self.id/core';

import publishedModel from "~ceramic/models/model.json";
import type { ModelTypes, BlogPostItem } from "~ceramic/models/types";
import type { ModelTypesToAliases } from "@glazed/types";



function PendingNavLink({ className, to, prefetch, children }: any) {
  const transition = useTransition();
  const path = useResolvedPath(to);

  const isPending =
    transition.state === "loading" &&
    transition.location.pathname === path.pathname;

  return (
    <NavLink
      className={[className, isPending ? "text-pink-200 border-pink-200" : null].join(" ")}
      data-pending={isPending ? "true" : null}
      to={to}
      prefetch={prefetch}
    >
      {children}
    </NavLink>
  );
}

export const PostLinks = () => {

  const [blogPosts, setBlogPosts] = useState<Array<BlogPostItem> | []>([])
  

  useEffect(() => {
    const load = async () => {
      const model: ModelTypesToAliases<ModelTypes> = publishedModel;
      const core = new Core<ModelTypes>({ ceramic: 'testnet-clay', model });
      const blogOwnerID = await new PublicID({core, id: 'did:3:kjzl6cwe1jw147j8id1v2ovge4mgdu7luvpuiw34qg5ixc4zixa0qpza4kpruf6'});
      const [blogPostsDocument] = await Promise.all([
        blogOwnerID.get('blogPosts'),
      ]);
      setBlogPosts(blogPostsDocument?.blogPosts as Array<BlogPostItem>);

    }
    load();
  })

  return (
    <>
      <div className="mt-8 font-saygon text-3xl font-normal text-pink-200 mb-6 pb-2 border-b-2 border-b-solid border-b-pink-200">
        Blog Posts
      </div>
      <div className="grid auto-rows-min grid-flow-row gap-[5vh]">
        {blogPosts.map(blogPost => (
          <PendingNavLink
            prefetch="intent"
            to={`${blogPost.id.replace(/ceramic:\/\//g, '')}`}
            className="p-[3vmin] rounded-[2vmin] border-[0.05vmin] border-yellow-100 no-underline text-yellow-100 flex flex-col hover:text-yellow-200 hover:cursor-pointer hover:border-yellow-200"
          >
                <span className="text-2xl font-normal font-saygon pb-2">
                  {"🔥"} {`${blogPost.title}`}
                </span>
                <span className="text-xl font-light font-saygon pb-4">
                  {"Does edge server side rendering live up to the hype?"}
                </span>
                <span className="text-lg font-light font-saygon text-align-right">
                  {"02/02/2022"}
                </span>
          </PendingNavLink>
          ))}
      </div>
    </>
  );
};
