import type { LoaderFunction, LinksFunction } from "remix";
import { json, useLoaderData } from "remix";

import { compileMDX } from "~/compile-mdx.server";

import { useMemo } from "react";


import { getMDXComponent, mdxComponents } from "~/mdx";


export const loader: LoaderFunction = async () => {

  const mdxSource = `
---
title: Example Post
published: 2021-02-13
description: This is some description
---

# Wahoo

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
      <Component components={mdxComponents}/>
    </main>
  );
}
