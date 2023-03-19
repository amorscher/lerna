import { tempWrite } from "@lerna/core";
import { ExecOptions } from "child_process";
import log from "npmlog";
import { EOL } from "os";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const childProcess = require("@lerna/child-process");

module.exports.gitCommit = gitCommit;

export interface GitOpts{
  amend:boolean;
  commitHooks:boolean;
  granularPathspec:boolean;
  signGitCommit:boolean;
  signoffGitCommit:boolean;
  signGitTag:boolean;
  forceGitTag:boolean;
}

/**
 * @param {string} message
 * @param {{ amend: boolean; commitHooks: boolean; signGitCommit: boolean; }} gitOpts
 * @param {import("@lerna/child-process").ExecOpts} opts
 */
function gitCommit(message: string, { amend, commitHooks, signGitCommit, signoffGitCommit }:GitOpts, opts:unknown) {
  log.silly("gitCommit", message);
  const args = ["commit"];

  if (commitHooks === false) {
    args.push("--no-verify");
  }

  if (signGitCommit) {
    args.push("--gpg-sign");
  }

  if (signoffGitCommit) {
    args.push("--signoff");
  }

  if (amend) {
    args.push("--amend", "--no-edit");
  } else if (message.indexOf(EOL) > -1) {
    // Use tempfile to allow multi\nline strings.
    args.push("-F", tempWrite.sync(message, "lerna-commit.txt"));
  } else {
    args.push("-m", message);
  }

  // TODO: refactor to address type issues
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  log.verbose("git", args);
  return childProcess.exec("git", args, opts);
}
