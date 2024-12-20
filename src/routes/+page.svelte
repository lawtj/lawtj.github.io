<script lang="ts">
    import {base} from '$app/paths';
	import LinkCard from './linkCard.svelte';
</script>

<div class="flex flex-col gap-4 min-h-screen justify-center items-center">
	<div class="hero bg-base-200">
		<div class="hero-content text-center">
			<div class="max-w-md">
				<h1 class="text-5xl font-bold">Hello World</h1>
				<p class="py-6">I'm hosted with GitHub Pages.</p>
			</div>
		</div>
	</div>

	<div class="flex flex-col md:flex-row gap-4">
		
		<LinkCard
			title="Coffee Calculator"
			description="Calculate how much coffee you can give based on what has been given."
			link={base + "/coffee"}
		/>
        <LinkCard
			title="Local Anesthetic Calculator"
			description="Calculate how much anesthetic you can give based on what has been given. For example, when the surgeon asks, 'how much local can I give?'"
			link={base + "/local"}
		/>
	</div>
</div>
