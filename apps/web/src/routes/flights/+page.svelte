<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import * as Select from "$lib/components/ui/select/index.js";
	import { Button } from "$lib/components/ui/button";
	import { toast } from "svelte-sonner";
	import { Switch } from "$lib/components/ui/switch";
	import { Progress } from "$lib/components/ui/progress/index.js";
	import FlightPanel from "$lib/components/FlightPanel.svelte";
	import { PUBLIC_AMADEUS_BASE_URL } from "$env/static/public";
	import { PUBLIC_API_BASE_URL } from "$env/static/public";

	// Star Alliance airlines
	const starAllianceAirlines = [
		'AC', 'AD', 'AI', 'AV', 'BR', 'CA', 'CM', 'CO', 'EI', 'ET', 'EW', 'LH', 'LO', 'LX', 'MS', 'NH', 'NZ', 'OS', 'OU', 'OZ', 'SA', 'SK', 'SN', 'SQ', 'TG', 'TK', 'TP', 'UA', 'ZH'
	];

	// Search API parameters
	let origin = $state('');
	let destination = $state('');
	let departureDateStart = $state('');
	let departureDateEnd = $state('');
	let returnDateStart = $state('');
	let returnDateEnd = $state('');
	let adults = $state('1');
	let nonStopOnly = $state(true);

	// API provider selection
	let apiProvider = $state<'amadeus' | 'serpapi'>('amadeus');
	
	// API credentials
	let apiKey = $state('');
	let apiSecret = $state('');
	let serpApiKey = $state('');
	let accessToken: string | null = null;
	let apiCredentials: { apiKey: string; apiSecret: string } | null = $state(null);
	let serpApiCredentials: { apiKey: string } | null = $state(null);

	// Results state
	let flights = $state<any[]>([]);
	let isLoading = $state(false);
	let error = $state<string | null>(null);
	
	// Progress tracking
	let searchProgress = $state(0);
	let totalCombinations = $state(0);
	let currentCombination = $state(0);

	// Check for saved credentials on mount
	$effect(() => {
		const savedAmadeus = localStorage.getItem('amadeusCredentials');
		if (savedAmadeus) {
			try {
				apiCredentials = JSON.parse(savedAmadeus);
			} catch (e) {
				console.error('Failed to parse saved Amadeus credentials');
			}
		}
		
		const savedSerpApi = localStorage.getItem('serpApiCredentials');
		if (savedSerpApi) {
			try {
				serpApiCredentials = JSON.parse(savedSerpApi);
			} catch (e) {
				console.error('Failed to parse saved SerpAPI credentials');
			}
		}
		
		const savedProvider = localStorage.getItem('apiProvider');
		if (savedProvider && (savedProvider === 'amadeus' || savedProvider === 'serpapi')) {
			apiProvider = savedProvider;
		}
	});

	// API setup visibility
	let showApiSetup = $derived(
		(apiProvider === 'amadeus' && !apiCredentials) || 
		(apiProvider === 'serpapi' && !serpApiCredentials)
	);


	// Group flights by search combination
	let flightGroups = $derived((() => {
		const groups = new Map<string, { departureDate: string; returnDate: string; flights: any[] }>();
		
		flights.forEach(flight => {
			const depDate = flight._searchDep;
			const retDate = flight._searchRet;
			const key = `${depDate}-${retDate}`;
			
			if (!groups.has(key)) {
				groups.set(key, {
					departureDate: depDate,
					returnDate: retDate,
					flights: []
				});
			}
			
			groups.get(key)!.flights.push(flight);
		});
		
		return Array.from(groups.values()).sort((a, b) => {
			// Sort by departure date, then return date
			if (a.departureDate !== b.departureDate) {
				return a.departureDate.localeCompare(b.departureDate);
			}
			return a.returnDate.localeCompare(b.returnDate);
		});
	})());


	// Set default values
	$effect(() => {
		// Check if we're in development mode
		const isDevelopment = import.meta.env.DEV;
		
		if (isDevelopment) {
			// Development defaults
			if (!origin) origin = 'SFO';
			if (!destination) destination = 'MSY';
			if (!departureDateStart) departureDateStart = '2025-11-25';
			if (!departureDateEnd) departureDateEnd = '2025-11-26';
			if (!returnDateStart) returnDateStart = '2025-11-30';
			if (!returnDateEnd) returnDateEnd = '2025-11-30';
		} else {
			// Production defaults - calculated dates
			const today = new Date();
			const nextWeek = new Date(today);
			nextWeek.setDate(today.getDate() + 7);
			const nextWeekEnd = new Date(today);
			nextWeekEnd.setDate(today.getDate() + 8); // 1 day apart
			const twoWeeksLater = new Date(today);
			twoWeeksLater.setDate(today.getDate() + 14);
			const twoWeeksLaterEnd = new Date(today);
			twoWeeksLaterEnd.setDate(today.getDate() + 15); // 1 day apart

			if (!departureDateStart) departureDateStart = nextWeek.toISOString().split('T')[0];
			if (!departureDateEnd) departureDateEnd = nextWeekEnd.toISOString().split('T')[0];
			if (!returnDateStart) returnDateStart = twoWeeksLater.toISOString().split('T')[0];
			if (!returnDateEnd) returnDateEnd = twoWeeksLaterEnd.toISOString().split('T')[0];
		}
	});

	async function saveApiCredentials() {
		if (apiProvider === 'amadeus') {
			if (!apiKey || !apiSecret) {
				toast.error('Please enter both API key and secret');
				return;
			}

			apiCredentials = { apiKey, apiSecret };
			localStorage.setItem('amadeusCredentials', JSON.stringify(apiCredentials));
			
			// Clear the input fields
			apiKey = '';
			apiSecret = '';
			
			toast.success('Amadeus API credentials saved successfully!');
		} else if (apiProvider === 'serpapi') {
			if (!serpApiKey) {
				toast.error('Please enter your SerpAPI key');
				return;
			}

			serpApiCredentials = { apiKey: serpApiKey };
			localStorage.setItem('serpApiCredentials', JSON.stringify(serpApiCredentials));
			
			// Clear the input field
			serpApiKey = '';
			
			toast.success('SerpAPI credentials saved successfully!');
		}
		
		localStorage.setItem('apiProvider', apiProvider);
	}

	function clearCredentials() {
		apiCredentials = null;
		serpApiCredentials = null;
		localStorage.removeItem('amadeusCredentials');
		localStorage.removeItem('serpApiCredentials');
		localStorage.removeItem('apiProvider');
		accessToken = null;
		apiKey = '';
		apiSecret = '';
		serpApiKey = '';
		apiProvider = 'amadeus';
		toast.info('All API credentials cleared');
	}


	async function getAccessToken() {
		if (!apiCredentials) {
			throw new Error('API credentials not configured');
		}

		try {
			const response = await fetch('https://api.amadeus.com/v1/security/oauth2/token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams({
					grant_type: 'client_credentials',
					client_id: apiCredentials.apiKey,
					client_secret: apiCredentials.apiSecret,
				}),
			});
			
			if (!response.ok) {
				const errorText = await response.text();
				console.error('Token request failed:', errorText);
				throw new Error(`Failed to get access token: ${response.status} - ${errorText}`);
			}

			const data = await response.json();
			accessToken = data.access_token;
			return accessToken;
		} catch (error) {
			console.error('Error getting access token:', error);
			throw error;
		}
	}

	async function searchFlights(params: Record<string, string>) {
		if (!accessToken) {
			await getAccessToken();
		}

		const url = new URL('https://api.amadeus.com/v2/shopping/flight-offers');
		Object.keys(params).forEach(key => {
			if (params[key] !== null && params[key] !== undefined) {
				url.searchParams.append(key, params[key]);
			}
		});

		try {
			const response = await fetch(url, {
				headers: {
					'Authorization': `Bearer ${accessToken}`,
				},
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.error('Flight search failed:', errorText);
				throw new Error(`API request failed: ${response.status} - ${errorText}`);
			}

			const data = await response.json();
			
			if (data.warnings) {
				console.warn('API warnings:', data.warnings);
			}
			
			if (data.errors) {
				console.error('API errors:', data.errors);
			}
			
			return data;
		} catch (error) {
			console.error('Error searching flights:', error);
			throw error;
		}
	}

	async function searchSerpApiFlights(params: {
		origin: string;
		destination: string;
		departureDate: string;
		returnDate: string;
		adults: string;
		nonStop?: boolean;
	}) {
		if (!serpApiCredentials) {
			throw new Error('SerpAPI credentials not configured');
		}

		const requestBody = {
			api_key: serpApiCredentials.apiKey,
			origin: params.origin,
			destination: params.destination,
			departure_date: params.departureDate,
			return_date: params.returnDate,
			adults: params.adults,
			non_stop: params.nonStop
		};

		try {
			const response = await fetch(`${PUBLIC_API_BASE_URL}/flights/serpapi-proxy`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestBody)
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.error('SerpAPI proxy request failed:', errorText);
				throw new Error(`SerpAPI proxy request failed: ${response.status} - ${errorText}`);
			}

			const data = await response.json();
			
			if (data.error) {
				console.error('SerpAPI error:', data.error);
				throw new Error(`SerpAPI error: ${data.error}`);
			}
			
			return data;
		} catch (error) {
			console.error('Error searching SerpAPI flights:', error);
			throw error;
		}
	}


	function generateDateRange(startDate: string, endDate: string): string[] {
		const dates: string[] = [];
		
		// Parse start and end dates as yyyy-mm-dd strings
		const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
		const [endYear, endMonth, endDay] = endDate.split('-').map(Number);
		
		// Create date objects for comparison only
		let currentDate = new Date(startYear, startMonth - 1, startDay);
		const endDateObj = new Date(endYear, endMonth - 1, endDay);
		
		while (currentDate <= endDateObj) {
			// Format as yyyy-mm-dd string directly without timezone conversion
			const year = currentDate.getFullYear();
			const month = String(currentDate.getMonth() + 1).padStart(2, '0');
			const day = String(currentDate.getDate()).padStart(2, '0');
			dates.push(`${year}-${month}-${day}`);
			
			// Move to next day
			currentDate.setDate(currentDate.getDate() + 1);
		}
		
		return dates;
	}


	async function handleSearch() {
		if (apiProvider === 'amadeus' && !apiCredentials) {
			toast.error('Please configure your Amadeus API credentials first');
			return;
		}
		
		if (apiProvider === 'serpapi' && !serpApiCredentials) {
			toast.error('Please configure your SerpAPI credentials first');
			return;
		}

		if (!origin || !destination || !departureDateStart || !departureDateEnd || !returnDateStart || !returnDateEnd) {
			toast.error('Please fill in all required fields');
			return;
		}

		isLoading = true;
		error = null;
		flights = [];
		searchProgress = 0;
		currentCombination = 0;
		totalCombinations = 0;

		try {
			const departureDates = generateDateRange(departureDateStart, departureDateEnd);
			const returnDates = generateDateRange(returnDateStart, returnDateEnd);
			const allResults: any[] = [];
			
			// Initialize progress tracking
			totalCombinations = departureDates.length * returnDates.length;
			currentCombination = 0;
			searchProgress = 0;

			// Search for all combinations of departure and return dates
			for (const departureDate of departureDates) {
				for (const returnDate of returnDates) {
					currentCombination++;
					const searchParams = {
						originLocationCode: origin.toUpperCase(),
						destinationLocationCode: destination.toUpperCase(),
						departureDate: departureDate,
						returnDate: returnDate,
						adults: adults,
						...(nonStopOnly && { nonStop: 'true' }),
						max: '40',
						currencyCode: 'USD'
					};

					try {
						// Update progress
						searchProgress = Math.round((currentCombination / totalCombinations) * 100);
						
						let flights: any[] = [];
						
						if (apiProvider === 'amadeus') {
							const result = await searchFlights(searchParams);
							
							if (result.data && result.data.length > 0) {
								// Filter for Star Alliance airlines only
								const starAllianceFlights = result.data.filter((offer: any) => {
									const outboundCarrier = offer.itineraries[0].segments[0].carrierCode;
									const returnCarrier = offer.itineraries[1] ? offer.itineraries[1].segments[0].carrierCode : outboundCarrier;
									return starAllianceAirlines.includes(outboundCarrier) && starAllianceAirlines.includes(returnCarrier);
								});

								// Add departure/return date info for debugging
								starAllianceFlights.forEach((flight: any) => {
									flight._searchDep = departureDate;
									flight._searchRet = returnDate;
								});

								flights = starAllianceFlights;
							}
						} else if (apiProvider === 'serpapi') {
							const serpParams = {
								origin: origin.toUpperCase(),
								destination: destination.toUpperCase(),
								departureDate: departureDate,
								returnDate: returnDate,
								adults: adults,
								nonStop: nonStopOnly
							};
							
							const result = await searchSerpApiFlights(serpParams);
							// Backend already returns Amadeus-compatible format
							flights = result.data || [];
						}

						allResults.push(...flights);
					} catch (err) {
						console.error(`Error searching for departure ${departureDate}, return ${returnDate}:`, err);
					}
				}
			}
			
			// Complete progress
			searchProgress = 100;

			// Remove duplicates - but only exact duplicates (same round-trip combination)
			// Note: We should NOT deduplicate if same return flight pairs with different outbound flights
			const uniqueFlights = allResults.filter((flight, index, arr) => {
				const outbound = flight.itineraries[0].segments[0];
				const returning = flight.itineraries[1] ? flight.itineraries[1].segments[0] : null;
				
				// Create unique key for EXACT same round-trip (price included to distinguish different bookings)
				const flightKey = `${outbound.carrierCode}${outbound.number}-${outbound.departure.at}-${returning?.carrierCode || 'oneway'}-${returning?.number || 'oneway'}-${returning?.departure.at || 'oneway'}-${flight.price.total}`;
				
				return arr.findIndex(f => {
					const fOutbound = f.itineraries[0].segments[0];
					const fReturning = f.itineraries[1] ? f.itineraries[1].segments[0] : null;
					const fFlightKey = `${fOutbound.carrierCode}${fOutbound.number}-${fOutbound.departure.at}-${fReturning?.carrierCode || 'oneway'}-${fReturning?.number || 'oneway'}-${fReturning?.departure.at || 'oneway'}-${f.price.total}`;
					return fFlightKey === flightKey;
				}) === index;
			});

			// Simple debug logging
			console.log('=== FLIGHT DEBUG ===');
			console.log(`Total unique flights: ${uniqueFlights.length}`);
			
			// Group by outbound flight to see the issue
			const outboundDebug = new Map();
			uniqueFlights.forEach(flight => {
				const outbound = flight.itineraries[0].segments[0];
				const returning = flight.itineraries[1]?.segments[0];
				const outKey = `${outbound.carrierCode}${outbound.number} ${outbound.departure.at.split('T')[0]} ${outbound.departure.at.split('T')[1].substring(0,5)}`;
				const retKey = returning ? `${returning.carrierCode}${returning.number} ${returning.departure.at.split('T')[0]} ${returning.departure.at.split('T')[1].substring(0,5)}` : 'ONE-WAY';
				
				if (!outboundDebug.has(outKey)) {
					outboundDebug.set(outKey, new Set());
				}
				outboundDebug.get(outKey).add(retKey);
			});
			
			outboundDebug.forEach((returns, outbound) => {
				console.log(`OUT: ${outbound} → RETURNS: ${returns.size} options`);
				if (returns.size <= 3) {
					returns.forEach((ret: string) => console.log(`  - ${ret}`));
				}
			});
			console.log('===================');

			// Don't sort here - let the sortedFlights derived state handle it
			flights = uniqueFlights;

			if (flights.length === 0) {
				toast.info('No flights found. Try adjusting your search criteria.');
			} else {
				toast.success(`Found ${flights.length} flights`);
			}

		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred while searching for flights';
			toast.error(error);
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="flex flex-col items-center gap-6 p-6 w-full">
	<div class="text-center mb-6">
		<h1 class="text-4xl font-bold text-foreground mb-2">✈️ Star Alliance Flight Search</h1>
		<p class="text-lg text-muted-foreground">Compare direct flights with flexible departure times and return dates</p>
	</div>

	{#if showApiSetup}
		<!-- API Setup Card -->
		<Card class="w-full max-w-2xl border-amber-200 bg-amber-50/50 dark:bg-amber-950/30 dark:border-amber-700">
			<CardHeader>
				<CardTitle class="text-amber-800 dark:text-amber-200">🔑 API Setup Required</CardTitle>
			</CardHeader>
			<CardContent class="space-y-4">
				<!-- API Provider Selection -->
				<div class="space-y-3">
					<Label>Choose API Provider</Label>
					<div class="grid grid-cols-2 gap-2">
						<button 
							class="p-3 border rounded-lg text-left transition-colors {apiProvider === 'amadeus' ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30' : 'border-muted hover:bg-muted/50'}"
							onclick={() => apiProvider = 'amadeus'}
						>
							<div class="font-medium">Amadeus</div>
							<div class="text-xs text-muted-foreground">Professional flight API</div>
						</button>
						<button 
							class="p-3 border rounded-lg text-left transition-colors {apiProvider === 'serpapi' ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30' : 'border-muted hover:bg-muted/50'}"
							onclick={() => apiProvider = 'serpapi'}
						>
							<div class="font-medium">SerpAPI</div>
							<div class="text-xs text-muted-foreground">Google Flights data</div>
						</button>
					</div>
				</div>

				{#if apiProvider === 'amadeus'}
					<p class="text-amber-700 dark:text-amber-300">
						Get your Amadeus API credentials free at 
						<a href="https://developers.amadeus.com" target="_blank" class="underline hover:text-amber-600">developers.amadeus.com</a>
					</p>
					<div class="space-y-3">
						<div class="space-y-2">
							<Label for="apiKey">API Key</Label>
							<Input 
								id="apiKey"
								type="text" 
								bind:value={apiKey}
								placeholder="Enter your Amadeus API Key"
							/>
						</div>
						<div class="space-y-2">
							<Label for="apiSecret">API Secret</Label>
							<Input 
								id="apiSecret"
								type="password" 
								bind:value={apiSecret}
								placeholder="Enter your Amadeus API Secret"
							/>
						</div>
					</div>
				{:else if apiProvider === 'serpapi'}
					<p class="text-amber-700 dark:text-amber-300">
						Get your SerpAPI key at 
						<a href="https://serpapi.com" target="_blank" class="underline hover:text-amber-600">serpapi.com</a>
						- Free tier includes 100 searches/month
					</p>
					<div class="space-y-3">
						<div class="space-y-2">
							<Label for="serpApiKey">SerpAPI Key</Label>
							<Input 
								id="serpApiKey"
								type="password" 
								bind:value={serpApiKey}
								placeholder="Enter your SerpAPI Key"
							/>
						</div>
					</div>
				{/if}

				<Button onclick={saveApiCredentials} class="w-full">
					Save {apiProvider === 'amadeus' ? 'Amadeus' : 'SerpAPI'} Credentials
				</Button>
			</CardContent>
		</Card>
	{:else}
		<!-- Search Form -->
		<Card class="w-full max-w-screen-xl">
			<CardHeader>
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<CardTitle>Flight Search</CardTitle>
						<div class="flex items-center gap-2 px-2 py-1 bg-muted rounded-md text-sm">
							<div class="w-2 h-2 bg-green-500 rounded-full"></div>
							<span class="capitalize">{apiProvider}</span>
						</div>
					</div>
					<Button onclick={clearCredentials} variant="outline" size="sm">
						Clear Credentials
					</Button>
				</div>
			</CardHeader>
			<CardContent class="space-y-6">
				<!-- Search Parameters Section -->
				<div class="border rounded-lg p-4 space-y-4">
					<div class="flex items-center gap-2">
						<div class="w-3 h-3 bg-blue-500 rounded-full"></div>
						<h3 class="font-medium text-sm">Search Parameters (sent to API)</h3>
					</div>
					
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						<div class="space-y-2">
							<Label for="origin">Origin Airport</Label>
							<Input 
								id="origin"
								type="text" 
								bind:value={origin}
								placeholder="e.g., LAX, JFK, LHR"
								class="uppercase"
							/>
						</div>

						<div class="space-y-2">
							<Label for="destination">Destination Airport</Label>
							<Input 
								id="destination"
								type="text" 
								bind:value={destination}
								placeholder="e.g., NRT, FRA, SIN"
								class="uppercase"
							/>
						</div>

						<div class="space-y-2">
							<Label for="departureDateStart">Departure Date Range Start</Label>
							<Input 
								id="departureDateStart"
								type="date" 
								bind:value={departureDateStart}
							/>
						</div>

						<div class="space-y-2">
							<Label for="departureDateEnd">Departure Date Range End</Label>
							<Input 
								id="departureDateEnd"
								type="date" 
								bind:value={departureDateEnd}
							/>
						</div>

						<div class="space-y-2">
							<Label for="returnDateStart">Return Date Range Start</Label>
							<Input 
								id="returnDateStart"
								type="date" 
								bind:value={returnDateStart}
							/>
						</div>

						<div class="space-y-2">
							<Label for="returnDateEnd">Return Date Range End</Label>
							<Input 
								id="returnDateEnd"
								type="date" 
								bind:value={returnDateEnd}
							/>
						</div>

						<div class="space-y-2">
							<Label for="adults">Passengers</Label>
							<Select.Root type='single' bind:value={adults}>
								<Select.Trigger class="w-full">
									<span>{adults} Adults</span>
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="1">1 Adult</Select.Item>
									<Select.Item value="2">2 Adults</Select.Item>
									<Select.Item value="3">3 Adults</Select.Item>
									<Select.Item value="4">4 Adults</Select.Item>
								</Select.Content>
							</Select.Root>
						</div>
						
						<div class="space-y-2">
							<Label for="nonStopOnly">Connection Type</Label>
							<div class="flex items-center space-x-2 pt-2">
								<Switch id="nonStopOnly" bind:checked={nonStopOnly} />
								<Label for="nonStopOnly" class="text-sm">Direct flights only (no connections)</Label>
							</div>
						</div>
					</div>
				</div>
				
				<!-- Note about filtering -->
				<div class="border rounded-lg p-4 bg-muted/50">
					<div class="flex items-center gap-2 mb-2">
						<div class="w-3 h-3 bg-green-500 rounded-full"></div>
						<h3 class="font-medium text-sm">Display Filters</h3>
					</div>
					<p class="text-sm text-muted-foreground">Time and other display filters are available on each flight panel below after searching</p>
				</div>

				<Button onclick={handleSearch} disabled={isLoading} class="w-full bg-blue-600 hover:bg-blue-700">
					{#if isLoading}
						Searching...
					{:else}
						🔍 Search {apiProvider === 'amadeus' ? 'Star Alliance ' : ''}Flights via {apiProvider === 'amadeus' ? 'Amadeus' : 'SerpAPI'}
					{/if}
				</Button>
			</CardContent>
		</Card>

		<!-- Results -->
		{#if error}
			<Card class="w-full max-w-4xl border-red-200 bg-red-50/50 dark:bg-red-950/30 dark:border-red-700">
				<CardContent class="pt-6">
					<div class="text-red-700 dark:text-red-300 text-center">
						<strong>Error:</strong> {error}
					</div>
				</CardContent>
			</Card>
		{:else if isLoading}
			<Card class="w-full max-w-4xl">
				<CardContent class="pt-6">
					<div class="flex flex-col items-center gap-6 py-8">
						<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
						<div class="w-full max-w-md space-y-3">
							<div class="flex justify-between text-sm">
								<span class="text-muted-foreground">Searching flight combinations...</span>
								<span class="font-medium">{currentCombination}/{totalCombinations}</span>
							</div>
							<Progress value={searchProgress} class="h-2" />
							<p class="text-center text-sm text-muted-foreground">{searchProgress}% complete</p>
						</div>
					</div>
				</CardContent>
			</Card>
		{:else if flights.length > 0}
			<div class="w-full max-w-screen-3xl space-y-6">
				<!-- Results header -->
				<div class="text-center">
					<h2 class="text-2xl font-bold">Found {flights.length} flights across {flightGroups.length} date combinations</h2>
					<p class="text-muted-foreground mt-1">Each panel shows flights for a specific departure → return date combination</p>
				</div>
				
				<!-- Flight panels grid -->
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{#each flightGroups as group}
						<FlightPanel 
							flights={group.flights}
							departureDate={group.departureDate}
							returnDate={group.returnDate}
						/>
					{/each}
				</div>
			</div>
		{:else if !isLoading && !error}
			<Card class="w-full max-w-4xl">
				<CardContent class="pt-6">
					<div class="text-center py-8">
						<h3 class="text-lg font-medium text-muted-foreground">Ready to search!</h3>
						<p class="text-muted-foreground">Enter your search criteria above and click "Search Flights" to find Star Alliance direct flights.</p>
					</div>
				</CardContent>
			</Card>
		{/if}
	{/if}
</div>