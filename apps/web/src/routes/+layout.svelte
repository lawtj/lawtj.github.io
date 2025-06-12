<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";

	let { children } = $props();
</script>



<div class="max-w-4xl mx-auto p-4">
	<NavigationMenu.Root class=" pb-4 ">
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
			<NavigationMenu.Link href="https://imagehandler-d41e1b1d8612.herokuapp.com/">Image tools</NavigationMenu.Link>
		  </NavigationMenu.Item>
		  <NavigationMenu.Item>
			<NavigationMenu.Link href="/cocktails">Cocktail Converter</NavigationMenu.Link>
		  </NavigationMenu.Item>
		</NavigationMenu.List>
	  </NavigationMenu.Root>

	{@render children()}
</div>