<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Label } from "$lib/components/ui/label";
	import { Input } from "$lib/components/ui/input";
	import { Switch } from "$lib/components/ui/switch";
	import * as Select from "$lib/components/ui/select/index.js";

	interface FlightPanelProps {
		flights: any[];
		departureDate: string;
		returnDate: string;
	}

	let { flights, departureDate, returnDate }: FlightPanelProps = $props();

	// Local sort state for this panel
	let sortBy = $state<string>('price');
	let sortDirection = $state<'asc' | 'desc'>('asc');
	
	// Local time filter state for this panel
	let enableTimeFilter = $state<boolean>(false);
	let minDepartureTime = $state<string>('06:00');
	let maxDepartureTime = $state<string>('23:59');

	// Expanded state for outbound groups
	let expandedGroups = $state<Set<string>>(new Set());
	
	// Return flight sorting state (per outbound group)
	let returnSortBy = $state<Map<string, string>>(new Map());

	function toggleGroupExpansion(groupKey: string) {
		if (expandedGroups.has(groupKey)) {
			expandedGroups.delete(groupKey);
		} else {
			expandedGroups.add(groupKey);
		}
		expandedGroups = new Set(expandedGroups);
	}

	function sortReturnFlights(returnOptions: any[], sortType: string): any[] {
		const sorted = [...returnOptions];
		if (sortType === 'price') {
			sorted.sort((a, b) => parseFloat(a.price.total) - parseFloat(b.price.total));
		} else if (sortType === 'duration') {
			sorted.sort((a, b) => {
				const aDuration = getDurationMinutes(a.flight.itineraries[1].duration);
				const bDuration = getDurationMinutes(b.flight.itineraries[1].duration);
				return aDuration - bDuration;
			});
		} else if (sortType === 'departure') {
			sorted.sort((a, b) => {
				const aDeparture = new Date(a.returning.departure.at);
				const bDeparture = new Date(b.returning.departure.at);
				return aDeparture.getTime() - bDeparture.getTime();
			});
		}
		return sorted;
	}

	function getReturnSortKey(groupKey: string): string {
		return returnSortBy.get(groupKey) || 'price';
	}

	function setReturnSort(groupKey: string, sortType: string) {
		returnSortBy.set(groupKey, sortType);
		returnSortBy = new Map(returnSortBy);
	}

	function getDurationMinutes(duration: string): number {
		const match = duration.match(/PT(\d+H)?(\d+M)?/);
		const hours = match?.[1] ? parseInt(match[1]) : 0;
		const minutes = match?.[2] ? parseInt(match[2]) : 0;
		return hours * 60 + minutes;
	}

	function sortFlights(flightList: any[], sortType: string): any[] {
		const sorted = [...flightList];
		if (sortType === 'price') {
			sorted.sort((a: any, b: any) => parseFloat(a.price.total) - parseFloat(b.price.total));
		} else if (sortType === 'duration') {
			sorted.sort((a: any, b: any) => {
				const aDuration = getDurationMinutes(a.itineraries[0].duration);
				const bDuration = getDurationMinutes(b.itineraries[0].duration);
				return aDuration - bDuration;
			});
		} else if (sortType === 'departure') {
			sorted.sort((a: any, b: any) => {
				const aDeparture = new Date(a.itineraries[0].segments[0].departure.at);
				const bDeparture = new Date(b.itineraries[0].segments[0].departure.at);
				return aDeparture.getTime() - bDeparture.getTime();
			});
		}
		return sorted;
	}

	function sortOutboundGroups(groups: any[], sortType: string, direction: 'asc' | 'desc'): any[] {
		const sorted = [...groups];
		const multiplier = direction === 'asc' ? 1 : -1;
		
		if (sortType === 'price') {
			// Sort by cheapest return option in each group
			sorted.sort((a: any, b: any) => {
				const aPrice = a.returnOptions.length > 0 ? parseFloat(a.returnOptions[0].price.total) : Infinity;
				const bPrice = b.returnOptions.length > 0 ? parseFloat(b.returnOptions[0].price.total) : Infinity;
				return (aPrice - bPrice) * multiplier;
			});
		} else if (sortType === 'duration') {
			// Sort by outbound flight duration
			sorted.sort((a: any, b: any) => {
				const aDuration = a.returnOptions.length > 0 ? getDurationMinutes(a.returnOptions[0].flight.itineraries[0].duration) : 0;
				const bDuration = b.returnOptions.length > 0 ? getDurationMinutes(b.returnOptions[0].flight.itineraries[0].duration) : 0;
				return (aDuration - bDuration) * multiplier;
			});
		} else if (sortType === 'departure') {
			// Sort by outbound departure time
			sorted.sort((a: any, b: any) => {
				return (new Date(a.outbound.departure.at).getTime() - new Date(b.outbound.departure.at).getTime()) * multiplier;
			});
		}
		return sorted;
	}

	function formatTime(dateTimeString: string): string {
		const date = new Date(dateTimeString);
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}

	function formatDate(dateTimeString: string): string {
		const date = new Date(dateTimeString);
		return date.toLocaleDateString();
	}

	function parseDuration(duration: string): string {
		const match = duration.match(/PT(\d+H)?(\d+M)?/);
		const hours = match?.[1] ? parseInt(match[1]) : 0;
		const minutes = match?.[2] ? parseInt(match[2]) : 0;
		return `${hours}h ${minutes}m`;
	}

	function formatDateForDisplay(dateString: string): string {
		// Parse yyyy-mm-dd string manually to avoid timezone issues
		const [year, month, day] = dateString.split('-').map(Number);
		const date = new Date(year, month - 1, day); // Local timezone
		return date.toLocaleDateString('en-US', { 
			weekday: 'short', 
			month: 'short', 
			day: 'numeric' 
		});
	}

	function buildFlightRoute(segments: any[]): string {
		if (segments.length === 1) {
			return `${segments[0].departure.iataCode} → ${segments[0].arrival.iataCode}`;
		}
		
		const airports = [segments[0].departure.iataCode];
		segments.forEach(segment => {
			airports.push(segment.arrival.iataCode);
		});
		
		return airports.join(' → ');
	}

	function calculateLayoverTime(arrivalSegment: any, departureSegment: any): string {
		const arrivalTime = new Date(arrivalSegment.arrival.at);
		const departureTime = new Date(departureSegment.departure.at);
		const layoverMs = departureTime.getTime() - arrivalTime.getTime();
		const layoverMinutes = Math.floor(layoverMs / (1000 * 60));
		const hours = Math.floor(layoverMinutes / 60);
		const minutes = layoverMinutes % 60;
		return `${hours}h ${minutes}m`;
	}

	function getDetailedSegmentInfo(segments: any[]) {
		if (segments.length === 1) {
			return null;
		}
		
		const details = [];
		for (let i = 0; i < segments.length; i++) {
			const segment = segments[i];
			details.push({
				from: segment.departure.iataCode,
				to: segment.arrival.iataCode,
				departure: segment.departure.at,
				arrival: segment.arrival.at,
				flightNumber: `${segment.carrierCode}${segment.number}`,
				layover: i < segments.length - 1 ? calculateLayoverTime(segment, segments[i + 1]) : null
			});
		}
		return details;
	}

	// Time filtered flights
	let timeFilteredFlights = $derived((() => {
		if (!enableTimeFilter) {
			return flights;
		}
		
		return flights.filter((flight: any) => {
			const departureTime = new Date(flight.itineraries[0].segments[0].departure.at);
			const hour = departureTime.getHours();
			const minute = departureTime.getMinutes();
			const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
			
			return timeString >= minDepartureTime && timeString <= maxDepartureTime;
		});
	})());
	
	// Group flights by outbound flight (before sorting)
	let unsortedOutboundGroups = $derived((() => {
		const groups = new Map<string, { 
			outbound: any, 
			outboundSegments: any[], 
			returnOptions: Array<{ flight: any, returning: any, returnSegments: any[], price: any }>
		}>();
		
		timeFilteredFlights.forEach(flight => {
			const outbound = flight.itineraries[0].segments[0];
			const outboundSegments = flight.itineraries[0].segments;
			const returning = flight.itineraries[1] ? flight.itineraries[1].segments[0] : null;
			const returnSegments = flight.itineraries[1] ? flight.itineraries[1].segments : [];
			
			// Create unique key for outbound flight (date, time, route)
			const outboundKey = `${outbound.departure.at}-${buildFlightRoute(outboundSegments)}`;
			
			if (!groups.has(outboundKey)) {
				groups.set(outboundKey, {
					outbound,
					outboundSegments,
					returnOptions: []
				});
			}
			
			// Add this return option to the outbound group
			groups.get(outboundKey)!.returnOptions.push({
				flight,
				returning,
				returnSegments,
				price: flight.price
			});
		});
		
		// Sort return options within each group by price
		groups.forEach(group => {
			group.returnOptions.sort((a, b) => parseFloat(a.price.total) - parseFloat(b.price.total));
		});
		
		return Array.from(groups.values());
	})());

	// Apply sorting to the outbound groups
	let outboundGroups = $derived(sortOutboundGroups(unsortedOutboundGroups, sortBy, sortDirection));
