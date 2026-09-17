import type { PageLoad } from './$types';

// Types for cocktail recipes
export interface RecipeIngredient {
  name: string;
  volume: number; // in US fluid oz
  abv: number; // alcohol by volume as a percentage (40 means 40%); see ABV-SOURCES.md
}

export interface Cocktail {
  name: string;
  ingredients: RecipeIngredient[];
}

// Predefined cocktail recipes
const cocktails: Cocktail[] = [
  {
    name: "Negroni",
    ingredients: [
      { name: "Gin", volume: 1, abv: 40 },
      { name: "Sweet Vermouth", volume: 1, abv: 16 },
      { name: "Campari", volume: 1, abv: 24 }
    ]
  },
  {
    name: "Mezcal Negroni",
    ingredients: [
      { name: "Mezcal", volume: 1, abv: 40 },
      { name: "Sweet Vermouth", volume: 1, abv: 16 },
      { name: "Campari", volume: 1, abv: 24 }
    ]
  },
  {
    name: "Sidecar",
    ingredients: [
      { name: "Cognac", volume: 1.5, abv: 40 },
      { name: "Cointreau", volume: 0.75, abv: 40 },
      { name: "Lemon Juice", volume: 0.75, abv: 0 }
    ]
  },
  {
    name: "Old Fashioned",
    ingredients: [
      { name: "Bourbon", volume: 2, abv: 40 },
      { name: "Simple Syrup", volume: 0.25, abv: 0 },
      { name: "Angostura Bitters", volume: 0.125, abv: 44.7 }
    ]
  },
  {
    name: "Margarita",
    ingredients: [
      { name: "Tequila", volume: 2, abv: 40 },
      { name: "Cointreau", volume: 1, abv: 40 },
      { name: "Lime Juice", volume: 1, abv: 0 }
    ]
  },
  {
    name: "Manhattan",
    ingredients: [
      { name: "Rye Whiskey", volume: 2, abv: 40 },
      { name: "Sweet Vermouth", volume: 1, abv: 16 },
      { name: "Angostura Bitters", volume: 0.125, abv: 44.7 }
    ]
  },
  {
    name: "Whiskey Sour",
    ingredients: [
      { name: "Bourbon", volume: 2, abv: 40 },
      { name: "Lemon Juice", volume: 0.75, abv: 0 },
      { name: "Simple Syrup", volume: 0.75, abv: 0 }
    ]
  },
  {
    name: "Gin Gimlet",
    ingredients: [
      { name: "Gin", volume: 2, abv: 40 },
      { name: "Lime Juice", volume: 0.5, abv: 0 },
      { name: "Simple Syrup", volume: 0.5, abv: 0 }
    ]
  },
  {
    name: "Corpse Reviver #2",
    ingredients: [
      { name: "Gin", volume: 1, abv: 40 },
      { name: "Cointreau", volume: 1, abv: 40 },
      { name: "Lemon Juice", volume: 1, abv: 0 },
      { name: "Lillet Blanc", volume: 1, abv: 17 },
    ]
  },
  {
    name: "Paper Plane",
    ingredients: [
      { name: "Bourbon", volume: 0.75, abv: 40 },
      { name: "Aperol", volume: 0.75, abv: 11 },
      { name: "Amaro Nonino", volume: 0.75, abv: 35 },
      { name: "Lemon Juice", volume: 0.75, abv: 0 }
    ]
  },
  {
    name: "The Last Word",
    ingredients: [
      { name: "Gin", volume: 0.75, abv: 40 },
      { name: "Green Chartreuse", volume: 0.75, abv: 55 },
      { name: "Maraschino Liqueur", volume: 0.75, abv: 32 },
      { name: "Lime Juice", volume: 0.75, abv: 0 }
    ]
  },
  {
    name: "Martinez",
    ingredients: [
      { name: "Gin", volume: 1.5, abv: 40 },
      { name: "Sweet Vermouth", volume: 1.5, abv: 16 },
      { name: "Maraschino Liqueur", volume: 0.25, abv: 32 },
      { name: "Orange Bitters", volume: 0.125, abv: 28 }
    ]
  }
];

export const load = (async () => {
  return {
    cocktails
  };
}) satisfies PageLoad;
