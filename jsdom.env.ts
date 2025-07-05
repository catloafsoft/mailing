/* eslint-disable @typescript-eslint/no-var-requires */
import { TestEnvironment } from "jest-environment-jsdom";
import { TextEncoder } from "util";
import { setImmediate } from "timers";

class CustomTestEnvironment extends TestEnvironment {
  async setup() {
    await super.setup();
    // TextEncoder is required by node-html-parser
    if (typeof this.global.TextEncoder === "undefined") {
      this.global.TextEncoder = TextEncoder;
    }

    // setImmediate is required by nodemailer
    if (typeof this.global.setImmediate === "undefined") {
      this.global.setImmediate = setImmediate;
    }
  }
}

export default CustomTestEnvironment;
