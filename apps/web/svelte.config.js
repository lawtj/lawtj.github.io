import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	kit: { adapter: adapter() },

	// globally silence all accessibility warnings
	onwarn: (warning, defaultHandler) => {
		if (warning.code && warning.code.startsWith('a11y')) {
		  return; // drop the warning
		}
		defaultHandler(warning);  // handle everything else normally
	  }
};

export default config;
