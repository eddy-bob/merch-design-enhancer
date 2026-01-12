/// <reference types="node" />

/**
 * Main entry point for the merch-design-enhancer package
 */

import {
  EnhanceImageOptions,
  EnhanceImageResult,
  MerchDesignEnhancerOptions,
  ProductType,
} from './types';
import { PromptBuilder } from './prompts/prompt-builder';
import { createAIProvider } from './providers/ai-provider';
import { normalizeImageInput, detectMimeType } from './utils/image-processor';

/**
 * Main class for enhancing product images into boutique-style mockups
 *
 * @example
 * ```typescript
 * import { MerchDesignEnhancer, ProductType } from 'merch-design-enhancer';
 * import fs from 'fs';
 *
 * const enhancer = new MerchDesignEnhancer({
 *   apiKey: 'your-api-key',
 *   provider: 'nanobanana' // Optional, defaults to 'nanobanana'
 * });
 *
 * const imageBuffer = fs.readFileSync('my-shirt.png');
 * const result = await enhancer.enhanceImage({
 *   image: imageBuffer,
 *   productType: ProductType.SHIRT,
 *   color: 'navy blue'
 * });
 *
 * fs.writeFileSync('enhanced.png', result.image);
 * ```
 */
export class MerchDesignEnhancer {
  private apiKey: string;
  private provider: 'nanobanana' | 'openai' | 'stability' | 'replicate';
  private aiProvider: ReturnType<typeof createAIProvider>;

  constructor(options: MerchDesignEnhancerOptions) {
    this.apiKey = options.apiKey;
    this.provider = options.provider || 'nanobanana';
    this.aiProvider = createAIProvider(this.provider);
  }

  /**
   * Enhances a product image by creating a boutique-style mockup
   * while preserving the original design
   *
   * @param options - Configuration options for image enhancement
   * @returns Enhanced image as Buffer with MIME type
   */
  async enhanceImage(
    options: EnhanceImageOptions,
  ): Promise<EnhanceImageResult> {
    const { image, productType, color } = options;

    // Normalize image input to Buffer
    const imageBuffer = await normalizeImageInput(image);

    // Build the prompt
    const prompt = PromptBuilder.buildPrompt(productType, color, true);

    // Generate enhanced image
    const enhancedImage = await this.aiProvider.generateImage(
      prompt,
      imageBuffer,
      {
        apiKey: this.apiKey,
      },
    );

    // Detect MIME type
    const mimeType = detectMimeType(enhancedImage);

    return {
      image: enhancedImage,
      mimeType,
    };
  }
}

// Export types and enums
export { ProductType } from './types';
export type {
  EnhanceImageOptions,
  EnhanceImageResult,
  MerchDesignEnhancerOptions,
} from './types';

// Export providers for advanced usage
export {
  createAIProvider,
  NanoBananaProvider,
  OpenAIProvider,
  StabilityAIProvider,
  ReplicateProvider,
} from './providers/ai-provider';
export type { AIProvider } from './providers/ai-provider';
