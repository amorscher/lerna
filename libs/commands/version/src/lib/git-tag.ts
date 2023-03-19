import log from "npmlog";
import {GitOpts} from "./git-commit"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const childProcess = require("@lerna/child-process");

module.exports.gitTag = gitTag;

/**
 * @param {string} tag
 * @param {{ forceGitTag: boolean; signGitTag: boolean; }} gitOpts
 * @param {import("@lerna/child-process").ExecOpts} opts
 */
export function gitTag(tag :string, { forceGitTag, signGitTag }:GitOpts, opts:{ cwd: string; maxBuffer?: number; isDirty:boolean }|undefined, command = "git tag %s -m %s") {
  log.silly("gitTag", tag, command);

  const [cmd, ...args] = command.split(" ");

  const interpolatedArgs = args.map((arg) => arg.replace(/%s/, tag));

  if (forceGitTag) {
    interpolatedArgs.push("--force");
  }

  if (signGitTag) {
    interpolatedArgs.push("--sign");
  }

  log.verbose(cmd, interpolatedArgs.toString());
  return childProcess.exec(cmd, interpolatedArgs, opts);
}
