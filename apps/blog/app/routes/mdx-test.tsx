import type { LoaderFunction, LinksFunction } from "remix";
import { json, useLoaderData } from "remix";

import { compileMDX } from "~/compile-mdx.server";

import { useMemo } from "react";

import { getMDXComponent } from "mdx-bundler/client";

import styles from "@jontcrawford/snippets/dist/main.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export const loader: LoaderFunction = async () => {

  const mdxSource = `
---
title: Example Post
published: 2021-02-13
description: This is some description
---

# Wahoo

import { ExampleComponent } from "@jontcrawford/snippets";

Here's a **neat** demo:

<ExampleComponent>test</ExampleComponent>

`.trim();
  const { code } = await compileMDX({mdxSource});
  return json({ code });
};

export default function MDXTest() {
  const { code } = useLoaderData();

  const Component = useMemo(() => getMDXComponent(code), [code]);
  return (
    <main>
      <Component />
    </main>
  );
}
