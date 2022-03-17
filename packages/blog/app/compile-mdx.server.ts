
import {bundleMDX} from 'mdx-bundler';






export const compileMDX = async () => {

  const mdxSource = `
---
title: Example Post
published: 2021-02-13
description: This is some description
---

# Wahoo

import { ExampleComponent } from "@ceramic-blog/snippets";

Here's a **neat** demo:

<ExampleComponent>test</ExampleComponent>

`.trim()
  
  const result = await bundleMDX({
    source: mdxSource
  })

  const {code} = result;

  return {code} 


}