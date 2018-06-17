let mappedModule;
switch (process.env.TEST_ENV) {
  case "cjs":
    mappedModule = "<rootDir>/index";
    break;
  case "umd":
    mappedModule = "<rootDir>/umd/react-router-dom.js";
    break;
  default:
    mappedModule = "<rootDir>/modules/index";
}

module.exports = {
  testMatch: ["<rootDir>/modules/__tests__/*-test.js"],
  moduleNameMapper: {
    "^react-router-dom$": mappedModule
  },
  globals: {
    "__DEV__": true
  },
  setupFiles: [
    "raf/polyfill"
  ],
  testURL: "http://localhost/"
};
