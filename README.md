# Merch Design Enhancer

Transform product images into boutique-style mockups using AI while preserving the original design. This package takes images of your 3D merch products and enhances them into professional, aesthetically pleasing images that look like they're hanging in a luxury boutique.

## Features

- 🎨 **Preserve Original Design**: The design on your product is never altered - only the presentation is enhanced
- 🏪 **Boutique Aesthetic**: Creates high-quality images with golden/wooden hangers in an upscale boutique setting
- 🎯 **Multiple Product Types**: Supports hoodies, shirts, face caps, mugs, sticker pads, and more
- 🎨 **Color Transformation**: Optionally transform the product color while maintaining the design
- 🤖 **Multiple AI Providers**: Works with Nano Banana (Google Gemini - default), OpenAI, Stability AI, or Replicate
- 📦 **TypeScript Support**: Full TypeScript definitions included

## Installation

```bash
npm install merch-design-enhancer
```

## Quick Start

```typescript
import { MerchDesignEnhancer, ProductType } from 'merch-design-enhancer';
import fs from 'fs';

// Initialize the enhancer with your API key
const enhancer = new MerchDesignEnhancer({
  apiKey: 'your-api-key-here', // Required
  provider: 'nanobanana', // Optional, defaults to 'nanobanana'
});

// Read your product image
const imageBuffer = fs.readFileSync('my-product.png');

// Enhance the image
const result = await enhancer.enhanceImage({
  image: imageBuffer,
  productType: ProductType.SHIRT,
  color: 'navy blue', // Optional
});

// Save the enhanced image
fs.writeFileSync('enhanced-product.png', result.image);
```

## API Reference

### `MerchDesignEnhancer`

Main class for enhancing product images. Initialize with your API key and provider.

#### Constructor

```typescript
new MerchDesignEnhancer(options: MerchDesignEnhancerOptions)
```

**Parameters:**

- `apiKey` (required): API key for the selected provider
- `provider` (optional): AI provider to use. Options:
  - `'nanobanana'` (default) - Uses Google's Gemini 2.5 Flash Image (Nano Banana)
  - `'openai'` - Uses OpenAI's DALL-E
  - `'stability'` - Uses Stability AI
  - `'replicate'` - Uses Replicate

#### Method: `enhanceImage(options: EnhanceImageOptions): Promise<EnhanceImageResult>`

Enhances a product image by creating a boutique-style mockup.

**Parameters:**

- `image` (required): The input image. Can be:
  - A `Buffer` containing the image data
  - A base64 string (with or without data URI prefix)
  - A file path string

- `productType` (required): The type of product from the `ProductType` enum:
  - `ProductType.HOODIE`
  - `ProductType.FACECAP`
  - `ProductType.SHIRT`
  - `ProductType.MUG`
  - `ProductType.STICKER_PAD`
  - `ProductType.TANK_TOP`
  - `ProductType.LONG_SLEEVE`
  - `ProductType.SWEATSHIRT`
  - `ProductType.JACKET`
  - `ProductType.TOTE_BAG`

- `color` (optional): Color to transform the item. Can be:
  - A color name (e.g., "navy blue", "red", "black")
  - A hex code (e.g., "#FF5733")
  - An RGB value (e.g., "rgb(255, 87, 51)")

#### Returns

```typescript
{
  image: Buffer; // The enhanced image
  mimeType: string; // MIME type (e.g., 'image/png', 'image/jpeg')
}
```

## Examples

### Basic Usage

```typescript
import { MerchDesignEnhancer, ProductType } from 'merch-design-enhancer';
import fs from 'fs';

const enhancer = new MerchDesignEnhancer({
  apiKey: process.env.GOOGLE_AI_API_KEY, // Uses Nano Banana by default
});

const image = fs.readFileSync('hoodie-screenshot.png');

const result = await enhancer.enhanceImage({
  image,
  productType: ProductType.HOODIE,
});

fs.writeFileSync('enhanced-hoodie.png', result.image);
```

### With Color Transformation

```typescript
const enhancer = new MerchDesignEnhancer({
  apiKey: 'your-google-ai-api-key',
  provider: 'nanobanana', // Explicitly use Nano Banana
});

const result = await enhancer.enhanceImage({
  image: imageBuffer,
  productType: ProductType.SHIRT,
  color: '#1a1a2e', // Dark navy
});
```

### Using Base64 String

```typescript
const enhancer = new MerchDesignEnhancer({
  apiKey: process.env.GOOGLE_AI_API_KEY,
});

const base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANS...';

const result = await enhancer.enhanceImage({
  image: base64Image,
  productType: ProductType.MUG,
});
```

### Using Different Providers

```typescript
// Using Stability AI
const stabilityEnhancer = new MerchDesignEnhancer({
  apiKey: process.env.STABILITY_API_KEY,
  provider: 'stability',
});

const result = await stabilityEnhancer.enhanceImage({
  image: imageBuffer,
  productType: ProductType.FACECAP,
});

// Using Replicate
const replicateEnhancer = new MerchDesignEnhancer({
  apiKey: process.env.REPLICATE_API_TOKEN,
  provider: 'replicate',
});

const result2 = await replicateEnhancer.enhanceImage({
  image: imageBuffer,
  productType: ProductType.TOTE_BAG,
});
```

## Environment Variables

```typescript
const enhancer = new MerchDesignEnhancer({
  apiKey: process.env.GOOGLE_AI_API_KEY, // Read from environment
  provider: 'nanobanana',
});
```

## How It Works

1. **Input Processing**: The package normalizes your input image (Buffer, base64, or file path) into a standard format
2. **Prompt Generation**: Creates a detailed prompt that instructs the AI to:
   - Display the product hanging from a golden/wooden hanger
   - Use a slight tilt (15-20 degrees) for aesthetic appeal
   - Place it in a luxury boutique setting
   - **Preserve the original design exactly as shown**
   - Apply professional lighting and photography techniques
3. **AI Generation**: Sends the image and prompt to your chosen AI provider
4. **Output**: Returns the enhanced image as a Buffer

## Important Notes

- ⚠️ **Design Preservation**: The package is specifically designed to preserve your product design. The AI is instructed to never alter the design on the product itself.
- 💰 **API Costs**: This package uses third-party AI services that may incur costs. Check your provider's pricing.
- 🎨 **Quality**: Results depend on the quality of your input image and the AI provider used.
- ⏱️ **Processing Time**: Image generation can take 10-30 seconds depending on the provider and image complexity.

## Requirements

- Node.js >= 18.0.0
- An API key from at least one supported AI provider

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues, questions, or feature requests, please open an issue on GitHub.
