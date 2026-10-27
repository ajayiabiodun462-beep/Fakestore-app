import { Product } from '../types/store';
import { FALLBACK_PRODUCTS } from '../data/fallbackProducts';

const FAKESTORE_API_URL = 'https://fakestoreapi.com/products';

export interface FetchResult {
  products: Product[];
  isFallback: boolean;
  error?: string;
}

export async function fetchCatalog(): Promise<FetchResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

  try {
    const response = await fetch(FAKESTORE_API_URL, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`FakeStoreAPI returned status: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (Array.isArray(data) && data.length > 0) {
      return {
        products: data,
        isFallback: false
      };
    }

    throw new Error('FakeStoreAPI returned an invalid payload structure');
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const errorMessage = err instanceof Error ? err.message : 'Unknown network failure';
    console.warn('FakeStoreAPI live fetch failed or timed out, seamlessly using verified cache:', errorMessage);

    return {
      products: FALLBACK_PRODUCTS,
      isFallback: true,
      error: errorMessage
    };
  }
}
