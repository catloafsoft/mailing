import fsExtra from "fs-extra";

const { copy } = fsExtra;
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import tree from "tree-node-cli";
import { log } from "./serverLogger";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function generateEmailsDirectory({
  emailsDir,
  isTypescript,
}: {
  emailsDir: string;
  isTypescript: boolean;
}) {
  const srcDir =
    process.env.MM_DEV || process.env.NODE_ENV === "test"
      ? __dirname + "/.."
      : __dirname + "/../src";

  // copy the emails dir template in!
  const srcEmails = isTypescript ? "emails" : "emails-js";
  await copy(resolve(srcDir, srcEmails), emailsDir, { overwrite: false });

  const fileTree = tree(emailsDir, {
    exclude: [/node_modules|\.mailing|yarn\.lock|pnpm-lock\.yaml|yalc\.lock/],
  });
  log(`generated your emails dir at ${emailsDir}:\n${fileTree}`);
}
