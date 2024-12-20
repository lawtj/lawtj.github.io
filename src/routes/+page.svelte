<script lang="ts">
    import {base} from '$app/paths';
	import LinkCard from './linkCard.svelte';
</script>

<div class="flex flex-col gap-4 min-h-screen justify-center items-center max-w-screen-lg mx-auto">
	<div class="hero bg-base-200">
		<div class="hero-content text-center">
			<div class="max-w-md">
				<h1 class="text-5xl font-bold">Miscellaneous Tools</h1>
				<p class="py-6">A collection of tools I've made.</p>
			</div>
		</div>
	</div>

	<div class="flex flex-col md:flex-row flex-wrap gap-4 justify-center items-center">
		
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

        <LinkCard
			title="Image Handler"
			description="Utilities to resize, make transparent, and download as a png."
			link="https://imagehandler-d41e1b1d8612.herokuapp.com/"
		/>
	</div>
</div>