/// <reference types="node" />

import { EnhanceImageOptions, EnhanceImageResult } from '../types';
import { PromptBuilder } from '../prompts/prompt-builder';

/**
 * Base interface for AI providers
 */
export interface AIProvider {
  generateImage(
    prompt: string,
    referenceImage: Buffer,
    options?: { apiKey?: string },
  ): Promise<Buffer>;
}

/**
 * OpenAI DALL-E provider
 * Note: DALL-E 3 doesn't support direct image-to-image transformation.
 * This implementation uses GPT-4 Vision to analyze the design, then generates
 * a new image with the enhanced prompt that includes design details.
 */
export class OpenAIProvider implements AIProvider {
  async generateImage(
    prompt: string,
    referenceImage: Buffer,
    options: { apiKey: string },
  ): Promise<Buffer> {
    const apiKey = options.apiKey;
    if (!apiKey) {
      throw new Error(
        'OpenAI API key is required. Set OPENAI_API_KEY environment variable or pass apiKey in options.',
      );
    }

    // Convert image to base64
    const base64Image = referenceImage.toString('base64');
    const mimeType = 'image/png'; // Default, could be detected

    // First, use GPT-4 Vision to analyze the design on the product
    const visionResponse = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4-vision-preview',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Describe in detail the design, graphics, text, colors, and any visual elements visible on this product. Be very specific about what is printed or displayed on the product itself. Focus only on the design elements, not the product type or background.',
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:${mimeType};base64,${base64Image}`,
                  },
                },
              ],
            },
          ],
          max_tokens: 300,
        }),
      },
    );

    if (!visionResponse.ok) {
      const error = await visionResponse
        .json()
        .catch(() => ({ error: 'Unknown error' }));
      throw new Error(`OpenAI Vision API error: ${JSON.stringify(error)}`);
    }

    const visionData = (await visionResponse.json()) as {
      choices: Array<{
        message: {
          content: string;
        };
      }>;
    };
    const designDescription = visionData.choices[0].message.content;

    // Enhance the prompt with the design description to ensure it's preserved
    const enhancedPrompt = `${prompt}\n\nIMPORTANT: The product must have the following design elements exactly as described: ${designDescription}. These design elements must be preserved exactly - do not alter, modify, or change them in any way.`;

    // Generate the enhanced image using DALL-E 3
    const imageResponse = await fetch(
      'https://api.openai.com/v1/images/generations',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: enhancedPrompt,
          n: 1,
          size: '1024x1024',
          response_format: 'b64_json',
          quality: 'hd',
        }),
      },
    );

    if (!imageResponse.ok) {
      const error = await imageResponse
        .json()
        .catch(() => ({ error: 'Unknown error' }));
      throw new Error(`OpenAI DALL-E API error: ${JSON.stringify(error)}`);
    }

    const imageData = (await imageResponse.json()) as {
      data: Array<{
        b64_json: string;
      }>;
    };
    const imageBase64 = imageData.data[0].b64_json;
    return Buffer.from(imageBase64, 'base64');
  }
}

/**
 * Stability AI provider
 */
export class StabilityAIProvider implements AIProvider {
  async generateImage(
    prompt: string,
    referenceImage: Buffer,
    options: { apiKey: string },
  ): Promise<Buffer> {
    const apiKey = options.apiKey;
    if (!apiKey) {
      throw new Error(
        'Stability AI API key is required. Set STABILITY_API_KEY environment variable or pass apiKey in options.',
      );
    }

    // Use FormData for multipart/form-data request
    // In Node.js 18+, FormData is available globally
    const formData = new FormData();

    // Create a Blob from the buffer for FormData
    const imageBlob = new Blob([referenceImage], { type: 'image/png' });
    formData.append('image', imageBlob, 'product.png');
    formData.append('prompt', prompt);
    formData.append('mode', 'image-to-image');
    formData.append('strength', '0.7'); // Preserve original design

    const response = await fetch(
      'https://api.stability.ai/v2beta/stable-image/edit/creative',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          // Don't set Content-Type, let fetch set it with boundary
        },
        body: formData,
      },
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Stability AI API error: ${error}`);
    }

    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
}

