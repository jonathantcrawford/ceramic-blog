import { useOutletContext, useFetcher, useCatch } from "@remix-run/react";
import type { LoaderFunction } from "remix";
import { useMemo, useEffect } from "react";
import { getMDXComponent, mdxComponents } from "~/mdx";


export default function Preview() {
    const context: any = useOutletContext();



    const Component = useMemo(() => 
        context?.code
        ? getMDXComponent(context?.code) 
        : () => (
            <div className="h-full text-red-100 text-md font-saygon flex items-center justify-center">
                {context?.error}
            </div>
            )
        , [context]);

    return (<Component components={mdxComponents}/>)

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

