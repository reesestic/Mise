/**
 * TheMealDB API adapter.
 *
 * This uses TheMealDB's official V1 API and development key. Do not scrape
 * themealdb.com pages. The free key is for development/personal use; review
 * the provider's current terms before publishing an app or using paid data.
 */

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

type RawMeal = {
  idMeal?: string;
  strMeal?: string;
  strMealThumb?: string | null;
  strCategory?: string | null;
  strArea?: string | null;
  strInstructions?: string | null;
  strSource?: string | null;
  strYoutube?: string | null;
  [key: string]: unknown;
};

type ApiResponse = {
  meals?: RawMeal[] | null;
};

export type RecipeIngredient = {
  name: string;
  measure: string;
};

export type MealDbMeal = {
  id: string;
  name: string;
  thumbnailUrl: string | null;
  category: string | null;
  cuisine: string | null;
  instructions: string[];
  ingredients: RecipeIngredient[];
  sourceUrl: string | null;
  videoUrl: string | null;
  attribution: 'TheMealDB';
};

export class MealDbError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MealDbError';
  }
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function mapMeal(raw: RawMeal): MealDbMeal | null {
  const id = asString(raw.idMeal);
  const name = asString(raw.strMeal);
  if (!id || !name) return null;

  const ingredients: RecipeIngredient[] = [];
  for (let index = 1; index <= 20; index += 1) {
    const ingredient = asString(raw[`strIngredient${index}`]);
    if (!ingredient) continue;
    ingredients.push({
      name: ingredient,
      measure: asString(raw[`strMeasure${index}`]) ?? '',
    });
  }

  const instructions = (asString(raw.strInstructions) ?? '')
    .split(/\r?\n+/)
    .map((step) => step.trim())
    .filter(Boolean);

  return {
    id,
    name,
    thumbnailUrl: asString(raw.strMealThumb),
    category: asString(raw.strCategory),
    cuisine: asString(raw.strArea),
    instructions,
    ingredients,
    sourceUrl: asString(raw.strSource),
    videoUrl: asString(raw.strYoutube),
    attribution: 'TheMealDB',
  };
}

async function requestMeals(params: Record<string, string>): Promise<MealDbMeal[]> {
  const url = new URL(`${API_BASE_URL}/search.php`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

  let response: Response;
  try {
    response = await fetch(url.toString());
  } catch {
    throw new MealDbError('Could not reach TheMealDB. Check your internet connection and try again.');
  }

  if (!response.ok) {
    throw new MealDbError(`TheMealDB returned an error (${response.status}). Please try again.`);
  }

  const payload = (await response.json()) as ApiResponse;
  return (payload.meals ?? []).map(mapMeal).filter((meal): meal is MealDbMeal => meal !== null);
}

export async function searchMeals(query: string): Promise<MealDbMeal[]> {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return [];
  return requestMeals({ s: trimmedQuery });
}

export async function getMealById(id: string): Promise<MealDbMeal | null> {
  const trimmedId = id.trim();
  if (!trimmedId) return null;
  const url = new URL(`${API_BASE_URL}/lookup.php`);
  url.searchParams.set('i', trimmedId);

  let response: Response;
  try {
    response = await fetch(url.toString());
  } catch {
    throw new MealDbError('Could not reach TheMealDB. Check your internet connection and try again.');
  }

  if (!response.ok) {
    throw new MealDbError(`TheMealDB returned an error (${response.status}). Please try again.`);
  }

  const payload = (await response.json()) as ApiResponse;
  const rawMeal = payload.meals?.[0];
  return rawMeal ? mapMeal(rawMeal) : null;
}
