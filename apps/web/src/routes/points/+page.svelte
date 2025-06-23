<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import * as Select from "$lib/components/ui/select/index.js";
	import { Switch } from "$lib/components/ui/switch";
	import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";

	// Mode toggle
	let isDestinationMode = $state(false);

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

	// Booking method comparison mode
	type FlightComparison = {
		destination: string;
		chasePrice: number | null;
		unitedPrice: number | null;
	};

	let flights = $state<FlightComparison[]>([
		{ destination: 'Tokyo', chasePrice: null, unitedPrice: null },
		{ destination: 'London', chasePrice: null, unitedPrice: null }
	]);

	let pointValue = $state<number>(0.015); // How much you value each point (in dollars)

	// Calculate comparison results
	let bookingResults = $derived(() => {
		return flights
			.filter(flight => flight.chasePrice !== null && flight.chasePrice > 0 && 
			                 flight.unitedPrice !== null && flight.unitedPrice > 0)
			.map(flight => {
				// Chase portal calculation
				const chasePointsEarned = flight.chasePrice! * 8;
				const chasePointsValue = chasePointsEarned * pointValue;
				const chaseNetCost = flight.chasePrice! - chasePointsValue;
				
				// United direct calculation
				const unitedPointsEarned = flight.unitedPrice! * 4;
				const unitedPointsValue = unitedPointsEarned * pointValue;
				const unitedNetCost = flight.unitedPrice! - unitedPointsValue;
				
				// Determine better option
				const savings = unitedNetCost - chaseNetCost;
				const betterOption = chaseNetCost < unitedNetCost ? 'chase' : 'united';
				
				return {
					destination: flight.destination,
					chase: {
						price: flight.chasePrice!,
						pointsEarned: chasePointsEarned,
						pointsValue: chasePointsValue,
						netCost: chaseNetCost
					},
					united: {
						price: flight.unitedPrice!,
						pointsEarned: unitedPointsEarned,
						pointsValue: unitedPointsValue,
						netCost: unitedNetCost
					},
					betterOption,
					savings: Math.abs(savings)
				};
			});
	});

	function addFlight() {
		flights = [...flights, { destination: `Destination ${flights.length + 1}`, chasePrice: null, unitedPrice: null }];
	}

	function removeFlight(index: number) {
		flights = flights.filter((_, i) => i !== index);
	}
</script>

