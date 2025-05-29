<script lang="ts">
    import type { PageData } from './$types';
    import type { Cocktail } from './+page';

    // Types
    interface Ingredient {
        id: number;
        name: string;
        amount: number;
        unit: string;
    }

    type Unit = 'oz' | 'tbsp' | 'tsp' | 'ml' | 'cups';

    // Props
    let { data }: { data: PageData } = $props();

    // Reactive state
    let multiplier: number = $state(1);
    let outputUnit: Unit = $state('oz');
    let selectedCocktail: string = $state('');
    let ingredients: Ingredient[] = $state([
        { id: 1, name: 'Tequila', amount: 3, unit: 'oz' },
        { id: 2, name: 'Vermouth', amount: 2, unit: 'oz' },
        { id: 3, name: 'Campari', amount: 1, unit: 'oz' }
    ]);
    let nextId: number = 4;

    // Conversion rates to fluid ounces
    const conversions: Record<Unit, number> = {
        oz: 1,
        tbsp: 0.5,        // 1 tbsp = 0.5 oz
        tsp: 0.166667,    // 1 tsp = 1/6 oz
        ml: 0.033814,     // 1 ml = 0.033814 oz
        cups: 8           // 1 cup = 8 oz
    };

    // Conversion rates from fluid ounces
    const fromOz: Record<Unit, number> = {
        oz: 1,
        tbsp: 2,          // 1 oz = 2 tbsp
        tsp: 6,           // 1 oz = 6 tsp
        ml: 29.5735,      // 1 oz = 29.5735 ml
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

    function addIngredient(): void {
        ingredients = [...ingredients, {
            id: nextId++,
            name: '',
            amount: 1,
            unit: 'oz'
        }];
    }

    function removeIngredient(id: number): void {
        ingredients = ingredients.filter(ingredient => ingredient.id !== id);
    }

    function updateIngredient(id: number, field: keyof Ingredient, value: string | number): void {
        ingredients = ingredients.map(ingredient => 
            ingredient.id === id 
                ? { ...ingredient, [field]: value }
                : ingredient
        );
    }

    function loadCocktail(cocktailName: string): void {
        const cocktail = data.cocktails.find(c => c.name === cocktailName);
        if (cocktail) {
            nextId = 1;
            ingredients = cocktail.ingredients.map(ing => ({
                id: nextId++,
                name: ing.name,
                amount: ing.volume,
                unit: 'oz'
            }));
        }
    }

    function clearRecipe(): void {
        selectedCocktail = '';
        ingredients = [{
            id: nextId++,
            name: '',
            amount: 1,
            unit: 'oz'
        }];
    }

    // Reactive computation for converted amounts
    const convertedIngredients = $derived(ingredients.map(ingredient => {
        if (ingredient.amount > 0) {
            const scaledAmount = ingredient.amount * multiplier;
            const convertedAmount = convertAmount(scaledAmount, ingredient.unit as Unit, outputUnit);
            const formatted = formatAmount(convertedAmount);
            return { ...ingredient, convertedAmount: formatted };
        }
        return { ...ingredient, convertedAmount: 0 };
    }));
</script>

<div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
    <div class="container mx-auto max-w-5xl p-6">
        <!-- Header -->
        <div class="text-center mb-10">
            <h1 class="text-5xl font-bold text-white mb-4 drop-shadow-lg">
                🍸 Cocktail Recipe Converter
            </h1>
            <p class="text-purple-200 text-lg">Mix, measure, and scale your perfect cocktails</p>
        </div>
        
        <!-- Main Card -->
        <div class="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
            <div class="p-8">
                <!-- Cocktail Selection Section -->
                <div class="bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-sm border border-white/30 rounded-2xl p-6 mb-8">
                    <h2 class="text-2xl font-semibold text-white mb-4 text-center">🍹 Choose Your Recipe</h2>
                    <div class="flex flex-wrap gap-4 justify-center items-center">
                        <div class="form-control">
                            <select 
                                id="cocktailSelect" 
                                class="select select-lg bg-white/20 border-white/30 text-white placeholder-white/70 focus:border-pink-400 focus:bg-white/30 w-64" 
                                bind:value={selectedCocktail}
                                onchange={() => selectedCocktail && loadCocktail(selectedCocktail)}
                            >
                                <option value="" class="bg-gray-800 text-white">🎨 Custom Recipe</option>
                                {#each data.cocktails as cocktail}
                                    <option value={cocktail.name} class="bg-gray-800 text-white">
                                        🍸 {cocktail.name}
                                    </option>
                                {/each}
                            </select>
                        </div>
                        <button 
                            class="btn bg-gradient-to-r from-red-500 to-pink-500 border-none text-white hover:from-red-600 hover:to-pink-600 shadow-lg" 
                            onclick={clearRecipe}
                        >
                            🗑️ Clear Recipe
                        </button>
                    </div>
                </div>

                <!-- Controls Section -->
                <div class="flex flex-wrap gap-8 justify-center items-center mb-8 p-6 bg-white/5 rounded-2xl border border-white/10">
                    <div class="form-control">
                        <label class="label" for="multiplier">
                            <span class="label-text font-semibold text-white text-lg">📏 Scale Recipe:</span>
                        </label>
                        <div class="flex items-center gap-3">
                            <input 
                                type="number" 
                                id="multiplier" 
                                class="input input-lg bg-white/20 border-white/30 text-white placeholder-white/50 focus:border-blue-400 focus:bg-white/30 w-28 text-center font-bold"
                                bind:value={multiplier}
                                min="0.1" 
                                max="10" 
                                step="0.1"
                            />
                            <span class="text-2xl text-yellow-300">×</span>
                        </div>
                    </div>
                    
                    <div class="form-control">
                        <label class="label" for="outputUnit">
                            <span class="label-text font-semibold text-white text-lg">🔄 Convert to:</span>
                        </label>
                        <select 
                            id="outputUnit" 
                            class="select select-lg bg-white/20 border-white/30 text-white focus:border-blue-400 focus:bg-white/30" 
                            bind:value={outputUnit}
                        >
                            <option value="oz" class="bg-gray-800">Fluid Ounces (oz)</option>
                            <option value="tbsp" class="bg-gray-800">Tablespoons (tbsp)</option>
                            <option value="tsp" class="bg-gray-800">Teaspoons (tsp)</option>
                            <option value="ml" class="bg-gray-800">Milliliters (ml)</option>
                            <option value="cups" class="bg-gray-800">Cups</option>
                        </select>
                    </div>
                </div>
                
                <!-- Ingredients Section -->
                <div class="space-y-4 mb-8">
                    <h3 class="text-2xl font-semibold text-white text-center mb-6">🧪 Ingredients</h3>
                    {#each convertedIngredients as ingredient (ingredient.id)}
                        <div class="bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/30">
                            <div class="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                                <!-- Ingredient Name -->
                                <div class="form-control">
                                    <input 
                                        type="text" 
                                        placeholder="🥃 Ingredient name" 
                                        class="input input-lg bg-white/20 border-white/30 text-white placeholder-white/60 focus:border-green-400 focus:bg-white/30"
                                        value={ingredient.name}
                                        oninput={(e) => updateIngredient(ingredient.id, 'name', (e.target as HTMLInputElement).value)}
                                    />
                                </div>
                                
                                <!-- Amount -->
                                <div class="form-control">
                                    <input 
                                        type="number" 
                                        step="0.25" 
                                        min="0"
                                        class="input input-lg bg-white/20 border-white/30 text-white text-center font-bold focus:border-green-400 focus:bg-white/30"
                                        value={ingredient.amount}
                                        oninput={(e) => updateIngredient(ingredient.id, 'amount', parseFloat((e.target as HTMLInputElement).value) || 0)}
                                    />
                                </div>
                                
                                <!-- Unit -->
                                <div class="form-control">
                                    <select 
                                        class="select select-lg bg-white/20 border-white/30 text-white focus:border-green-400 focus:bg-white/30" 
                                        value={ingredient.unit}
                                        onchange={(e) => updateIngredient(ingredient.id, 'unit', (e.target as HTMLSelectElement).value)}
                                    >
                                        <option value="oz" class="bg-gray-800">oz</option>
                                        <option value="tbsp" class="bg-gray-800">tbsp</option>
                                        <option value="tsp" class="bg-gray-800">tsp</option>
                                        <option value="ml" class="bg-gray-800">ml</option>
                                        <option value="cups" class="bg-gray-800">cups</option>
                                    </select>
                                </div>
                                
                                <!-- Equals Symbol -->
                                <div class="flex items-center justify-center">
                                    <div class="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center shadow-lg">
                                        <span class="text-2xl font-bold text-white">=</span>
                                    </div>
                                </div>
                                
                                <!-- Converted Amount -->
                                <div class="flex justify-center">
                                    <div class="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full shadow-lg font-bold text-lg min-w-[120px] text-center">
                                        {ingredient.convertedAmount} {outputUnit}
                                    </div>
                                </div>
                                
                                <!-- Remove Button -->
                                {#if ingredients.length > 1}
                                    <div class="flex justify-center">
                                        <button 
                                            class="btn btn-circle bg-gradient-to-r from-red-500 to-pink-500 border-none text-white hover:from-red-600 hover:to-pink-600 shadow-lg" 
                                            onclick={() => removeIngredient(ingredient.id)}
                                            title="Remove ingredient"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
                
                <!-- Add Ingredient Button -->
                <div class="text-center">
                    <button 
                        class="btn btn-lg bg-gradient-to-r from-green-500 to-emerald-500 border-none text-white hover:from-green-600 hover:to-emerald-600 shadow-xl" 
                        onclick={addIngredient}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Ingredient
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="text-center text-white/70 text-sm mt-8 p-4 bg-white/5 rounded-2xl backdrop-blur-sm">
            <p class="font-medium">📐 Quick Reference:</p>
            <p>1 oz = 2 tbsp = 6 tsp = 29.57 ml = 0.125 cups</p>
        </div>
    </div>
</div>