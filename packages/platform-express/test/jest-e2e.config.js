const unitConfigs = require("../../../jest.config");

module.exports = {
  ...unitConfigs,
  rootDir: ".",
  testRegex: "\\.*\\.spec\\.ts$",
  setupFilesAfterEnv: ["../../../jest.setup.js"],
};
