import { ReactNode } from "react";

type CodeBlockProps = {
  children: ReactNode | ReactNode[];
  language: "JavaScript" | "Ruby" | "pnpm" | "npm";
};

export default function CodeBlock({ children }: CodeBlockProps) {
  return children;
}
