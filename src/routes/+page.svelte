<script lang="ts">
	import LinkCard from './linkCard.svelte';
</script>

<div class="flex flex-col gap-4 min-h-screen justify-center items-center">
	<div class="hero bg-base-200">
		<div class="hero-content text-center">
			<div class="max-w-md">
				<h1 class="text-5xl font-bold">Hello World</h1>
				<p class="py-6">I'm hosted with GitHub Pages.</p>
				<a href="/coffee" class="btn btn-primary">Check out Coffee Calculator</a>
			</div>
		</div>
	</div>

	<div class="flex flex-col md:flex-row gap-4">
		<LinkCard
			title="Local Anesthetic Calculator"
			description="Calculate how much anesthetic you can give based on what has been given."
			link="/local"
		/>
		<LinkCard
			title="Coffee Calculator"
			description="Calculate how much coffee you can give based on what has been given."
			link="/coffee"
		/>
	</div>
</div>
