<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
	import { ModeWatcher } from "mode-watcher";
	import SunIcon from "@lucide/svelte/icons/sun";
  import MoonIcon from "@lucide/svelte/icons/moon";
 
  import { toggleMode } from "mode-watcher";
  import { Button } from "$lib/components/ui/button/index.js";
	let { children } = $props();
</script>


<ModeWatcher />

<div class="max-w-4xl mx-auto p-4">
	<NavigationMenu.Root class=" pb-4 ">
		<NavigationMenu.List>
			<NavigationMenu.Item>
				<Button onclick={toggleMode} variant="outline" size="icon">
				<SunIcon
				  class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
				/>
				<MoonIcon
				  class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
				/>
				<span class="sr-only">Toggle theme</span>
			  </Button>
			</NavigationMenu.Item>
		</NavigationMenu.List>
		<NavigationMenu.List>
		  <NavigationMenu.Item>
			<NavigationMenu.Link href="/">Home</NavigationMenu.Link>
		  </NavigationMenu.Item>
		  <NavigationMenu.Item>
			<NavigationMenu.Link href="/local">Local Anesthetic Remaining</NavigationMenu.Link>
		  </NavigationMenu.Item>
		  <NavigationMenu.Item>
			<NavigationMenu.Link href="/coffee">Coffee Brewing</NavigationMenu.Link>
		  </NavigationMenu.Item>
		  <NavigationMenu.Item>
			<NavigationMenu.Link href="/imgtools">Image tools</NavigationMenu.Link>
		  </NavigationMenu.Item>
		  <NavigationMenu.Item>
			<NavigationMenu.Link href="/cocktails">Cocktail Converter</NavigationMenu.Link>
		  </NavigationMenu.Item>
		</NavigationMenu.List>
		
	  </NavigationMenu.Root>

	{@render children()}
</div>