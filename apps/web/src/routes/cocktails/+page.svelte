<script lang="ts">
    import type { PageData } from './$types';
    import { calculateTotals } from './totals';
    import { formatPours } from './measurements';
    import { Input } from "$lib/components/ui/input";
    import * as Select from "$lib/components/ui/select/index.js";
    import { Button } from "$lib/components/ui/button";
    import AmountInput from "./AmountInput.svelte";
    import { untrack } from "svelte";

    // Types
    interface Ingredient {
        id: number;
        name: string;
        amount: number;
        unit: Unit;
    }

    type Unit = 'oz' | 'tbsp' | 'tsp' | 'ml' | 'cups';

    // Props
    let { data }: { data: PageData } = $props();

    // Reactive state
    let multiplier: number = $state(1.5);

    let outputUnit: string = $state('mixed');
    let selectedCocktail: string = $state(untrack(() => data.cocktails?.[0]?.name || ''));
    let customIngredients: Ingredient[] = $state([
        { id: 1, name: '', amount: 1, unit: 'oz' }
    ]);
    let nextId: number = 2;

    // Conversion rates to fluid ounces
    const conversions: Record<Unit, number> = {
        oz: 1,
        tbsp: 0.5,        // 1 tbsp = 0.5 oz
        tsp: 1 / 6,    // 1 tsp = 1/6 oz
        ml: 1 / 29.5735295625,     // 1 ml = 0.033814 oz
        cups: 8           // 1 cup = 8 oz
    };

    // Conversion rates from fluid ounces
    const fromOz: Record<Unit, number> = {
        oz: 1,
        tbsp: 2,          // 1 oz = 2 tbsp
        tsp: 6,           // 1 oz = 6 tsp
        ml: 29.5735295625,      // 1 oz = 29.5735 ml
        cups: 0.125       // 1 oz = 0.125 cups
    };

    function convertAmount(amount: number, fromUnit: Unit, toUnit: Unit): number {
        // Convert to oz first, then to target unit
        const amountInOz = amount * conversions[fromUnit];
        return amountInOz * fromOz[toUnit];
    }

    function formatAmount(amount: number): string | number {
        if (amount < 0.01) return amount.toFixed(4);
        if (amount < 0.1) return amount.toFixed(3);
        if (amount < 1) return amount.toFixed(2);
        if (amount < 10) return amount.toFixed(1);
        return Math.round(amount * 4) / 4; // Round to nearest quarter
    }

    // Derive ingredients from selected cocktail or use custom ingredients
    const ingredients = $derived((() => {
        if (selectedCocktail && selectedCocktail !== '') {
            const cocktail = data.cocktails.find(c => c.name === selectedCocktail);
            if (cocktail) {
                return cocktail.ingredients.map((ing, index) => ({
                    id: index + 1,
                    name: ing.name,
                    amount: ing.volume,
                    unit: 'oz' as Unit
                }));
            }
        }
        return customIngredients;
    })());

    const selectedRecipe = $derived(data.cocktails.find(c => c.name === selectedCocktail));
    const totals = $derived(selectedRecipe ? calculateTotals(selectedRecipe.ingredients, multiplier) : null);

    // Simplified calculation logic - derived from key states: amount, unit, scale (multiplier), and convert (outputUnit)
    const convertedIngredients = $derived(
        ingredients.map(ingredient => {
            const scaledAmount = ingredient.amount * multiplier;
            const formattedAmount = outputUnit === 'mixed'
                ? formatPours(convertAmount(scaledAmount, ingredient.unit, 'oz'))
                : `${formatAmount(convertAmount(scaledAmount, ingredient.unit, outputUnit as Unit))} ${outputUnit}`;
            
            return {
                ...ingredient,
                convertedAmount: formattedAmount
            };
        })
    );

    function addIngredient(): void {
        // Convert to custom mode if modifying a preset recipe
        if (selectedCocktail) {
            // Ensure nextId is higher than any existing ingredient ID
            const maxId = Math.max(...ingredients.map(ing => ing.id));
            nextId = Math.max(nextId, maxId + 1);
            
            customIngredients = [...ingredients, {
                id: nextId++,
                name: '',
                amount: 1,
                unit: 'oz'
            }];
            selectedCocktail = '';
        } else {
            customIngredients = [...customIngredients, {
                id: nextId++,
                name: '',
                amount: 1,
                unit: 'oz'
            }];
        }
    }

    function removeIngredient(id: number): void {
        // Convert to custom mode if modifying a preset recipe
        if (selectedCocktail) {
            customIngredients = ingredients.filter(ingredient => ingredient.id !== id);
            selectedCocktail = '';
        } else {
            customIngredients = customIngredients.filter(ingredient => ingredient.id !== id);
        }
    }

    function updateIngredient(id: number, field: keyof Ingredient, value: string | number): void {
        // Convert to custom mode if modifying a preset recipe
        if (selectedCocktail) {
            customIngredients = ingredients.map(ingredient => 
                ingredient.id === id 
                    ? { ...ingredient, [field]: value }
                    : ingredient
            );
            selectedCocktail = '';
        } else {
            customIngredients = customIngredients.map(ingredient => 
                ingredient.id === id 
                    ? { ...ingredient, [field]: value }
                    : ingredient
            );
        }
    }

    function loadCocktail(cocktailName: string): void {
        // No longer needed - ingredients are derived from selectedCocktail
    }

    function clearRecipe(): void {
        selectedCocktail = '';
        customIngredients = [{
            id: nextId++,
            name: '',
            amount: 1,
            unit: 'oz'
        }];
    }

    // Load the first cocktail on mount if available
    $effect(() => {
        if (selectedCocktail && data.cocktails?.length > 0) {
            loadCocktail(selectedCocktail);
        }
    });
