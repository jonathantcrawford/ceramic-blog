import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import json from "react-syntax-highlighter/dist/cjs/languages/hljs/json";
import syntaxHighlighterTheme from "react-syntax-highlighter/dist/cjs/styles/hljs/gml";


SyntaxHighlighter.registerLanguage("json", json);


export const CodeSnippet = ({ string, fileName }: any) => {
  

  return (
    <section className="code-snippet">
      <code className="file-name">{fileName}</code>
      <SyntaxHighlighter language="json" style={syntaxHighlighterTheme}>
        {string}
      </SyntaxHighlighter>
    </section>
  );
};