/**
 * Nano Banana provider (Google Gemini 2.5 Flash Image)
 * This is the default provider for high-quality image generation
 */
export class NanoBananaProvider implements AIProvider {
  async generateImage(
    prompt: string,
    referenceImage: Buffer,
    options: { apiKey: string },
  ): Promise<Buffer> {
    const apiKey = options.apiKey;
    if (!apiKey) {
      throw new Error(
        'Google AI API key is required. Set GOOGLE_AI_API_KEY or GEMINI_API_KEY environment variable or pass apiKey in options.',
      );
    }

    // Convert image to base64
    const base64Image = referenceImage.toString('base64');
    const mimeType = 'image/png'; // Default, could be detected

    // Use Gemini API with image input for image-to-image generation
    // Gemini 2.5 Flash Image (Nano Banana) supports image generation with reference images
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
                {
                  inlineData: {
                    mimeType: mimeType,
                    data: base64Image,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      },
    );

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: 'Unknown error' }));
      throw new Error(`Google Gemini API error: ${JSON.stringify(error)}`);
    }

    const data = (await response.json()) as {
      candidates: Array<{
        content: {
          parts: Array<{
            inlineData?: {
              mimeType: string;
              data: string;
            };
          }>;
        };
      }>;
    };

    // Extract the generated image from the response
    const imagePart = data.candidates[0]?.content?.parts?.find(
      (part) => part.inlineData,
    );

    if (!imagePart?.inlineData?.data) {
      throw new Error('Nano Banana API did not return an image');
    }

    return Buffer.from(imagePart.inlineData.data, 'base64');
  }
}

/**
 * Replicate provider (using various models)
 */
export class ReplicateProvider implements AIProvider {
  async generateImage(
    prompt: string,
    referenceImage: Buffer,
    options: { apiKey: string },
  ): Promise<Buffer> {
    const apiKey = options.apiKey;
    if (!apiKey) {
      throw new Error(
        'Replicate API token is required. Set REPLICATE_API_TOKEN environment variable or pass apiKey in options.',
      );
    }

    const base64Image = referenceImage.toString('base64');
    const dataUri = `data:image/png;base64,${base64Image}`;

    // Using a model that supports image-to-image
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        Authorization: `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version:
          'stability-ai/stable-diffusion:db21e45d3f7023abc2e46d38e3e839806992f2a2',
        input: {
          image: dataUri,
          prompt: prompt,
          strength: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: 'Unknown error' }));
      throw new Error(`Replicate API error: ${JSON.stringify(error)}`);
    }

    const prediction = (await response.json()) as {
      id: string;
      status: string;
    };

    // Poll for completion
    type ReplicateResult = {
      id: string;
      status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
      output?: string[];
      error?: string;
    };

    let result: ReplicateResult = prediction as ReplicateResult;
    while (result.status === 'starting' || result.status === 'processing') {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const statusResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        {
          headers: {
            Authorization: `Token ${apiKey}`,
          },
        },
      );
      result = (await statusResponse.json()) as ReplicateResult;
    }

    if (result.status === 'failed') {
      throw new Error(
        `Replicate prediction failed: ${result.error || 'Unknown error'}`,
      );
    }

    if (!result.output || result.output.length === 0) {
      throw new Error('Replicate prediction did not return an image');
    }

    const imageUrl = result.output[0];
    const imageResponse = await fetch(imageUrl);
    const arrayBuffer = await imageResponse.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
}

/**
 * Provider factory
 */
export function createAIProvider(
  provider: 'nanobanana' | 'openai' | 'stability' | 'replicate',
): AIProvider {
  switch (provider) {
    case 'nanobanana':
      return new NanoBananaProvider();
    case 'openai':
      return new OpenAIProvider();
    case 'stability':
      return new StabilityAIProvider();
    case 'replicate':
      return new ReplicateProvider();
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}
