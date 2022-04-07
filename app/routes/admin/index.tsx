import type { LinksFunction } from "@remix-run/server-runtime";
import { useFetcher, useOutletContext, Link } from "@remix-run/react";
import { useEffect, useRef, useState, useMemo } from "react";

import { compileMDX } from "~/compile-mdx.server";

import { Core, PublicID } from '@self.id/core';
import type { SelfID } from "@self.id/web";
import publishedModel from "~ceramic/models/model.json";
import type { ModelTypes, BlogPostItem } from "~ceramic/models/types";
import type { ModelTypesToAliases } from "@glazed/types";

import { getMDXComponent } from "mdx-bundler/client";

import { PostLinks } from "~/components/PostLinks/PostLinks";

import "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

import {
    faPlus
} from "@fortawesome/free-solid-svg-icons";




export default function Editor() {

    const {selfID}: {selfID: SelfID<ModelTypes> | undefined} = useOutletContext();

    const [blogPosts, setBlogPosts] = useState<BlogPostItem[]>([]);

    const [profileData, setProfileData] = useState<any>(null);

    const [title, setTitle] = useState("");
    const [subTitle, setSubTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [text, setText] = useState("");

    useEffect(() => {
        const syncProfileData = async () => {
            const basicProfileDefinitionID = await selfID?.client.dataModel.getDefinitionID("basicProfile");
            const doc = await selfID?.client.dataStore.getRecordDocument(basicProfileDefinitionID as string, selfID?.id);
            doc?.subscribe((value) => {
              if (value?.next) {
                    setProfileData(value?.next?.content);
              } else {
                setProfileData(value?.content);
              }
            });
        }
        if (selfID) {
            syncProfileData();
        }
    },[selfID])


    return (
        <div className="flex-[1_1_auto] grid grid-cols-[50vw_50vw]">
            <div className="flex flex-col p-8">
                {profileData &&
                    <>
                        <div className="text-yellow-100 font-saygon text-3xl mb-4">{profileData.name}</div>
                        <div className="text-yellow-100 font-saygon text-xl mb-4">{profileData.homeLocation}</div>
                        <a rel="noreferrer" href={`https://twitter.com/${profileData.twitter}`} target="_blank" className="mb-4 text-yellow-100 font-saygon text-xl hover:text-yellow-200">
                            <FontAwesomeIcon className="text-lg mr-4" icon={faTwitter} />
                            {`@${profileData.twitter}`}
                        </a>
                        <div className="text-yellow-100 font-saygon text-xl mb-4">{profileData.emoji}</div>
                        <div className="text-white-100 font-hamlin text-4xl italic mb-4">{profileData.description}</div>
                        
                    </>
                }
            </div>
            <div className="flex flex-col p-8">
                <Link key="new" className="btn self-end" to={'editor/new'}><FontAwesomeIcon className="text-base mr-2" icon={faPlus}/> new post</Link>
                {/* {selfID?.did && <PostLinks linkPrefix={'editor/'} did={selfID?.id}/>} */}
            </div>
        </div>   
    )
}