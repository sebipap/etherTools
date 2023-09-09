import { memo } from "react";
import { CodeBlock, dracula } from "react-code-blocks";

const Code = ({
  text,
  showLineNumbers = false,
  theme = dracula,
  customStyle = {
    fontFamily: "monospace",
  },
  language = "solidity",
  ...rest
}: Parameters<typeof CodeBlock>[0]) => (
  <CodeBlock
    {...{ text, showLineNumbers, theme, customStyle, language, ...rest }}
  />
);

export default memo(Code);
