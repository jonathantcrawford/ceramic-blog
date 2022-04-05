
import {
    Outlet,
  } from "@remix-run/react";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";

import { Header } from "~/components/Header/Header";
import { Footer } from "~/components/Footer/Footer";




export default function Main() {


    return (
        <div className="grid grid-areas-layout grid-cols-layout grid-rows-layout min-h-screen bg-black-100">
        <div className="grid-in-ga-header w-full">
          <Header />
        </div>

        <Outlet />
        <div
          className="grid-in-ga-footer place-self-center w-full"
        >
          <Footer />
        </div>
      </div>
    )
}