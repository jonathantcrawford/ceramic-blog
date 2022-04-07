import { Outlet, useCatch } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/server-runtime";



export default function Blog() {
  return (
    <Outlet/>
  );
}

export function CatchBoundary() {
  let caught = useCatch();

  switch (caught.status) {
    case 401:
    case 404:
      return (
        <h1>
          {caught.status} {caught.statusText}
        </h1>
      );

    default:
      throw new Error(
        `Unexpected caught response with status: ${caught.status}`
      );
  }
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return (
    <div className="color-error font-sans-3 grid-area-content w-100p">
      <h1 className="">App Error</h1>
      <pre className="white-space-normal">{error.message}</pre>
      <p>
        Replace this UI with what you want users to see when your app throws
        uncaught errors.
      </p>
    </div>
  );
}
