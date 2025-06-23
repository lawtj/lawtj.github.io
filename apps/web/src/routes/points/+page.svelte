<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import * as Select from "$lib/components/ui/select/index.js";

	// Form inputs as reactive state
	let chasePrice = $state<number | null>(null);
	let unitedMiles = $state<number | null>(null);
	let unitedFees = $state<number>(0);
	let redemptionRate = $state<string>("0.015");
	let chaseEarnRate = $state<number>(8);

	// Validation
	let isValid = $derived(chasePrice !== null && chasePrice > 0 && 
	                      unitedMiles !== null && unitedMiles > 0 && 
	                      chaseEarnRate > 0);

	// Chase travel portal calculations
	let portalPointsNeeded = $derived(
		chasePrice && isValid 
			? Math.ceil(chasePrice / parseFloat(redemptionRate))
			: 0
	);

	let portalPointsEarned = $derived(
		chasePrice && isValid
			? Math.floor(chasePrice * chaseEarnRate)
			: 0
	);

	let portalNetPoints = $derived(portalPointsNeeded - portalPointsEarned);

	// United transfer calculations
	let unitedPointsNeeded = $derived(unitedMiles || 0);

	let unitedValueReceived = $derived(
		chasePrice && isValid
			? chasePrice - unitedFees
			: 0
	);

	let unitedValuePerPoint = $derived(
		unitedMiles && unitedValueReceived > 0
			? unitedValueReceived / unitedMiles
			: 0
	);

	let chaseEffectiveRate = $derived(
		portalNetPoints > 0 && chasePrice
			? chasePrice / portalNetPoints
			: 0
	);

	// Recommendation logic
	let recommendation = $derived(() => {
		if (!isValid) return null;
		
		if (unitedValueReceived <= 0) {
			return {
				choice: 'chase',
				reason: `Use Chase Travel Portal - United fees ($${unitedFees.toFixed(2)}) are too high relative to the flight value.`
			};
		}
		
		if (unitedValuePerPoint > chaseEffectiveRate) {
			const pointsDiff = portalNetPoints - unitedPointsNeeded;
			let additionalInfo = '';
			
			if (pointsDiff > 0) {
				additionalInfo = `You'll also use ${pointsDiff.toLocaleString()} fewer points with United.`;
			} else if (pointsDiff < 0) {
				additionalInfo = `You'll use ${Math.abs(pointsDiff).toLocaleString()} more points, but get better value per point.`;
			} else {
				additionalInfo = `Same number of points, but better value per point.`;
			}
			
			return {
				choice: 'united',
				reason: `Transfer to United - Better value at ${(unitedValuePerPoint * 100).toFixed(2)}¢ per point vs ${(chaseEffectiveRate * 100).toFixed(2)}¢`,
				additionalInfo,
				cost: `${unitedPointsNeeded.toLocaleString()} points + $${unitedFees.toFixed(2)} cash`
			};
		} else {
			const pointsDiff = unitedPointsNeeded - portalNetPoints;
			let additionalInfo = '';
			
			if (pointsDiff > 0) {
				additionalInfo = `You'll also use ${pointsDiff.toLocaleString()} fewer points with Chase portal.`;
			} else if (pointsDiff < 0) {
				additionalInfo = `You'll use ${Math.abs(pointsDiff).toLocaleString()} more points, but get better value per point.`;
			} else {
				additionalInfo = `Same number of points, but better value per point.`;
			}
			
			return {
				choice: 'chase',
				reason: `Use Chase Travel Portal - Better value at ${(chaseEffectiveRate * 100).toFixed(2)}¢ per point vs ${(unitedValuePerPoint * 100).toFixed(2)}¢`,
				additionalInfo,
				cost: `${portalNetPoints.toLocaleString()} points (no cash fees)`
			};
		}
	});
</script>

