import { useEffect, useState, useRef, useCallback } from "react";

import type { LoaderFunction } from "@remix-run/server-runtime";

import { Outlet } from "@remix-run/react";
import { redirect } from "@remix-run/server-runtime";

import type { SelfID } from "@self.id/web";

import publishedModel from "~ceramic/models/model.json";
import type { ModelTypes } from "~ceramic/models/types";
import type { ModelTypesToAliases } from "@glazed/types";


// export const loader: LoaderFunction = async () => {
//   return redirect("/");
// };

export default function Admin() {
  //const [profile, setProfile] = useState<any>(null);

  // const [blogPosts, setBlogPosts] = useState<any>([]);

  // const [title, setTitle] = useState("");
  // const [subTitle, setSubTitle] = useState("");
  // const [slug, setSlug] = useState("");
  // const [text, setText] = useState("");


  const [isLoading, setIsLoading] = useState(true);
  

  const [selfID, setSelfID] = useState<SelfID<ModelTypes> | undefined>();


  const connect = useCallback(async () => {
    if (typeof document !== "undefined") {
      const model: ModelTypesToAliases<ModelTypes> = publishedModel;

      const module = await import("@self.id/web");

      //@ts-ignore
      const authProvider = new module.default.EthereumAuthProvider(
        //@ts-ignore
        window.ethereum,
        //@ts-ignore
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

      setSelfID(self);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    //@ts-ignore
    if (typeof document !== "undefined" && window.ethereum.selectedAddress) {
      connect();
    } else {
      Promise.all([
        new Promise(resolve => setTimeout(resolve, 800))
      ]).then(() => setIsLoading(false));
    }
  }, [connect]);

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
      {!isLoading && !selfID && <div className="h-full flex justify-center items-center"><div className="flex-[0_0_auto] btn h-[80px]" onClick={() => authenticate()}>authenticate</div></div>}
      {isLoading && 
        <div className="flex-[1_1_auto] text-yellow-100 font-saygon text-4xl place-self-center flex flex-col justify-center">
          loading
        </div>
      }
      {!isLoading && selfID && <Outlet context={{selfID}} /> }
    </div>
  );
}