</script>

<div class="w-full space-y-4">
	<!-- Header -->
	<div class="space-y-3">
		<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
			<h3 class="text-lg font-semibold">
				{formatDateForDisplay(departureDate)} → {formatDateForDisplay(returnDate)}
			</h3>
				<div class="flex items-center gap-2">
					<span class="text-sm text-muted-foreground">
						{outboundGroups.length} outbound flight{outboundGroups.length !== 1 ? 's' : ''}
					</span>
					<Label for="sortBy-{departureDate}-{returnDate}" class="text-sm">Sort:</Label>
					<Select.Root type="single" bind:value={sortBy}>
						<Select.Trigger class="w-32 h-8">
							<span class="text-xs">
								{sortBy === 'price' ? 'Best Price' : 
								 sortBy === 'duration' ? 'Out. Duration' : 
								 sortBy === 'departure' ? 'Dep. Time' : sortBy}
							</span>
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="price">Best Price</Select.Item>
							<Select.Item value="duration">Outbound Duration</Select.Item>
							<Select.Item value="departure">Departure Time</Select.Item>
						</Select.Content>
					</Select.Root>
					<button 
						onclick={() => sortDirection = sortDirection === 'asc' ? 'desc' : 'asc'}
						class="flex items-center justify-center w-8 h-8 rounded border hover:bg-muted/50 transition-colors"
						title={sortDirection === 'asc' ? 'Sort Ascending' : 'Sort Descending'}
					>
						<span class="text-xs transition-transform {sortDirection === 'desc' ? 'rotate-180' : ''}">
							▲
						</span>
					</button>
		</div>
		</div>
		
		<!-- Time Filter Controls -->
		<div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 pb-2 border-b">
				<div class="flex items-center space-x-2">
					<Switch id="timeFilter-{departureDate}-{returnDate}" bind:checked={enableTimeFilter} />
					<Label for="timeFilter-{departureDate}-{returnDate}" class="text-sm">Filter by departure time</Label>
				</div>
				
				{#if enableTimeFilter}
					<div class="flex items-center gap-3">
						<div class="flex items-center gap-1">
							<Label class="text-xs">From:</Label>
							<Input 
								type="time" 
								bind:value={minDepartureTime}
								class="w-20 h-7 text-xs"
							/>
						</div>
						<div class="flex items-center gap-1">
							<Label class="text-xs">To:</Label>
							<Input 
								type="time" 
								bind:value={maxDepartureTime}
								class="w-20 h-7 text-xs"
							/>
						</div>
					</div>
				{/if}
		</div>
	</div>
	
	<!-- Flight Results -->
	<div class="space-y-3">
		{#if outboundGroups.length === 0}
			<p class="text-sm text-muted-foreground text-center py-4">No flights found for this date combination</p>
		{:else}
			{#each outboundGroups as group, groupIndex}
				{@const outbound = group.outbound}
				{@const outboundSegments = group.outboundSegments.length}
				{@const connectionType = outboundSegments === 1 ? 'Direct Flight' : `${outboundSegments - 1} stop${outboundSegments > 2 ? 's' : ''}`}
				{@const outboundDetails = getDetailedSegmentInfo(group.outboundSegments)}
				{@const groupKey = `${outbound.departure.at}-${buildFlightRoute(group.outboundSegments)}`}
				{@const isExpanded = expandedGroups.has(groupKey)}
				{@const cheapestPrice = group.returnOptions.length > 0 ? group.returnOptions[0].price : null}
				<Card class="hover:shadow-md transition-shadow">
					<CardContent class="pt-4 pb-4">
						<div class="flex flex-col space-y-3">
							<!-- Outbound flight header -->
							<div 
								class="flex items-center justify-between cursor-pointer hover:bg-muted/30 rounded p-2 -m-2" 
								onclick={() => toggleGroupExpansion(groupKey)}
							>
								<div class="flex items-center gap-3">
									<div class="flex items-center gap-2">
										<div class="flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-bold text-blue-700 dark:text-blue-300">
											{outbound.carrierCode}
										</div>
										<div>
											<div class="font-semibold">Flight {outbound.number} • {connectionType}</div>
											<div class="text-sm text-muted-foreground">{formatDate(outbound.departure.at)}</div>
										</div>
									</div>
									<div class="text-lg font-semibold">
										<span class="text-blue-600 dark:text-blue-400 text-sm mr-2">OUT:</span>
										{buildFlightRoute(group.outboundSegments)}
									</div>
								</div>
								<div class="flex items-center gap-3">
									{#if cheapestPrice}
										<div class="text-right">
											<div class="text-sm text-muted-foreground">{group.returnOptions.length} return option{group.returnOptions.length > 1 ? 's' : ''}</div>
											<div class="font-bold text-green-600 dark:text-green-400">from {cheapestPrice.currency} {cheapestPrice.total}</div>
										</div>
									{/if}
									<div class="w-5 h-5 transition-transform {isExpanded ? 'rotate-180' : ''}">
										▼
									</div>
								</div>
							</div>

							<!-- Outbound flight details -->
							<div class="border rounded-lg p-3 bg-blue-50/50 dark:bg-blue-950/30">
								<div class="grid grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
									<div>
										<div class="text-xs text-muted-foreground">Departure</div>
										<div class="font-medium">{formatTime(outbound.departure.at)}</div>
									</div>
									<div>
										<div class="text-xs text-muted-foreground">Arrival</div>
										<div class="font-medium">{formatTime(group.outboundSegments[group.outboundSegments.length - 1].arrival.at)}</div>
									</div>
									<div>
										<div class="text-xs text-muted-foreground">Duration</div>
										<div class="font-medium">{parseDuration(group.returnOptions[0]?.flight.itineraries[0].duration || 'PT0H0M')}</div>
									</div>
								</div>
								{#if outboundDetails}
									<div class="mt-2 pt-2 border-t border-muted/50">
										<div class="text-xs text-muted-foreground mb-1">Connection Details</div>
										<div class="space-y-1">
											{#each outboundDetails as segment, i}
												<div class="flex items-center justify-between text-xs">
													<span class="font-mono">{segment.flightNumber}: {segment.from} → {segment.to}</span>
													<span class="text-muted-foreground">{formatTime(segment.departure)} - {formatTime(segment.arrival)}</span>
												</div>
												{#if segment.layover}
													<div class="flex items-center justify-center text-xs text-amber-600 dark:text-amber-400">
														<span class="bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded">↓ {segment.layover} layover in {segment.to}</span>
													</div>
												{/if}
											{/each}
										</div>
									</div>
								{/if}
							</div>

							<!-- Return flight options (expandable) -->
							{#if isExpanded && group.returnOptions.length > 0}
								<div class="space-y-2">
									<div class="flex items-center justify-between">
										<div class="text-sm font-medium text-muted-foreground">Return Flight Options:</div>
										<div class="flex items-center gap-2">
											<Label class="text-xs">Sort:</Label>
											<Select.Root type="single" value={getReturnSortKey(groupKey)} onValueChange={(value) => setReturnSort(groupKey, value || 'price')}>
												<Select.Trigger class="w-24 h-6">
													<span class="text-xs">
														{getReturnSortKey(groupKey) === 'price' ? 'Price' : 
														 getReturnSortKey(groupKey) === 'duration' ? 'Duration' : 
														 getReturnSortKey(groupKey) === 'departure' ? 'Dep. Time' : 'Price'}
													</span>
												</Select.Trigger>
												<Select.Content>
													<Select.Item value="price">Price</Select.Item>
													<Select.Item value="duration">Duration</Select.Item>
													<Select.Item value="departure">Departure Time</Select.Item>
												</Select.Content>
											</Select.Root>
										</div>
									</div>
									{#each sortReturnFlights(group.returnOptions, getReturnSortKey(groupKey)) as returnOption}
										{@const returning = returnOption.returning}
										{@const returnSegments = returnOption.returnSegments}
										{@const returnDetails = getDetailedSegmentInfo(returnSegments)}
										<div class="border rounded-lg p-3 bg-orange-50/50 dark:bg-orange-950/30 hover:bg-orange-100/50 dark:hover:bg-orange-900/40 transition-colors">
											<div class="flex items-center justify-between mb-2">
												<div class="flex items-center gap-2">
													<div class="flex items-center justify-center w-5 h-5 bg-orange-100 dark:bg-orange-900/30 rounded-full text-xs font-bold text-orange-700 dark:text-orange-300">
														{returning.carrierCode}
													</div>
													<span class="text-sm font-medium">Flight {returning.number}</span>
													<span class="text-xs text-muted-foreground">• {returnSegments.length === 1 ? 'Direct Flight' : `${returnSegments.length - 1} stop${returnSegments.length > 2 ? 's' : ''}`}</span>
												</div>
												<div class="text-right">
													<div class="text-xs text-muted-foreground">{formatDate(returning.departure.at)}</div>
													<div class="font-bold text-green-600 dark:text-green-400">{returnOption.price.currency} {returnOption.price.total}</div>
												</div>
											</div>
											<div class="grid grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
												<div>
													<div class="text-xs text-muted-foreground">Route</div>
													<div class="font-medium">{buildFlightRoute(returnSegments)}</div>
												</div>
												<div>
													<div class="text-xs text-muted-foreground">Time</div>
													<div class="font-medium">{formatTime(returning.departure.at)} - {formatTime(returnSegments[returnSegments.length - 1].arrival.at)}</div>
												</div>
												<div>
													<div class="text-xs text-muted-foreground">Duration</div>
													<div class="font-medium">{parseDuration(returnOption.flight.itineraries[1].duration)}</div>
												</div>
											</div>
											{#if returnDetails}
												<div class="mt-2 pt-2 border-t border-muted/50">
													<div class="text-xs text-muted-foreground mb-1">Connection Details</div>
													<div class="space-y-1">
														{#each returnDetails as segment, i}
															<div class="flex items-center justify-between text-xs">
																<span class="font-mono">{segment.flightNumber}: {segment.from} → {segment.to}</span>
																<span class="text-muted-foreground">{formatTime(segment.departure)} - {formatTime(segment.arrival)}</span>
															</div>
															{#if segment.layover}
																<div class="flex items-center justify-center text-xs text-amber-600 dark:text-amber-400">
																	<span class="bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded">↓ {segment.layover} layover in {segment.to}</span>
																</div>
															{/if}
														{/each}
													</div>
												</div>
											{/if}
										</div>
									{/each}
								</div>
							{/if}
						</div>
					</CardContent>
				</Card>
			{/each}
		{/if}
	</div>
</div>