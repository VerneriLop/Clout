import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import type { PluginOption } from "vite";

function chromeDevToolsBypass(): PluginOption {
  return {
    name: "bypass-chrome-devtools-request",
    configureServer(server) {
      server.middlewares.use(
        "/.well-known/appspecific/com.chrome.devtools.json",
        (req, res) => {
          res.statusCode = 204; // No Content
          res.end();
        },
      );
    },
  };
}

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), chromeDevToolsBypass()],
});