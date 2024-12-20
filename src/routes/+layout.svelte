<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	let { children } = $props();
</script>

{#if page.url.pathname !== '/'}
	<div class="max-w-screen-lg mx-auto px-6 mt-4">
		<div class="breadcrumbs text-sm">
			<ul>
				<li><a href="/">Home</a></li>
				<li>{page.url.pathname.split('/').filter(Boolean).join(' / ')}</li>
			</ul>
		</div>
	</div>
{/if}

<div class="max-w-screen-lg mx-auto">
	{@render children()}
</div>