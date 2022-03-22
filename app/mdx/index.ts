import { getMDXComponent } from "mdx-bundler/client";
import { ExampleComponent } from "./ExampleComponent/ExampleComponent";
import { CodeSnippet } from "./CodeSnippet/CodeSnippet";

const mdxComponents = {
    ExampleComponent,
    CodeSnippet
}

export {
    getMDXComponent,
    mdxComponents
}