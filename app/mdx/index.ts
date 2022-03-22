import { getMDXComponent } from "mdx-bundler/client";
import { ExampleComponent } from "./ExampleComponent/ExampleComponent";
import { CodeSnippet } from "./CodeSnippet/CodeSnippet";
import { CookiesDemo } from "./CookiesDemo/CookiesDemo";

const mdxComponents = {
    ExampleComponent,
    CodeSnippet,
    CookiesDemo
}

export {
    getMDXComponent,
    mdxComponents
}