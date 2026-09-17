import type { RecipeIngredient } from './+page';

const ML_PER_US_FL_OZ = 29.5735295625;
// NIAAA: https://www.niaaa.nih.gov/alcohols-effects-health/what-standard-drink
const ALCOHOL_OZ_PER_STANDARD_DRINK = 0.6;

export function calculateTotals(ingredients: RecipeIngredient[], multiplier: number) {
  const volumeOz = ingredients.reduce((sum, ingredient) => sum + ingredient.volume, 0) * multiplier;
  const alcoholOz = ingredients.reduce(
    (sum, ingredient) => sum + ingredient.volume * ingredient.abv / 100, 0
  ) * multiplier;

  return {
    volumeOz,
    volumeMl: volumeOz * ML_PER_US_FL_OZ,
    standardDrinks: alcoholOz / ALCOHOL_OZ_PER_STANDARD_DRINK,
    abv: volumeOz > 0 ? alcoholOz / volumeOz * 100 : 0
  };
}
