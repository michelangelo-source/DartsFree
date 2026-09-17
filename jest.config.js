module.exports = {
  preset: "jest-expo",
  //https://github.com/expo/expo/issues/44647
  moduleNameMapper: {
    "^expo-modules-core(|/.*)$":
      "<rootDir>/node_modules/expo/node_modules/expo-modules-core$1",
  },
};
