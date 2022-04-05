import { useEffect, useState } from "react";

import { Form, useOutletContext, useTransition, useFetcher } from "@remix-run/react";

import { AnimatePresence, motion } from "framer-motion";

import { CodeSnippet } from "~/mdx/CodeSnippet/CodeSnippet";

export function CookiesDemo() {


  const [metadata, setMetaData] = useState<any>(null);
  const [contract, setContract] = useState<any>(null);
  const [tokenId, setTokenId] = useState<any>(null);

  const fetcher = useFetcher();

  useEffect(() => {
    fetcher.load('/api/cookies-demo');
  }, []);

  useEffect(() => {
    if (fetcher.data) {
        setMetaData(fetcher.data.metadata);
        setContract(fetcher.data.contract);
        setTokenId(fetcher.data.tokenId);
    }
  }, [fetcher])


  return (
    <div className="flex flex-wrap-reverse flex-row items-center justify-center">
      <div
        style={{ maxWidth: "500px", width: "100%" }}
        className="flex flex-col items-center"
      >
        <fetcher.Form
          className="w-full"
          method="post"
          action="/api/cookies-demo"
          replace
        >
          <input
            type="hidden"
            name="contract"
            value="0x0AE53C425F0725123205fd4CBDFB1Ac8240445cF"
          />
          <input type="hidden" name="tokenId" value="9264" />

          <button
            type="submit"
            className="btn w-full mb-4 justify-center"
            disabled={
                fetcher?.data?.tokenId === "9264" 
                || fetcher.submission?.formData.get('tokenId') == "9264"
                || fetcher.state !== 'idle'}
          >
            BitBurger #9264
          </button>
        </fetcher.Form>
        <fetcher.Form
          className="w-full"
          method="post"
          action="/api/cookies-demo"
          replace
        >
          <input
            type="hidden"
            name="contract"
            value="0x0AE53C425F0725123205fd4CBDFB1Ac8240445cF"
          />
          <input type="hidden" name="tokenId" value="2558" />
          <button
            type="submit"
            className="btn w-full mb-4 justify-center"
            disabled={
                fetcher?.data?.tokenId === "2558" 
                || fetcher.submission?.formData.get('tokenId') == "2558" 
                || fetcher.state !== 'idle'}
          >
            BitBurger #2558
          </button>
        </fetcher.Form>
        <div
          style={{ maxHeight: "300px", maxWidth: "100%", overflowY: "scroll" }}
        >
          <CodeSnippet
            fileName={contract ?? 'loading'}
            string={JSON.stringify(metadata ?? {status: 'loading'} , null, 2)}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          maxWidth: "450px",
          justifyContent: "center",
          height: "300px",
          margin: "2rem",
        }}
      >
        <AnimatePresence exitBeforeEnter>
          {fetcher.state !== 'idle' && (
            <motion.p
              key={'loading'}
              className="flex items-center justify-center text-pink-200"
              initial="initial"
              animate="in"
              exit="out"
              variants={{
                initial: {
                  opacity: 0,
                },
                in: {
                  opacity: 1,
                },
                out: {
                  opacity: 0,
                },
              }}
              transition={{
                type: "spring",
                duration: 0.6,
              }}
              style={{ width: "20rem"}}
            >
              {fetcher.state === 'submitting' ? 'updating cookie' : 'loading img'}
            </motion.p>
          )}
          {fetcher.state === 'idle' && (
            <motion.img
              key={metadata?.image}
              alt={`${
                metadata && metadata?.image?.replace(/ipfs:\//g, "")
              } nft image`}
              initial="initial"
              animate="in"
              exit="out"
              variants={{
                initial: {
                  opacity: 0,
                  scale: "1%",
                },
                in: {
                  opacity: 1,
                  scale: "100%",
                },
                out: {
                  opacity: 0,
                  scale: "1%",
                },
              }}
              transition={{
                type: "spring",
                duration: 0.8,
              }}
              style={{ width: "20rem" }}
              src={
                metadata &&
                `https://gateway.ipfs.io/ipfs/${metadata?.image?.replace(
                  /ipfs:\//g,
                  ""
                )}`
              }
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
