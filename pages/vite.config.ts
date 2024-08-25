import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type ConfigEnv, type PreviewServer, type ViteDevServer } from 'vite';

function crossOriginIsolationMiddleware(server: PreviewServer | ViteDevServer) {
	server.middlewares.use((_req, res, next) => {
		res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
		res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
		next();
	});
}

const withoutCrossOriginIsolation = 'no-coi';

export default function ({ mode }: ConfigEnv) {
	return defineConfig({
		plugins: [sveltekit(), {
			name: "configure-response-headers",
			configureServer: mode === withoutCrossOriginIsolation ? undefined : crossOriginIsolationMiddleware,
			configurePreviewServer: mode === withoutCrossOriginIsolation ? undefined : crossOriginIsolationMiddleware,
		}],
	});
};
