import { useEffect, useState } from "react";
import { Core, PublicID } from '@self.id/core';

import { json, useLoaderData } from "remix";
import type { LinksFunction } from "remix";

import publishedModel from "~ceramic/models/model.json";
import type { ModelTypes, BlogPost } from "~ceramic/models/types";
import type { ModelTypesToAliases } from "@glazed/types";


import { PostHeader } from "~/components/PostHeader/PostHeader";


export const loader = async ({ params }: any) => {
    return json(params.did);
  };

export default function Did() {
    const did = useLoaderData();

    const [tileDocumentContent, setTileDocumentContent] = useState<BlogPost>()

    useEffect(() => {
        const load = async () => {
            const model: ModelTypesToAliases<ModelTypes> = publishedModel;
            const core = new Core<ModelTypes>({ ceramic: 'testnet-clay', model });
            const tileDocument = await core.tileLoader.load(did);
            tileDocument.subscribe(value => {
                setTileDocumentContent(value?.content) 
            });
        }
        load();
      })



    return (
        <div className="grid-in-ga-content w-100p markdown">
            {tileDocumentContent && <PostHeader info={{date: tileDocumentContent.date}}/>}
            {tileDocumentContent && <p>{tileDocumentContent.text}</p>}
        </div>
    )
}