# Recipe alcohol assumptions

Checked September 17, 2026. `abv` in the recipe model is a percentage, not a fraction.
These are estimates for the listed ingredients, before any dilution from ice.
Generic ingredient names use the representative strengths below; actual bottles can differ.
Juice and simple syrup are treated as nonalcoholic (0%).

| Ingredient | ABV | Source / assumption |
| --- | --- | --- |
| Gin, cognac, bourbon, tequila, rye whiskey | 40% | Generic 80-proof assumption, consistent with [NIAAA's spirit examples](https://www.niaaa.nih.gov/alcohols-effects-health/what-standard-drink) |
| Mezcal | 40% | Representative Unión Uno strength from its [distributor catalog](https://bbctri.com/assets/CT_flipbook_Mar2024.pdf) |
| Sweet vermouth | 16% | [Dolin Rouge](https://www.dolin.fr/en/products/red-vermouth/) |
| Campari | 24% | [Campari US](https://www.campari.com/en-us/our-products/) (strength varies by market) |
| Cointreau | 40% | [Cointreau US FAQ](https://www.cointreau.com/us/en/faq) |
| Angostura bitters | 44.7% | Bottle label in [Angostura's annual report](https://www.angostura.com/wp-content/uploads/2022/06/2021-Annual-Report-of-AHL.pdf) |
| Lillet Blanc | 17% | [Lillet](https://www.lillet.com/de-de/produkte/lillet-blanc/) |
| Aperol | 11% | [Aperol US FAQ](https://www.aperol.com/en-us/faq/) |
| Amaro Nonino | 35% | [Nonino Quintessentia product sheet](https://www.grappanonino.it/app/uploads/2016/12/AmaroNoninoQuintessentia_ING3.pdf) |
| Green Chartreuse | 55% | [Chartreuse](https://www.chartreuse.fr/produit/chartreuse-verte/) |
| Maraschino liqueur | 32% | [Luxardo Maraschino Originale](https://www.luxardo.it/it/liquori-e-distillati/maraschino-originale/) |
| Orange bitters | 28% | Assumes Angostura orange bitters, listed by [Virginia ABC](https://www.abc.virginia.gov/products/cordials/angostura-orange-bitters) |

Total volume is the sum of ingredient volumes times the recipe multiplier.
Pure alcohol volume is the sum of each ingredient volume times its ABV fraction,
also scaled by the multiplier. Mixed ABV is pure alcohol volume / total volume × 100.
US standard drinks = pure alcohol in US fl oz / 0.6, following [NIAAA](https://www.niaaa.nih.gov/alcohols-effects-health/what-standard-drink)
(approximately 14 g per standard drink). One US fl oz = 29.5735295625 ml.
Only display values are rounded. Custom recipes omit the summary because their
ingredient alcohol strengths are unknown.
