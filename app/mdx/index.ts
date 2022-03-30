import { getMDXComponent } from "mdx-bundler/client";
import { ExampleComponent } from "./ExampleComponent/ExampleComponent";
import { CodeSnippet } from "./CodeSnippet/CodeSnippet";
import { CookiesDemo } from "./CookiesDemo/CookiesDemo";
import { WebSocketDemo } from "./WebSocketDemo/WebSocketDemo";
import { State } from "./State/State";

const mdxComponents = {
    ExampleComponent,
    CodeSnippet,
    CookiesDemo,
    WebSocketDemo,
    State
}

export {
    getMDXComponent,
    mdxComponents
}