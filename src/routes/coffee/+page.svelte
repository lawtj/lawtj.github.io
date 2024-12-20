<script lang="ts">
	let totalVolume = $state(500);
	let use15g = $state(true);
	let coffeeWaterRatio = $derived(use15g ? 15 : 17);
	let coffeeWeight = $derived(totalVolume / coffeeWaterRatio);

	let bloom = $derived(coffeeWeight * 3);

	let firstPour = $derived((totalVolume - bloom) * (1 / 2));
	let secondPour = $derived((totalVolume - bloom) * (1 / 4));
	let thirdPour = $derived((totalVolume - bloom) * (1 / 4));

	let totalVolumeOptions = [
		200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000
	];

	const roundFloat = (value: number) => {
		return value.toFixed(0);
	};
</script>

<div class="flex flex-col items-center gap-2 p-10 ">
	<h1 class="mb-4 text-2xl font-bold">Coffee Brewing Calculator</h1>

	<div class="flex w-full flex-col items-center justify-center gap-6 space-x-2 md:flex-row">
		<div class="flex flex-col gap-6 max-w-md p-6 bg-base-200 rounded-lg">
			<!-- Volume Input Group -->
			<div class="form-control">
				<label class="label">
					<span class="label-text font-medium">Total Volume (ml)</span>
				</label>
				<div class="flex gap-2">
					<input 
						type="number" 
						class="input input-bordered w-24" 
						bind:value={totalVolume} 
					/>
					<select class="select select-bordered flex-1" bind:value={totalVolume}>
						{#each totalVolumeOptions as option}
							<option value={option}>{option}ml</option>
						{/each}
					</select>
				</div>
			</div>

			<!-- Ratio Toggle Group -->
			<div class="form-control">
				<label class="label">
					<span class="label-text font-medium">Coffee/Water Ratio</span>
				</label>
				<label class="label cursor-pointer justify-start gap-4">
					<input type="checkbox" class="toggle" bind:checked={use15g} />
					<span class="label-text">{use15g ? '15ml/g' : '17ml/g'}</span>
				</label>
			</div>

			<!-- Result Display -->
			<div class="stats bg-base-100 shadow">
				<div class="stat">
					<div class="stat-title">Coffee Dose</div>
					<div class="stat-value text-2xl">{coffeeWeight.toFixed(1)}g</div>
				</div>
			</div>
		</div>
		<div class="flex flex-col gap-2 rounded-md p-2">
			<div class="overflow-x-auto">
				<table class="table">
					<thead class="text-center">
						<tr>
							<th>Step</th>
							<th>Volume</th>
							<th>Scale Weight</th>
						</tr>
					</thead>
					<tbody class="text-center">
						<tr>
							<td>Bloom</td>
							<td>{roundFloat(bloom)}</td>
							<td>{roundFloat(bloom)}</td>
						</tr>
						<tr>
							<td>First Pour</td>
							<td>{roundFloat(firstPour)}</td>
							<td>{roundFloat(bloom + firstPour)}</td>
						</tr>
						<tr>
							<td>Second Pour</td>
							<td>{roundFloat(secondPour)}</td>
							<td>{roundFloat(bloom + firstPour + secondPour)}</td>
						</tr>
						<tr>
							<td>Third Pour</td>
							<td>{roundFloat(thirdPour)}</td>
							<td>{roundFloat(bloom + firstPour + secondPour + thirdPour)}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