<div class="flex flex-col items-center gap-6 p-10 w-full">
	<h1 class="text-3xl font-bold text-foreground">Chase Points Calculator</h1>

	<!-- Mode Toggle -->
	<Card class="w-full max-w-md">
		<CardContent class="pt-6 pb-6">
			<div class="flex items-center justify-center gap-4">
				<span class="text-sm font-medium {!isDestinationMode ? 'text-foreground' : 'text-muted-foreground'}">
					Points Redemption
				</span>
				<Switch bind:checked={isDestinationMode} />
				<span class="text-sm font-medium {isDestinationMode ? 'text-foreground' : 'text-muted-foreground'}">
					Booking Method Comparison
				</span>
			</div>
		</CardContent>
	</Card>

	{#if !isDestinationMode}
		<!-- Points Redemption Calculator -->
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

	{:else}
		<!-- Booking Method Comparison Mode -->
		<div class="flex w-full flex-col items-start justify-center gap-8 xl:flex-row max-w-7xl">
			<!-- Configuration Card -->
			<Card class="w-full xl:max-w-md">
				<CardHeader>
					<CardTitle>Flight Prices</CardTitle>
				</CardHeader>
				<CardContent class="space-y-6">
					<!-- Point Valuation -->
					<div class="space-y-2">
						<label class="text-sm font-medium text-foreground">Point value (¢ per point)</label>
						<Input 
							type="number" 
							step="0.001"
							bind:value={pointValue}
							placeholder="1.5"
							class="w-full"
						/>
						<p class="text-xs text-muted-foreground">How much you value each Chase point</p>
					</div>

					<!-- Flight Price Inputs -->
					<div class="space-y-2">
						<label class="text-sm font-medium text-foreground">Flight Comparisons</label>
						<div class="space-y-4">
							{#each flights as flight, index}
								<div class="space-y-3 p-3 border rounded">
									<div class="space-y-2">
										<Input 
											type="text" 
											bind:value={flight.destination}
											placeholder="Destination (e.g., Tokyo)"
											class="w-full font-medium"
										/>
									</div>
									
									<div class="grid grid-cols-2 gap-2">
										<div class="space-y-1">
											<label class="text-xs text-muted-foreground">Chase Portal Price</label>
											<div class="flex items-center gap-1">
												<span class="text-sm">$</span>
												<Input 
													type="number" 
													step="0.01"
													bind:value={flight.chasePrice}
													placeholder="Price"
													class="flex-1"
												/>
											</div>
											<p class="text-xs text-muted-foreground">8x points</p>
										</div>
										
										<div class="space-y-1">
											<label class="text-xs text-muted-foreground">United Direct Price</label>
											<div class="flex items-center gap-1">
												<span class="text-sm">$</span>
												<Input 
													type="number" 
													step="0.01"
													bind:value={flight.unitedPrice}
													placeholder="Price"
													class="flex-1"
												/>
											</div>
											<p class="text-xs text-muted-foreground">4x points</p>
										</div>
									</div>

									{#if flights.length > 1}
										<button 
											onclick={() => removeFlight(index)}
											class="text-destructive hover:bg-destructive/10 p-1 rounded text-sm w-full"
											aria-label="Remove flight"
										>
											Remove Flight
										</button>
									{/if}
								</div>
							{/each}
							<button 
								onclick={addFlight}
								class="w-full text-sm text-muted-foreground border border-dashed border-muted-foreground/50 rounded p-2 hover:bg-muted/50"
							>
								+ Add Flight Comparison
							</button>
						</div>
					</div>
				</CardContent>
			</Card>

			<!-- Results Card -->
			<Card class="w-full">
				<CardHeader>
					<CardTitle class="text-center">Booking Method Comparison</CardTitle>
				</CardHeader>
				<CardContent>
					{#if bookingResults().length === 0}
						<p class="text-center text-muted-foreground">Enter flight prices to see booking comparison</p>
					{:else}
						<div class="space-y-6">
							{#each bookingResults() as result}
								<div class="border rounded p-4">
									<h4 class="font-medium text-lg mb-4">{result.destination}</h4>
									
									<!-- Side by side comparison -->
									<div class="grid grid-cols-2 gap-4 mb-4">
										<!-- Chase Portal -->
										<div class="space-y-2 p-3 rounded {result.betterOption === 'chase' ? 'bg-green-50/50 border border-green-200' : 'bg-muted/30'}">
											<div class="font-medium text-center">
												Chase Portal
												{#if result.betterOption === 'chase'}
													<span class="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Best Choice</span>
												{/if}
											</div>
											<div class="space-y-1 text-sm">
												<div class="flex justify-between">
													<span>Price:</span>
													<span>${result.chase.price.toFixed(2)}</span>
												</div>
												<div class="flex justify-between">
													<span>Points earned:</span>
													<span>{Math.floor(result.chase.pointsEarned).toLocaleString()}</span>
												</div>
												<div class="flex justify-between">
													<span>Points value:</span>
													<span>${result.chase.pointsValue.toFixed(2)}</span>
												</div>
												<div class="flex justify-between font-bold border-t pt-1">
													<span>Net cost:</span>
													<span>${result.chase.netCost.toFixed(2)}</span>
												</div>
											</div>
										</div>

										<!-- United Direct -->
										<div class="space-y-2 p-3 rounded {result.betterOption === 'united' ? 'bg-blue-50/50 border border-blue-200' : 'bg-muted/30'}">
											<div class="font-medium text-center">
												United Direct
												{#if result.betterOption === 'united'}
													<span class="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Best Choice</span>
												{/if}
											</div>
											<div class="space-y-1 text-sm">
												<div class="flex justify-between">
													<span>Price:</span>
													<span>${result.united.price.toFixed(2)}</span>
												</div>
												<div class="flex justify-between">
													<span>Points earned:</span>
													<span>{Math.floor(result.united.pointsEarned).toLocaleString()}</span>
												</div>
												<div class="flex justify-between">
													<span>Points value:</span>
													<span>${result.united.pointsValue.toFixed(2)}</span>
												</div>
												<div class="flex justify-between font-bold border-t pt-1">
													<span>Net cost:</span>
													<span>${result.united.netCost.toFixed(2)}</span>
												</div>
											</div>
										</div>
									</div>

									<!-- Recommendation -->
									<div class="text-center p-3 bg-muted/50 rounded">
										<p class="font-medium">
											Book through {result.betterOption === 'chase' ? 'Chase Portal' : 'United Direct'} 
											and save <strong>${result.savings.toFixed(2)}</strong>
										</p>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</CardContent>
			</Card>
		</div>
	{/if}
</div>