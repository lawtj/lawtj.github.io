<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
	import { ModeWatcher } from "mode-watcher";
	import SunIcon from "@lucide/svelte/icons/sun";
  import MoonIcon from "@lucide/svelte/icons/moon";
  import MenuIcon from "@lucide/svelte/icons/menu";
  import XIcon from "@lucide/svelte/icons/x";
 
  import { toggleMode } from "mode-watcher";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Toaster } from "$lib/components/ui/sonner";
	let { children } = $props();

	// Mobile menu state
	let isMobileMenuOpen = $state(false);

	// Navigation items
	const navItems = [
		{ href: '/', label: 'Home' },
		{ href: '/local', label: 'Local Anesthetic' },
		{ href: '/coffee', label: 'Coffee Brewing' },
		{ href: '/imgtools', label: 'Image Tools' },
		{ href: '/cocktails', label: 'Cocktails' },
		{ href: '/points', label: 'Chase Points' },
		{ href: '/flights', label: 'Flight Search' }
	];

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	function closeMobileMenu() {
		isMobileMenuOpen = false;
	}
</script>


<ModeWatcher />

<div class="max-w-screen-xl mx-auto p-4">
	<!-- Header with theme toggle and mobile menu button -->
	<header class="flex items-center justify-between pb-4">
		<!-- Theme toggle (always visible) -->
		<Button onclick={toggleMode} variant="outline" size="icon">
			<SunIcon
			  class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
			/>
			<MoonIcon
			  class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>

		<!-- Desktop Navigation (hidden on mobile) -->
		<NavigationMenu.Root class="hidden md:block">
			<NavigationMenu.List>
				{#each navItems as item}
					<NavigationMenu.Item>
						<NavigationMenu.Link href={item.href}>{item.label}</NavigationMenu.Link>
					</NavigationMenu.Item>
				{/each}
			</NavigationMenu.List>
		</NavigationMenu.Root>

		<!-- Mobile hamburger button (hidden on desktop) -->
		<Button onclick={toggleMobileMenu} variant="outline" size="icon" class="md:hidden">
			{#if isMobileMenuOpen}
				<XIcon class="h-[1.2rem] w-[1.2rem]" />
				<span class="sr-only">Close menu</span>
			{:else}
				<MenuIcon class="h-[1.2rem] w-[1.2rem]" />
				<span class="sr-only">Open menu</span>
			{/if}
		</Button>
	</header>

	<!-- Mobile Navigation Menu (hidden by default, shown when toggled) -->
	{#if isMobileMenuOpen}
		<nav class="md:hidden border-t border-border mb-4 pt-4">
			<div class="flex flex-col space-y-2">
				{#each navItems as item}
					<a 
						href={item.href} 
						onclick={closeMobileMenu}
						class="block px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors"
						class:bg-muted={page.url.pathname === item.href}
					>
						{item.label}
					</a>
				{/each}
			</div>
		</nav>
	{/if}

	{@render children()}
</div>

<Toaster />