<div class="flex flex-col items-center gap-6 p-10 w-full">
	<h1 class="text-3xl font-bold text-foreground">Chase Points vs United Transfer Calculator</h1>

	<div class="flex w-full flex-col items-start justify-center gap-8 xl:flex-row max-w-7xl">
		<!-- Input Controls Card -->
		<Card class="w-full xl:max-w-md">
			<CardHeader>
				<CardTitle>Flight Information</CardTitle>
			</CardHeader>
			<CardContent class="space-y-6">
				<!-- Chase Price Input -->
				<div class="space-y-2">
					<label class="text-sm font-medium text-foreground">Chase travel portal price</label>
					<div class="flex items-center gap-2">
						<span class="text-sm text-muted-foreground">$</span>
						<Input 
							type="number" 
							step="0.01"
							bind:value={chasePrice}
							placeholder="Price on Chase portal"
							class="flex-1"
						/>
					</div>
				</div>

				<!-- United Miles Input -->
				<div class="space-y-2">
					<label class="text-sm font-medium text-foreground">United miles required</label>
					<Input 
						type="number" 
						bind:value={unitedMiles}
						placeholder="Enter miles needed"
						class="w-full"
					/>
				</div>

				<!-- United Fees Input -->
				<div class="space-y-2">
					<label class="text-sm font-medium text-foreground">United cash fees/taxes</label>
					<div class="flex items-center gap-2">
						<span class="text-sm text-muted-foreground">$</span>
						<Input 
							type="number" 
							step="0.01"
							bind:value={unitedFees}
							placeholder="Cash fees for award ticket"
							class="flex-1"
						/>
					</div>
				</div>

				<!-- Redemption Rate Select -->
				<div class="space-y-2">
					<label class="text-sm font-medium text-foreground">Chase portal redemption rate</label>
					<Select.Root bind:value={redemptionRate}>
						<Select.Trigger class="w-full">
							<span>{redemptionRate === "0.015" ? "1.5¢ per point (Sapphire Preferred/Reserve)" : "2.0¢ per point (Sapphire Reserve on travel)"}</span>
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="0.015">1.5¢ per point (Sapphire Preferred/Reserve)</Select.Item>
							<Select.Item value="0.02">2.0¢ per point (Sapphire Reserve on travel)</Select.Item>
						</Select.Content>
					</Select.Root>
				</div>

				<!-- Chase Earn Rate Input -->
				<div class="space-y-2">
					<label class="text-sm font-medium text-foreground">Points earned on Chase portal booking</label>
					<div class="flex items-center gap-2">
						<Input 
							type="number" 
							step="0.1"
							bind:value={chaseEarnRate}
							placeholder="Points per dollar"
							class="flex-1"
						/>
						<span class="text-sm text-muted-foreground">points per dollar</span>
					</div>
				</div>
			</CardContent>
		</Card>

		<!-- Results Cards -->
		<div class="w-full space-y-6">
			{#if !isValid}
				<Card class="w-full">
					<CardContent class="pt-6 pb-6">
						<p class="text-center text-muted-foreground">Please fill in all required fields to see the comparison.</p>
					</CardContent>
				</Card>
			{:else}
				<!-- Chase Portal Results -->
				<Card class="w-full">
					<CardHeader>
						<CardTitle class="text-center">Chase Travel Portal ({(parseFloat(redemptionRate) * 100).toFixed(1)}¢/point)</CardTitle>
					</CardHeader>
					<CardContent class="space-y-4">
						<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
							<div class="text-center">
								<div class="text-sm text-muted-foreground">Flight Price</div>
								<div class="text-lg font-bold">${chasePrice?.toFixed(2)}</div>
							</div>
							<div class="text-center">
								<div class="text-sm text-muted-foreground">Points Needed</div>
								<div class="text-lg font-bold">{portalPointsNeeded.toLocaleString()}</div>
							</div>
							<div class="text-center">
								<div class="text-sm text-muted-foreground">Points Earned Back</div>
								<div class="text-lg font-bold">{portalPointsEarned.toLocaleString()}</div>
							</div>
							<div class="text-center">
								<div class="text-sm text-muted-foreground">Net Points Used</div>
								<div class="text-xl font-bold text-primary">{portalNetPoints.toLocaleString()}</div>
							</div>
						</div>
						<div class="text-center pt-2">
							<div class="text-sm text-muted-foreground">Effective Value Per Point</div>
							<div class="text-lg font-bold">{(chaseEffectiveRate * 100).toFixed(2)}¢</div>
						</div>
					</CardContent>
				</Card>

				<!-- United Transfer Results -->
				<Card class="w-full">
					<CardHeader>
						<CardTitle class="text-center">Transfer to United</CardTitle>
					</CardHeader>
					<CardContent class="space-y-4">
						<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
							<div class="text-center">
								<div class="text-sm text-muted-foreground">Points Needed</div>
								<div class="text-lg font-bold">{unitedPointsNeeded.toLocaleString()}</div>
							</div>
							<div class="text-center">
								<div class="text-sm text-muted-foreground">Cash Fees</div>
								<div class="text-lg font-bold">${unitedFees.toFixed(2)}</div>
							</div>
							<div class="text-center">
								<div class="text-sm text-muted-foreground">Value Received</div>
								<div class="text-lg font-bold">${unitedValueReceived.toFixed(2)}</div>
							</div>
							<div class="text-center">
								<div class="text-sm text-muted-foreground">Points Earned Back</div>
								<div class="text-lg font-bold">0</div>
							</div>
						</div>
						<div class="text-center pt-2">
							<div class="text-sm text-muted-foreground">Effective Value Per Point</div>
							<div class="text-lg font-bold">{(unitedValuePerPoint * 100).toFixed(2)}¢</div>
						</div>
					</CardContent>
				</Card>

			{/if}
		</div>
	</div>

	<!-- Recommendation Card - Full Width -->
	{#if isValid && recommendation()}
		<Card class="w-full max-w-7xl border-2 {recommendation().choice === 'united' ? 'border-blue-500 bg-blue-50/50' : 'border-green-500 bg-green-50/50'}">
			<CardHeader>
				<CardTitle class="text-center">Recommendation</CardTitle>
			</CardHeader>
			<CardContent class="space-y-4">
				<div class="text-center">
					<div class="text-lg font-bold {recommendation().choice === 'united' ? 'text-blue-700' : 'text-green-700'}">
						{recommendation().choice === 'united' ? 'Transfer to United' : 'Use Chase Travel Portal'}
					</div>
					<p class="text-sm text-muted-foreground mt-2">{recommendation().reason}</p>
					{#if recommendation().cost}
						<p class="text-sm font-medium mt-2">Total cost: {recommendation().cost}</p>
					{/if}
					{#if recommendation().additionalInfo}
						<p class="text-sm text-muted-foreground mt-2">{recommendation().additionalInfo}</p>
					{/if}
				</div>
			</CardContent>
		</Card>
	{/if}
</div>