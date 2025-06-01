import type { PageLoad } from './$types';

// Types for cocktail recipes
export interface RecipeIngredient {
    name: string;
    volume: number; // in oz
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
            { name: "Gin", volume: 1 },
            { name: "Sweet Vermouth", volume: 1 },
            { name: "Campari", volume: 1 }
        ]
    },
    {
        name: "Old Fashioned",
        ingredients: [
            { name: "Bourbon", volume: 2 },
            { name: "Simple Syrup", volume: 0.25 },
            { name: "Angostura Bitters", volume: 0.125 }
        ]
    },
    {
        name: "Margarita",
        ingredients: [
            { name: "Tequila", volume: 2 },
            { name: "Cointreau", volume: 1 },
            { name: "Lime Juice", volume: 1 }
        ]
    },
    {
        name: "Manhattan",
        ingredients: [
            { name: "Rye Whiskey", volume: 2 },
            { name: "Sweet Vermouth", volume: 1 },
            { name: "Angostura Bitters", volume: 0.125 }
        ]
    },
    {
        name: "Daiquiri",
        ingredients: [
            { name: "White Rum", volume: 2 },
            { name: "Lime Juice", volume: 1 },
            { name: "Simple Syrup", volume: 0.75 }
        ]
    },
    {
        name: "Whiskey Sour",
        ingredients: [
            { name: "Bourbon", volume: 2 },
            { name: "Lemon Juice", volume: 0.75 },
            { name: "Simple Syrup", volume: 0.75 }
        ]
    }
];

export const load = (async () => {
    return {
        cocktails
    };
}) satisfies PageLoad;