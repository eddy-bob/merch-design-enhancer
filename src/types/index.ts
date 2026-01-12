import { ProductType } from './product-type';

/// <reference types="node" />

export * from './product-type';

export interface MerchDesignEnhancerOptions {
  /** AI provider API key */
  apiKey: string;
  /** AI provider to use (defaults to 'nanobanana') */
  provider?: 'nanobanana' | 'openai' | 'stability' | 'replicate';
}

export interface EnhanceImageOptions {
  /** Image input - can be a Buffer, base64 string, or file path */
  image: Buffer | string;
  /** Product type from the ProductType enum */
  productType: ProductType;
  /** Optional color to transform the item (hex code, RGB, or color name) */
  color?: string;
}

export interface EnhanceImageResult {
  /** Enhanced image as Buffer */
  image: Buffer;
  /** MIME type of the image */
  mimeType: string;
}
