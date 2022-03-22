import { bundleMDX } from "mdx-bundler";

import path from "path";

import "esbuild";

export const compileMDX = async ({mdxSource}: {mdxSource: any}) => {


  if (process.platform === "win32") {
    process.env.ESBUILD_BINARY_PATH = path.join(
      process.cwd(),
      "node_modules",
      "esbuild",
      "esbuild.exe"
    );
  } else {
    process.env.ESBUILD_BINARY_PATH = path.join(
      process.cwd(),
      "node_modules",
      "esbuild",
      "bin",
      "esbuild"
    );
  }

  const result = await bundleMDX({
    source: mdxSource.trim(),
  });

  const { code } = result;

  return { code };
};