</script>

    <h1 class="text-3xl font-bold text-center mb-8">Cocktail Recipe Converter</h1>
    
    <form class="space-y-6">
        <!-- Recipe Selection -->
         <div class='flex flex-row gap-4 w-full'>
        <div class="space-y-2">
            <label for="recipe-select" class="block text-sm font-medium">Select Recipe</label>
            <Select.Root type="single" bind:value={selectedCocktail}>
                <Select.Trigger id="recipe-select" class="w-full">
                    <span>{selectedCocktail || "Custom Recipe"}</span>
                </Select.Trigger>
                <Select.Content>
                    <Select.Item value="">Custom Recipe</Select.Item>
                    {#each data.cocktails as cocktail}
                        <Select.Item value={cocktail.name}>{cocktail.name}</Select.Item>
                    {/each}
                </Select.Content>
            </Select.Root>
        </div>

        <!-- Controls -->
        <div class="grid grid-cols-2 gap-4 w-full">
            <div class="space-y-2">
                <label for="scale-recipe" class="block text-sm font-medium">Scale Recipe</label>
                <AmountInput
                    id="scale-recipe"
                    value={multiplier}
                    min={0.1}
                    fallback={1}
                    onCommit={(v) => (multiplier = v)}
                    class="w-full"
                />
            </div>
            
            <div class="space-y-2">
                <label for="output-unit" class="block text-sm font-medium">Convert to</label>
                <Select.Root type="single" bind:value={outputUnit}>
                    <Select.Trigger id="output-unit" class="w-full">
                        <span>{
                            outputUnit === 'mixed' ? 'Jigger + spoons' :
                            outputUnit === 'oz' ? 'Fluid Ounces (oz)' :
                            outputUnit === 'tbsp' ? 'Tablespoons (tbsp)' :
                            outputUnit === 'tsp' ? 'Teaspoons (tsp)' :
                            outputUnit === 'ml' ? 'Milliliters (ml)' :
                            outputUnit === 'cups' ? 'Cups' : outputUnit
                        }</span>
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Item value="mixed">Jigger + spoons</Select.Item>
                        <Select.Item value="oz">Fluid Ounces (oz)</Select.Item>
                        <Select.Item value="tbsp">Tablespoons (tbsp)</Select.Item>
                        <Select.Item value="tsp">Teaspoons (tsp)</Select.Item>
                        <Select.Item value="ml">Milliliters (ml)</Select.Item>
                        <Select.Item value="cups">Cups</Select.Item>
                    </Select.Content>
                </Select.Root>
            </div>
        </div>
        </div>

        <!-- Ingredients -->
        <div class="space-y-4">
            <h3 class="text-lg font-semibold">Ingredients</h3>
            {#if outputUnit === 'mixed'}
                <p class="text-sm text-muted-foreground">
                    Whole ounces for your jiggers, then tablespoons and teaspoons.
                    ≈ means rounded to the nearest ¼ tsp; recipe totals use the exact amounts.
                </p>
            {/if}
            
            {#each convertedIngredients as ingredient (ingredient.id)}
                <div class="border rounded p-4">
                    <!-- Mobile layout: stacked -->
                    <div class="block sm:hidden space-y-3">
                        <div class="space-y-2">
                            <label for="m-name-{ingredient.id}" class="block text-sm font-medium">Ingredient Name</label>
                            <Input 
                                id="m-name-{ingredient.id}"
                                type="text" 
                                placeholder="Enter ingredient name" 
                                value={ingredient.name}
                                oninput={(e) => updateIngredient(ingredient.id, 'name', (e.target as HTMLInputElement).value)}
                                class="w-full"
                            />
                        </div>
                        
                        <div class="grid grid-cols-3 gap-3">
                            <div class="space-y-2">
                                <label for="m-amount-{ingredient.id}" class="block text-sm font-medium">Amount</label>
                                <AmountInput
                                    id="m-amount-{ingredient.id}"
                                    value={ingredient.amount}
                                    min={0}
                                    fallback={0}
                                    onCommit={(v) => updateIngredient(ingredient.id, 'amount', v)}
                                    class="w-full"
                                />
                            </div>
                            
                            <div class="space-y-2">
                                <label for="m-unit-{ingredient.id}" class="block text-sm font-medium">Unit</label>
                                <Select.Root type="single" value={ingredient.unit} onValueChange={(value) => updateIngredient(ingredient.id, 'unit', value as Unit)}>
                                    <Select.Trigger id="m-unit-{ingredient.id}" class="w-full">
                                        <span>{ingredient.unit}</span>
                                    </Select.Trigger>
                                    <Select.Content>
                                        <Select.Item value="oz">oz</Select.Item>
                                        <Select.Item value="tbsp">tbsp</Select.Item>
                                        <Select.Item value="tsp">tsp</Select.Item>
                                        <Select.Item value="ml">ml</Select.Item>
                                        <Select.Item value="cups">cups</Select.Item>
                                    </Select.Content>
                                </Select.Root>
                            </div>
                            
                            <div class="space-y-2">
                                <span id="m-converted-{ingredient.id}" class="block text-sm font-medium">Converted</span>
                                <div aria-labelledby="m-converted-{ingredient.id}" class="px-3 py-2 bg-muted rounded border text-center font-semibold text-sm">
                                    {ingredient.convertedAmount}
                                </div>
                            </div>
                        </div>
                        
                        {#if ingredients.length > 1}
                            <Button 
                                type="button"
                                variant="destructive" 
                                size="sm"
                                onclick={() => removeIngredient(ingredient.id)}
                                class="w-full"
                            >
                                Remove
                            </Button>
                        {/if}
                    </div>
                    
                    <!-- Desktop layout: horizontal -->
                    <div class="hidden sm:grid grid-cols-12 gap-3 items-end">
                        <div class="col-span-4 space-y-2">
                            <label for="d-name-{ingredient.id}" class="block text-sm font-medium">Ingredient Name</label>
                            <Input 
                                id="d-name-{ingredient.id}"
                                type="text" 
                                placeholder="Enter ingredient name" 
                                value={ingredient.name}
                                oninput={(e) => updateIngredient(ingredient.id, 'name', (e.target as HTMLInputElement).value)}
                                class="w-full"
                            />
                        </div>
                        
                        <div class="col-span-2 space-y-2">
                            <label for="d-amount-{ingredient.id}" class="block text-sm font-medium">Amount</label>
                            <AmountInput
                                id="d-amount-{ingredient.id}"
                                value={ingredient.amount}
                                min={0}
                                fallback={0}
                                onCommit={(v) => updateIngredient(ingredient.id, 'amount', v)}
                                class="w-full"
                            />
                        </div>
                        
                        <div class="col-span-2 space-y-2">
                            <label for="d-unit-{ingredient.id}" class="block text-sm font-medium">Unit</label>
                            <Select.Root type="single" value={ingredient.unit} onValueChange={(value) => updateIngredient(ingredient.id, 'unit', value as Unit)}>
                                <Select.Trigger id="d-unit-{ingredient.id}" class="w-full">
                                    <span>{ingredient.unit}</span>
                                </Select.Trigger>
                                <Select.Content>
                                    <Select.Item value="oz">oz</Select.Item>
                                    <Select.Item value="tbsp">tbsp</Select.Item>
                                    <Select.Item value="tsp">tsp</Select.Item>
                                    <Select.Item value="ml">ml</Select.Item>
                                    <Select.Item value="cups">cups</Select.Item>
                                </Select.Content>
                            </Select.Root>
                        </div>
                        
                        <div class="col-span-2 space-y-2">
                            <span id="d-converted-{ingredient.id}" class="block text-sm font-medium">Converted</span>
                            <div aria-labelledby="d-converted-{ingredient.id}" class="px-3 py-2 bg-muted rounded border text-center font-semibold">
                                {ingredient.convertedAmount}
                            </div>
                        </div>
                        
                        <div class="col-span-2">
                            {#if ingredients.length > 1}
                                <Button 
                                    type="button"
                                    variant="destructive" 
                                    size="sm"
                                    onclick={() => removeIngredient(ingredient.id)}
                                    class="w-full"
                                >
                                    Remove
                                </Button>
                            {/if}
                        </div>
                    </div>
                </div>
            {/each}
        </div>
        
        <!-- Form Actions -->
        <div class="flex gap-3">
            <Button type="button" onclick={addIngredient} class="flex-1">
                Add Ingredient
            </Button>
            <Button type="button" variant="outline" onclick={clearRecipe}>
                Clear Recipe
            </Button>
        </div>
        
        {#if totals}
            <section aria-label="Recipe totals" aria-live="polite" class="border-t pt-4 space-y-3">
                <h3 class="text-lg font-semibold">Recipe totals</h3>
                <dl class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <dt class="text-sm text-muted-foreground">Total volume</dt>
                        <dd class="font-semibold">{totals.volumeMl.toFixed(1)} ml / {totals.volumeOz.toFixed(2)} oz</dd>
                    </div>
                    <div>
                        <dt class="text-sm text-muted-foreground">US standard drinks</dt>
                        <dd class="font-semibold">{totals.standardDrinks.toFixed(2)}</dd>
                    </div>
                    <div>
                        <dt class="text-sm text-muted-foreground">ABV before ice dilution</dt>
                        <dd class="font-semibold">{totals.abv.toFixed(1)}%</dd>
                    </div>
                </dl>
                <p class="text-xs text-muted-foreground">
                    Estimates for the entire scaled recipe, before ice dilution. Bottle strengths vary;
                    unbranded base spirits are assumed to be 40% ABV.
                    <a class="underline" href="https://www.niaaa.nih.gov/alcohols-effects-health/what-standard-drink">One US standard drink</a>
                    contains 0.6 fl oz (about 14 g) of pure alcohol.
                </p>
                <details class="text-xs text-muted-foreground">
                    <summary class="cursor-pointer">Ingredient ABV assumptions</summary>
                    <ul class="mt-2 space-y-1">
                        {#each selectedRecipe?.ingredients ?? [] as ingredient}
                            <li>{ingredient.name}: {ingredient.abv}% ABV</li>
                        {/each}
                    </ul>
                </details>
            </section>
        {/if}

        <!-- Reference -->
        <div class="text-center text-sm text-muted-foreground border-t pt-4">
            <p><strong>Quick Reference:</strong> 1 oz = 2 tbsp = 6 tsp = 29.57 ml = 0.125 cups</p>
        </div>
    </form>
