import { ProductType } from '../types/product-type';

/**
 * Builds a detailed prompt for AI image generation
 * that creates a boutique-style mockup while preserving the design
 */
export class PromptBuilder {
  static buildPrompt(
    productType: ProductType,
    color?: string,
    hasDesign: boolean = true,
  ): string {
    const productName = this.getProductName(productType);
    const colorDescription = color ? ` in ${color} color` : '';
    const designPreservation = hasDesign
      ? ' The design on the product must remain exactly as shown in the reference image - do not alter, modify, or change the design in any way. The design should be clearly visible and prominent. Remember it will be used as the sales image for the product.'
      : '';

    return `Create a high-quality, professional product photography image of a ${productName}${colorDescription} hanging from an elegant golden or wooden hanger in a luxury boutique setting. 

Requirements:
- The ${productName} should be displayed hanging from a premium golden or wooden hanger with a slight, natural tilt (approximately 15-20 degrees) that showcases the product beautifully
- The focus should be entirely on the ${productName}, which should appear as if it's made from high-quality fabric/material
- The background should suggest an upscale boutique environment - think soft, professional lighting, elegant textures, and a sophisticated atmosphere
- The image should look like professional product photography that you would see in a high-end fashion catalog or boutique website
- The lighting should be soft and flattering, highlighting the product's details and texture
- The ${productName} should appear three-dimensional and realistic, as if it's an actual physical item
- The overall aesthetic should be clean, minimal, and luxurious${designPreservation}
- The hanger should be visible but not distract from the product
- The image should have a shallow depth of field, keeping the product in sharp focus while the background is slightly blurred
- Color accuracy is important - maintain the exact colors of the product${color ? `, especially the ${color} color specified` : ''}

Style: Professional product photography, boutique aesthetic, luxury fashion catalog, high-end e-commerce, clean and minimal, sophisticated lighting, realistic fabric texture, premium quality.`;
  }

  private static getProductName(productType: ProductType): string {
    const names: Record<ProductType, string> = {
      [ProductType.HOODIE]: 'hoodie',
      [ProductType.FACECAP]: 'face cap or baseball cap',
      [ProductType.SHIRT]: 't-shirt or shirt',
      [ProductType.MUG]: 'ceramic mug',
      [ProductType.STICKER_PAD]: 'sticker pad or notepad',
      [ProductType.TANK_TOP]: 'tank top',
      [ProductType.LONG_SLEEVE]: 'long sleeve shirt',
      [ProductType.SWEATSHIRT]: 'sweatshirt',
      [ProductType.JACKET]: 'jacket',
      [ProductType.TOTE_BAG]: 'tote bag',
    };
    return names[productType] || 'product';
  }
}
