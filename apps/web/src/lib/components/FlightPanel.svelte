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
	
	// Local time filter state for this panel
	let enableTimeFilter = $state<boolean>(false);
	let minDepartureTime = $state<string>('06:00');
	let maxDepartureTime = $state<string>('23:00');

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
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { 
			weekday: 'short', 
			month: 'short', 
			day: 'numeric' 
		});
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
	
	// Sorted flights for this panel (after time filtering)
	let sortedFlights = $derived(sortFlights(timeFilteredFlights, sortBy));
</script>

<Card class="w-full">
	<CardHeader>
		<div class="space-y-3">
			<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
				<CardTitle class="text-lg">
					{formatDateForDisplay(departureDate)} → {formatDateForDisplay(returnDate)}
				</CardTitle>
				<div class="flex items-center gap-2">
					<span class="text-sm text-muted-foreground">
						{enableTimeFilter ? `${sortedFlights.length}/${flights.length}` : flights.length} flights
					</span>
					<Label for="sortBy-{departureDate}-{returnDate}" class="text-sm">Sort:</Label>
					<Select.Root type="single" bind:value={sortBy}>
						<Select.Trigger class="w-28 h-8">
							<span class="text-xs">
								{sortBy === 'price' ? 'Price' : 
								 sortBy === 'duration' ? 'Duration' : 
								 sortBy === 'departure' ? 'Dep. Time' : sortBy}
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
	</CardHeader>
	<CardContent class="space-y-3">
		{#if sortedFlights.length === 0}
			<p class="text-sm text-muted-foreground text-center py-4">No flights found for this date combination</p>
		{:else}
			{#each sortedFlights as flight}
				{@const outbound = (flight as any).itineraries[0].segments[0]}
				{@const returning = (flight as any).itineraries[1] ? (flight as any).itineraries[1].segments[0] : null}
				{@const outboundSegments = (flight as any).itineraries[0].segments.length}
				{@const connectionType = outboundSegments === 1 ? 'Direct Flight' : `${outboundSegments - 1} stop${outboundSegments > 2 ? 's' : ''}`}
				<Card class="hover:shadow-md transition-shadow">
					<CardContent class="pt-4 pb-4">
						<div class="flex flex-col space-y-3">
							<!-- Header with route and price -->
							<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
								<div class="text-lg font-semibold">
									{outbound.departure.iataCode} → {outbound.arrival.iataCode}
									{#if returning}
										→ {returning.arrival.iataCode}
									{/if}
								</div>
								<div class="text-xl font-bold text-green-600 dark:text-green-400">
									{(flight as any).price.currency} {(flight as any).price.total}
								</div>
							</div>

							<!-- Flight details grid -->
							<div class="grid grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
								<div>
									<div class="text-xs text-muted-foreground">Outbound</div>
									<div class="space-y-1">
										<div class="text-xs text-muted-foreground">{formatDate(outbound.departure.at)}</div>
										<div class="font-medium">{formatTime(outbound.departure.at)} - {formatTime(outbound.arrival.at)}</div>
									</div>
								</div>

								{#if returning}
									<div>
										<div class="text-xs text-muted-foreground">Return</div>
										<div class="space-y-1">
											<div class="text-xs text-muted-foreground">{formatDate(returning.departure.at)}</div>
											<div class="font-medium">{formatTime(returning.departure.at)} - {formatTime(returning.arrival.at)}</div>
										</div>
									</div>
								{/if}

								<div>
									<div class="text-xs text-muted-foreground">Duration</div>
									<div class="font-medium">{parseDuration((flight as any).itineraries[0].duration)}</div>
								</div>
							</div>

							<!-- Airline info -->
							<div class="flex items-center gap-2 pt-2 border-t text-sm">
								<div class="flex items-center justify-center w-6 h-6 bg-muted rounded-full text-xs font-bold">
									{outbound.carrierCode}
								</div>
								<span>Flight {outbound.number} • {connectionType}</span>
							</div>
						</div>
					</CardContent>
				</Card>
			{/each}
		{/if}
	</CardContent>
</Card>