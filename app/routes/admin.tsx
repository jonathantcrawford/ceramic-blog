import { useEffect, useState, useRef } from "react";

import { Outlet } from "remix";

import type { SelfID } from "@self.id/web";

import publishedModel from "~ceramic/models/model.json";
import type { ModelTypes } from "~ceramic/models/types";
import type { ModelTypesToAliases } from "@glazed/types";

export default function Admin() {
  //const [profile, setProfile] = useState<any>(null);

  // const [blogPosts, setBlogPosts] = useState<any>([]);

  // const [title, setTitle] = useState("");
  // const [subTitle, setSubTitle] = useState("");
  // const [slug, setSlug] = useState("");
  // const [text, setText] = useState("");



  const model: ModelTypesToAliases<ModelTypes> = publishedModel;

  const [selfID, setSelfID] = useState<SelfID<ModelTypes> | undefined>();


  const connect = async () => {
    if (typeof document !== "undefined") {
      const module = await import("@self.id/web");

      //@ts-ignore
      const authProvider = new module.default.EthereumAuthProvider(
        window.ethereum,
        window.ethereum.selectedAddress
      );

      // The following configuration assumes your local node is connected to the Clay testnet
      //@ts-ignore
      const self = await module.default.SelfID.authenticate<ModelTypes>({
        //@ts-ignore
        model: model,
        authProvider: authProvider,
        ceramic: "testnet-clay",
        connectNetwork: "testnet-clay",
      });
      //blogPostTile.current = await self.client.tileLoader.load()

      // const blogPostDefinitionID =
      //   await self.client.dataModel.getDefinitionID("blogPosts");
      // const doc = await self.client.dataStore.getRecordDocument(
      //   blogPostDefinitionID as string
      // );
      // doc?.subscribe((value) => setBlogPosts(value?.next?.content.blogPosts));
      //console.log(doc)

      //const blogPosts = await self.get("blogPosts");

      //setBlogPosts(blogPosts?.blogPosts);
      // if (blogPosts) {
      //       const blogPost = await self.client.tileLoader.load(blogPosts?.blogPosts[0].id);
      //      console.log(blogPost);
      //      //setBlogPosts(blogPost);
      // //}

      setSelfID(self)
    }
  };

  useEffect(() => {
    //@ts-ignore
    if (typeof document !== "undefined" && window.ethereum.selectedAddress) {
      connect();
    }
  }, []);

  const authenticate = async () => {
    if (typeof document !== "undefined") {
      //@ts-ignore
      await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      connect();
    }
  };

  // const publish = async () => {
  //   if (typeof document !== "undefined") {
  //     const doc = await selfID.current?.client.dataModel.createTile(
  //       "BlogPost",
  //       {
  //         date: new Date().toISOString(),
  //         text: text,
  //       }
  //     );
  //     if (doc) {
  //       selfID.current?.set("blogPosts", {
  //         blogPosts: [...blogPosts, { id: doc.id.toUrl(), title: title }],
  //       });
  //     }
  //   }
  // };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-[0_0_auto]" onClick={() => authenticate()}>authenticate</div>
      {/* <div>{JSON.stringify(profile)}</div>
      <div>{blogPosts && JSON.stringify(blogPosts)}</div>
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          value={subTitle}
          onChange={(e) => setSubTitle(e.target.value)}
        />
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <button onClick={() => publish()}>publish</button>
      </div> */}
      {selfID && <Outlet context={{selfID}} /> }
    </div>
  );
}
