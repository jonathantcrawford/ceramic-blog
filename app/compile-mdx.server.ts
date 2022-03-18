import { bundleMDX } from "mdx-bundler";

import esbuild from "esbuild"

import path from 'path'



export const compileMDX = async () => {
  let version = esbuild.version;

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

  if (process.platform === 'win32') {
    process.env.ESBUILD_BINARY_PATH = path.join(
      process.cwd(),
      'node_modules',
      'esbuild',
      'esbuild.exe',
    )
  } else {
    process.env.ESBUILD_BINARY_PATH = path.join(
      process.cwd(),
      'node_modules',
      'esbuild',
      'bin',
      'esbuild',
    )
  }

  const result = await bundleMDX({
    source: mdxSource,
  });

  const { code } = result;

  return { code };
};
