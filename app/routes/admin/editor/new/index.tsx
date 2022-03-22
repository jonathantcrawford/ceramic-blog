import { useOutletContext } from "@remix-run/react";
import { useMemo } from "react";
import { getMDXComponent, mdxComponents } from "~/mdx";

export default function Preview() {
    const {code, error} = useOutletContext();

    const Component = useMemo(() => code ? getMDXComponent(code) : () => <div>{JSON.stringify(error)}</div>, [code, error]);

    return (<Component components={mdxComponents}/>)
}