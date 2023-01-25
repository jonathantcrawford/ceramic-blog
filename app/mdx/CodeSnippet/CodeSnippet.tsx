import Highlight, { defaultProps } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/vsDark";

export const CodeSnippet = ({ string, fileName, language = "json" }: any) => {
  return (
    <section className="code-snippet">
      {fileName && <code className="file-name">{fileName}</code>}
      <Highlight {...defaultProps} code={string} language="json" theme={theme}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style}>
            {tokens.map((line, i) => (
              <div {...getLineProps({ line })} key={i}>
                {line.map((token, j) => (
                  <span {...getTokenProps({ token })} key={j} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>

    </section>
  );
};
