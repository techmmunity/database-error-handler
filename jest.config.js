module.exports = {
	moduleFileExtensions: ["js", "json", "ts"],
	rootDir: "src",
	testRegex: ".*\\.spec\\.ts$",
	transform: {
		"^.+\\.(t|j)s$": "ts-jest",
	},
	collectCoverageFrom: ["**/*.ts", "!./index.ts"],
	coverageDirectory: "../coverage",
	testEnvironment: "node",
	moduleDirectories: ["node_modules", "src"],
	resetMocks: true,
	// coverageThreshold: {
	// 	global: {
	// 		branches: 97.5,
	// 		functions: 97.5,
	// 		lines: 97.5,
	// 		statements: 97.5,
	// 	},
	// },
};
