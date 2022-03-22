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
      className={[className, isPending ? "border-pink-200 text-pink-200" : "border-yellow-100 text-yellow-100 hover:text-yellow-200 hover:cursor-pointer hover:border-yellow-200"].join(" ")}
      data-pending={isPending ? "true" : null}
      to={to}
      prefetch={prefetch}
    >
      {children}
    </NavLink>
  );
}

export const PostLinks = ({linkPrefix, did}: {linkPrefix: string, did: string}) => {

  const [blogPosts, setBlogPosts] = useState<Array<BlogPostItem> | []>([])
  

  useEffect(() => {
    const load = async () => {
      const model: ModelTypesToAliases<ModelTypes> = publishedModel;
      const core = new Core<ModelTypes>({ ceramic: 'testnet-clay', model });
      const blogPostDefinitionID = await core.dataModel.getDefinitionID("blogPosts");
      const doc = await core.dataStore.getRecordDocument(blogPostDefinitionID as string, did);
      doc?.subscribe((value) => {
        if (value?.next) {
            setBlogPosts(value?.next?.content.blogPosts);
        } else {
            setBlogPosts(value.content.blogPosts);
        }
      });

    }
    load();
  },[])

  return (
    <>
      <div className="mt-8 font-saygon text-3xl font-normal text-pink-200 mb-6 pb-2 border-b-2 border-b-solid border-b-pink-200">
        Blog Posts
      </div>
      <div className="grid auto-rows-min grid-flow-row gap-[5vh]">
        {blogPosts.map(blogPost => (
          <PendingNavLink
            key={`${blogPost.id.replace(/ceramic:\/\//g, '')}`}
            prefetch="intent"
            to={`${linkPrefix}${blogPost.id.replace(/ceramic:\/\//g, '')}`}
            className="p-[3vmin] rounded-[2vmin] border-[0.05vmin] no-underline flex flex-col"
          >
                <span className="text-2xl font-normal font-saygon pb-2">
                  {blogPost.emoji} {`${blogPost.title}`}
                </span>
                <span className="text-xl font-light font-saygon pb-4">
                  {blogPost.subTitle}
                </span>
                <span className="text-lg font-light font-saygon text-align-right">
                  {blogPost.date}
                </span>
          </PendingNavLink>
          ))}
      </div>
    </>
  );
};
