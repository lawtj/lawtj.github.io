<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  
	import { Input } from "$lib/components/ui/input";
	import { Button } from "$lib/components/ui/button";
	import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";

	type Drug = {
		toxicDose: number;
		givenDose: number | null;
		milligrams: number;
		name: string;
	};

	type Drugs = {
		[key: string]: Drug;
	};

	let kgs: number = $state(70);
	
	let drugs = $state<Drugs>({
		lidocaine1: {
			toxicDose: 4.5,
			givenDose: null,
			milligrams: 10,
			name: "Lidocaine 1%"
		},
		lidocaine2: {
			toxicDose: 4.5,
			givenDose: null,
			milligrams: 20,
			name: "Lidocaine 2%"
		},
		lidocaine2epi: {
			toxicDose: 7,
			givenDose: null,
			milligrams: 20,
			name: "Lidocaine 2% with epinephrine"
		},
		bupivacaine025: {
			toxicDose: 2.5,
			givenDose: null,
			milligrams: 2.5,
			name: "Bupivacaine 0.25%"
		},
		bupivacaine05: {
			toxicDose: 2.5,
			givenDose: null,
			milligrams: 5,
			name: "Bupivacaine 0.5%"
		},
		ropi05: {
			toxicDose: 3,
			givenDose: null,
			milligrams: 5,
			name: "Ropivacaine 0.5%"
		},
	});

	function getPercentage(drugName: string): number {
		const drug = drugs[drugName];
		return (drug.givenDose || 0) * drug.milligrams / (kgs * drug.toxicDose);
	}

	let percentOfTotal = $derived(
		Object.keys(drugs).reduce((total, drugName) => {
			return total + getPercentage(drugName);
		}, 0)
	);

	function mLremaining(drugName: string): number {
		const fracLeft = 1 - percentOfTotal;
		const totalDoseLeft = fracLeft * (drugs[drugName].toxicDose * kgs);
		return Math.round(totalDoseLeft / drugs[drugName].milligrams);
	}

	let statusText = $derived(
		!kgs ? 'Please enter the patient weight' :
		Number.isNaN(percentOfTotal) || percentOfTotal === 0 ? 'Please enter some anesthetic given' :
		percentOfTotal > 1 ? 'You have exceeded the toxic dose of local anesthetic' :
		`You have used ${Math.round(percentOfTotal * 100)}% of the toxic dose of local anesthetic`
	);

</script>

<div class="flex flex-col items-center gap-6 pb-10">
	<h1 class="text-3xl font-bold text-foreground">Local Anesthetic Remaining Calculator</h1>

	<!-- Status Alert Card -->
	<Card.Root class="w-full max-w-2xl {percentOfTotal > 1 ? 'border-destructive bg-destructive/10' : ''}">
		<Card.Content class="pt-6 pb-6">
			<p class="text-center {percentOfTotal > 1 ? 'text-destructive' : 'text-foreground'}">{statusText}</p>
		</Card.Content>
	</Card.Root>

	<div class="flex w-full flex-col items-start justify-center gap-8 md:flex-row max-w-6xl">
		<!-- Patient Weight and Remaining Amounts -->
		<div class="w-full space-y-6">
			<!-- Patient Weight Input -->
			<Card.Root class="w-full">
				<Card.Header>
					<Card.Title>Patient Information</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="space-y-2">
						<label class="text-sm font-medium text-foreground">Patient weight (kg)</label>
						<Input 
							type="number" 
							bind:value={kgs}
							placeholder="Enter weight in kg"
							class="w-full"
						/>
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Remaining Amounts Table -->
			<Card.Root class="w-full">
				<Card.Header>
					<Card.Title class="text-center">How much local can you give?</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead class="min-w-0">Drug</TableHead>
									<TableHead class="text-right whitespace-nowrap">Amount remaining</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{#each Object.entries(drugs) as [drugName, drug]}
									<TableRow>
										<TableCell class="font-medium pr-2 min-w-0">
											<div class="break-words">{drug.name}</div>
										</TableCell>
										<TableCell class="text-right whitespace-nowrap pl-2">{mLremaining(drugName)} ml</TableCell>
									</TableRow>
								{/each}
							</TableBody>
						</Table>
					</div>
				</Card.Content>
			</Card.Root>
		</div>

		<!-- Given Doses -->
		<div class="w-full space-y-6">
			<Card.Root class="w-full">
				<Card.Header>
					<Card.Title class="text-center">How much local have you given?</Card.Title>
				</Card.Header>
				<Card.Content class="space-y-6">
					<div class="flex justify-center">
						<Dialog.Root >
              <Dialog.Trigger>
                <Button variant="outline" class="w-48">
                  Show Toxic Doses
                </Button>
              </Dialog.Trigger>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Toxic Doses</Dialog.Title>
                  <Dialog.Description>
                    This is the toxic dose of the local anesthetic.
                  </Dialog.Description>
                  <div class="space-y-4">
                    {#each Object.entries(drugs) as [drugName, drug]}
                      <div class="space-y-2">
                        <label class="text-sm font-medium text-foreground">{drug.name}</label>
                        <div class="flex items-center gap-2">
                          <Input 
                            type="number" 
                            bind:value={drug.toxicDose}
                            class="flex-1"
                          />
                          <span class="text-sm text-muted-foreground">mg/kg</span>
                        </div>
                      </div>
                    {/each}
                  </div>
                </Dialog.Header>
              </Dialog.Content>
            </Dialog.Root>
					</div>

					<div class="space-y-4">
						{#each Object.entries(drugs) as [drugName, drug]}
							<div class="space-y-2">
								<label class="text-sm font-medium text-foreground">{drug.name}</label>
								<div class="flex items-center gap-2">
									<Input 
										type="number" 
										bind:value={drug.givenDose}
										placeholder="0"
										class="flex-1"
									/>
									<span class="text-sm text-muted-foreground">ml</span>
								</div>
							</div>
						{/each}
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	</div>

	<!-- Toxic Doses Modal -->

</div>


<!-- 
<dialog bind:this={toxicDosesModal} class="backdrop:bg-black/50 rounded-lg border bg-card text-card-foreground shadow-lg max-w-md w-full">
  <div class="p-6 space-y-6">
    <h3 class="text-lg font-semibold text-center">Toxic Doses</h3>
    
    <div class="space-y-4">
      {#each Object.entries(drugs) as [drugName, drug]}
        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">{drug.name}</label>
          <div class="flex items-center gap-2">
            <Input 
              type="number" 
              bind:value={drug.toxicDose}
              class="flex-1"
            />
            <span class="text-sm text-muted-foreground">mg/kg</span>
          </div>
        </div>
      {/each}
    </div>

    <div class="flex justify-center">
      <Button onclick={() => toxicDosesModal.close()}>
        Close
      </Button>
    </div>
  </div>
</dialog> -->