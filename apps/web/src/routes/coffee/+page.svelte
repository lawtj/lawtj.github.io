<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import * as Select from "$lib/components/ui/select/index.js";
	import { Switch } from "$lib/components/ui/switch";
	import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";

	let totalVolume: number = $state(500);
	let totalVolumeString: string = $derived(totalVolume.toString());
	let coffeeWeightInput: number = $state(30);
	let coffeeWeightInputString: string = $derived(coffeeWeightInput.toString());
	let use15g = $state(true);
	let inputByWeight = $state(false); // false = input by volume, true = input by weight
	let coffeeWaterRatio = $derived(use15g ? 15 : 17);
	
	// Conditional calculations based on input mode
	let coffeeWeight = $derived(inputByWeight ? coffeeWeightInput : totalVolume / coffeeWaterRatio);
	let calculatedTotalVolume = $derived(inputByWeight ? coffeeWeightInput * coffeeWaterRatio : totalVolume);

	let bloom = $derived(coffeeWeight * 3);

	let firstPour = $derived((calculatedTotalVolume - bloom) * (1 / 2));
	let secondPour = $derived((calculatedTotalVolume - bloom) * (1 / 4));
	let thirdPour = $derived((calculatedTotalVolume - bloom) * (1 / 4));

	let totalVolumeOptions = [
		200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000
	];

	let coffeeWeightOptions = [
		15, 20, 25, 30, 35, 40, 45, 50, 55, 60
	];

	const roundFloat = (value: number): string => {
		return value.toFixed(0);
	};

	$effect(() => {
		totalVolume = parseInt(totalVolumeString, 10);
	});

	$effect(() => {
		coffeeWeightInput = parseFloat(coffeeWeightInputString);
	});
</script>

<div class="flex flex-col items-center gap-6 p-10 w-full">
	<h1 class="text-3xl font-bold text-foreground">Coffee Brewing Calculator</h1>

	<div class="flex w-full flex-col items-center justify-center gap-8 md:flex-row">
		<!-- Controls Card -->
		<Card class="w-full max-w-md">
			<CardHeader>
				<CardTitle>Brewing Parameters</CardTitle>
			</CardHeader>
			<CardContent class="space-y-6">
				<!-- Input Mode Toggle -->
				<div class="space-y-2">
					<label class="text-sm font-medium text-foreground">Input Mode</label>
					<div class="flex items-center gap-3">
						<Switch bind:checked={inputByWeight} />
						<span class="text-sm text-muted-foreground">{inputByWeight ? 'Coffee Weight (g)' : 'Total Volume (ml)'}</span>
					</div>
				</div>

				<!-- Volume Input Group (shown when inputByWeight is false) -->
				{#if !inputByWeight}
					<div class="space-y-2">
						<label class="text-sm font-medium text-foreground">Total Volume (ml)</label>
						<div class="flex gap-2">
							<Input 
								type="number" 
								class="w-24" 
								bind:value={totalVolumeString} 
							/>
							<Select.Root type="single" bind:value={totalVolumeString}>
								<Select.Trigger class="flex-1">
									<span>{totalVolume}ml</span>
								</Select.Trigger>
								<Select.Content>
									{#each totalVolumeOptions as option}
										<Select.Item value={option.toString()}>{option}ml</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						</div>
					</div>
				{/if}

				<!-- Coffee Weight Input Group (shown when inputByWeight is true) -->
				{#if inputByWeight}
					<div class="space-y-2">
						<label class="text-sm font-medium text-foreground">Coffee Weight (g)</label>
						<div class="flex gap-2">
							<Input 
								type="number" 
								step="0.1"
								class="w-24" 
								bind:value={coffeeWeightInputString} 
							/>
							<Select.Root type="single" bind:value={coffeeWeightInputString}>
								<Select.Trigger class="flex-1">
									<span>{coffeeWeightInput}g</span>
								</Select.Trigger>
								<Select.Content>
									{#each coffeeWeightOptions as option}
										<Select.Item value={option.toString()}>{option}g</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						</div>
					</div>
				{/if}

				<!-- Ratio Toggle Group -->
				<div class="space-y-2">
					<label class="text-sm font-medium text-foreground">Coffee/Water Ratio</label>
					<div class="flex items-center gap-3">
						<Switch bind:checked={use15g} />
						<span class="text-sm text-muted-foreground">{use15g ? '15ml/g' : '17ml/g'}</span>
					</div>
				</div>

				<!-- Result Display -->
				<div class="grid grid-cols-2 gap-4">
					<Card class="bg-muted/50 border-2">
						<CardContent class="pt-6 text-center">
							<div class="text-sm text-muted-foreground uppercase tracking-wide">Coffee Dose</div>
							<div class="text-3xl font-bold text-foreground">{coffeeWeight.toFixed(1)}g</div>
						</CardContent>
					</Card>
					<Card class="bg-muted/50 border-2">
						<CardContent class="pt-6 text-center">
							<div class="text-sm text-muted-foreground uppercase tracking-wide">Total Volume</div>
							<div class="text-3xl font-bold text-foreground">{calculatedTotalVolume.toFixed(0)}ml</div>
						</CardContent>
					</Card>
				</div>
			</CardContent>
		</Card>

		<!-- Brewing Steps Table -->
		<Card class="w-full max-w-md">
			<CardHeader>
				<CardTitle>Brewing Steps</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead class="text-center">Step</TableHead>
							<TableHead class="text-center">Volume</TableHead>
							<TableHead class="text-center">Scale Weight</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell class="text-center font-medium">Bloom</TableCell>
							<TableCell class="text-center">{roundFloat(bloom)}</TableCell>
							<TableCell class="text-center">{roundFloat(bloom)}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell class="text-center font-medium">First Pour</TableCell>
							<TableCell class="text-center">{roundFloat(firstPour)}</TableCell>
							<TableCell class="text-center">{roundFloat(bloom + firstPour)}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell class="text-center font-medium">Second Pour</TableCell>
							<TableCell class="text-center">{roundFloat(secondPour)}</TableCell>
							<TableCell class="text-center">{roundFloat(bloom + firstPour + secondPour)}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell class="text-center font-medium">Third Pour</TableCell>
							<TableCell class="text-center">{roundFloat(thirdPour)}</TableCell>
							<TableCell class="text-center">{roundFloat(bloom + firstPour + secondPour + thirdPour)}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	</div>
</div>
