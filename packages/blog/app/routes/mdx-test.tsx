
import type { LoaderFunction, LinksFunction } from "remix"
import {json, useLoaderData} from "remix"

import { compileMDX } from "~/compile-mdx.server";

import  {useMemo, useState, useEffect, Fragment } from "react";



import {getMDXComponent} from 'mdx-bundler/client'

import styles from '@ceramic-blog/snippets/dist/main.css';

export const links: LinksFunction = () => {
  return [

    { rel: "stylesheet", href: styles}
  ];
};

export const loader: LoaderFunction = async () => {

    const {code} = await compileMDX();
    return json({code});
}

export default function MDXTest() {

    const { code } = useLoaderData();

    const Component = useMemo(
        () => getMDXComponent(code),
        [code],
      )
      return (
        <main>
          <Component />
        </main>
      )


    
}