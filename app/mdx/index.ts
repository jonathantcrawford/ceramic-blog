import { getMDXComponent } from "mdx-bundler/client";
import { ExampleComponent } from "./ExampleComponent/ExampleComponent";
import { CodeSnippet } from "./CodeSnippet/CodeSnippet";
import { CookiesDemo } from "./CookiesDemo/CookiesDemo";
import { WebSocketDemo } from "./WebSocketDemo/WebSocketDemo";

const mdxComponents = {
    ExampleComponent,
    CodeSnippet,
    CookiesDemo,
    WebSocketDemo
}

export {
    getMDXComponent,
    mdxComponents
}