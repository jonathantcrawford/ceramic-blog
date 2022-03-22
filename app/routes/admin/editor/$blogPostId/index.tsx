import { useOutletContext } from "@remix-run/react";
import { useMemo } from "react";
import { getMDXComponent } from "mdx-bundler/client";

export default function Preview() {
    const {code, error} = useOutletContext();

    const Component = useMemo(() => code ? getMDXComponent(code) : () => <div>{JSON.stringify(error)}</div>, [code, error]);

    return (<Component/>)
}