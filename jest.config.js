/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
      preset: "ts-jest",
      testEnvironment: "node",
      moduleFileExtensions: ["ts", "js"],
      verbose: true,
      collectCoverage: true,
      coverageProvider: "v8",
      collectCoverageFrom:[
            "src/**/*.ts",
            "!test/**",
            "!**/node_modules/**",
      ],
      transform: {
            "^.+\.tsx?$": ["ts-jest", {}],
      },
}
