/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  appDirectory: "app",
  serverBuildDirectory: "server/build",
  ignoredRouteFiles: [".*", "**/*.css"],
  cacheDirectory: "./node_modules/.cache/remix",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
};
