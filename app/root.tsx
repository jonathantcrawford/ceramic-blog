import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import {
  json
} from "@remix-run/server-runtime"
import type { LinksFunction, MetaFunction, LoaderFunction } from "@remix-run/node";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getUser } from "./session.server";


export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    // NOTE: Architect deploys the public directory to /_static/
    { rel: "icon", href: "/_static/favicon.ico" },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix Notes",
  viewport: "width=device-width,initial-scale=1",
});

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
  ENV: any;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  return json<LoaderData>({
    user: await getUser(request),
    ENV: {
      HTTP_PROTOCOL: process.env.NODE_ENV === "development" ? "http://" : "https://",
      WS_URL: process.env.NODE_ENV === "development" ? `ws://${url.host}` : process.env.ARC_WSS_URL,
      HOST: url.host,
      NODE_ENV: process.env.NODE_ENV,
    },
  });
};

export default function App() {
  const {ENV} = useLoaderData();

  return (
    <html lang="en" className="h-full bg-black-100">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
