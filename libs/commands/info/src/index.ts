import { Command, output } from "@lerna/core";
import envinfo from "envinfo";

export function factory(argv: NodeJS.Process["argv"]) {
  return new InfoCommand(argv);
}

export class InfoCommand extends Command {
  override initialize() {}

  override execute() {
    output("\n Environment info:");
    envinfo
      .run({
        System: ["OS", "CPU"],
        Binaries: ["Node", "Yarn", "npm"],
        Utilities: ["Git"],
        npmPackages: ["lerna"],
      })
      .then(output);
  }
}
