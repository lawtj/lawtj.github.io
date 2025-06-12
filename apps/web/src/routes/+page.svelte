<script lang="ts">
    import {base} from '$app/paths';
	import LinkCard from '$lib/components/linkCard.svelte';
</script>

<div class="flex flex-col gap-8 min-h-screen justify-center items-center max-w-screen-lg mx-auto p-6">
	<!-- Hero section with ShadCN styling -->
	<div class="bg-muted/50 rounded-lg border shadow-sm p-8 w-full">
		<div class="text-center">
			<div class="max-w-md mx-auto">
				<h1 class="text-5xl font-bold text-foreground mb-4">Miscellaneous Tools</h1>
				<p class="text-lg text-muted-foreground">A collection of tools I've made.</p>
			</div>
		</div>
	</div>

	<!-- Cards grid -->
	<div class="flex flex-col md:flex-row flex-wrap gap-6 justify-center items-center">
		<LinkCard
			title="Coffee Calculator"
			subheader="Grams to water"
			description="Calculate how much coffee you can give based on what has been given."
			link={base + "/coffee"}
		/>
        <LinkCard
			title="Local Anesthetic Calculator"
			subheader="Toxic dosing"
			description="Calculate how much anesthetic you can give based on what has been given. For example, when the surgeon asks, 'how much local can I give?'"
			link={base + "/local"}
		/>

        <LinkCard
			title="Image Handler"
			subheader="Image utilities"
			description="Utilities to resize, make transparent, and download as a WebP."
			link={base + "/imgtools"}
		/>
	</div>
</div>