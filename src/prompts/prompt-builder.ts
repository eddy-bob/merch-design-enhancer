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
    const colorDescription = color ? ` in ${color} color` : '';
    const designPreservation = hasDesign
      ? ' The design on the product must remain exactly as shown in the reference image - do not alter, modify, or change the design in any way. The design should be clearly visible and prominent. Remember it will be used as the sales image for the product.'
      : '';

    // Use specialized prompts based on product type
    switch (productType) {
      case ProductType.HOODIE:
      case ProductType.SHIRT:
      case ProductType.TANK_TOP:
      case ProductType.LONG_SLEEVE:
      case ProductType.SWEATSHIRT:
      case ProductType.JACKET:
        return this.buildClothingPrompt(
          productType,
          colorDescription,
          designPreservation,
        );

      case ProductType.FACECAP:
        return this.buildCapPrompt(colorDescription, designPreservation);

      case ProductType.MUG:
        return this.buildMugPrompt(colorDescription, designPreservation);

      case ProductType.STICKER_PAD:
        return this.buildStickerPadPrompt(colorDescription, designPreservation);

      case ProductType.TOTE_BAG:
        return this.buildToteBagPrompt(colorDescription, designPreservation);

      default:
        return this.buildGenericPrompt(
          productType,
          colorDescription,
          designPreservation,
        );
    }
  }

  /**
   * Prompt for clothing items that hang from hangers
   */
  private static buildClothingPrompt(
    productType: ProductType,
    colorDescription: string,
    designPreservation: string,
  ): string {
    const productName = this.getProductName(productType);

    return `Create a high-quality, professional product photography image of a ${productName}${colorDescription} hanging from an elegant golden or wooden hanger in a luxury boutique setting. 

Requirements:
- The ${productName} should be displayed hanging from a premium golden or wooden hanger with a slight, natural tilt (approximately 15-20 degrees) that showcases the product beautifully
- The focus should be entirely on the ${productName}, which should appear as if it's made from high-quality fabric
- The background should suggest an upscale boutique environment - think soft, professional lighting, elegant textures, and a sophisticated atmosphere
- The image should look like professional product photography that you would see in a high-end fashion catalog or boutique website
- The lighting should be soft and flattering, highlighting the product's details, fabric texture, and fit
- The ${productName} should appear three-dimensional and realistic, as if it's an actual physical garment
- The overall aesthetic should be clean, minimal, and luxurious${designPreservation}
- The hanger should be visible but not distract from the product
- The image should have a shallow depth of field, keeping the product in sharp focus while the background is slightly blurred
- Show the fabric texture and quality - it should look premium and well-made
- Color accuracy is important - maintain the exact colors of the product${colorDescription ? `, especially the specified color` : ''}

Style: Professional product photography, boutique aesthetic, luxury fashion catalog, high-end e-commerce, clean and minimal, sophisticated lighting, realistic fabric texture, premium quality.`;
  }

  /**
   * Prompt for face caps/baseball caps
   */
  private static buildCapPrompt(
    colorDescription: string,
    designPreservation: string,
  ): string {
    return `Create a high-quality, professional product photography image of a face cap or baseball cap${colorDescription} displayed on an elegant cap stand or mannequin head in a luxury boutique setting.

Requirements:
- The cap should be displayed on a premium cap stand, wooden display head, or elegant mannequin head that showcases the cap beautifully
- Position the cap at a slight angle (approximately 15-20 degrees) to show both the front design and the overall shape
- The focus should be entirely on the cap, which should appear as if it's made from high-quality materials
- The background should suggest an upscale boutique or lifestyle store environment - think soft, professional lighting, elegant textures, and a sophisticated atmosphere
- The image should look like professional product photography that you would see in a high-end sports or lifestyle brand catalog
- The lighting should be soft and flattering, highlighting the cap's details, material texture, and structure
- The cap should appear three-dimensional and realistic, as if it's an actual physical item
- The overall aesthetic should be clean, minimal, and luxurious${designPreservation}
- The display stand should be visible but not distract from the cap
- The image should have a shallow depth of field, keeping the cap in sharp focus while the background is slightly blurred
- Show the material quality - it should look premium and well-constructed
- Color accuracy is important - maintain the exact colors of the cap${colorDescription ? `, especially the specified color` : ''}

Style: Professional product photography, boutique aesthetic, luxury sports/lifestyle catalog, high-end e-commerce, clean and minimal, sophisticated lighting, realistic material texture, premium quality.`;
  }

  /**
   * Prompt for mugs
   */
  private static buildMugPrompt(
    colorDescription: string,
    designPreservation: string,
  ): string {
    return `Create a high-quality, professional product photography image of a ceramic mug${colorDescription} displayed on an elegant surface in a luxury boutique or modern home setting.

Requirements:
- The mug should be displayed on a beautiful surface such as a marble countertop, wooden table, or elegant ceramic coaster in a sophisticated setting
- Position the mug at a slight angle (approximately 20-30 degrees) to showcase both the front design and the overall shape of the mug
- The focus should be entirely on the mug, which should appear as if it's made from high-quality ceramic
- The background should suggest an upscale boutique, modern kitchen, or lifestyle store environment - think soft, professional lighting, elegant textures, and a sophisticated atmosphere
- The image should look like professional product photography that you would see in a high-end home goods catalog or boutique website
- The lighting should be soft and flattering, highlighting the mug's design, ceramic texture, and shape
- The mug should appear three-dimensional and realistic, as if it's an actual physical item
- The overall aesthetic should be clean, minimal, and luxurious${designPreservation}
- The surface should complement the mug without distracting from it - consider adding subtle elements like natural light, soft shadows, or minimal props
- The image should have a shallow depth of field, keeping the mug in sharp focus while the background is slightly blurred
- Show the ceramic quality - it should look premium and well-crafted
- Color accuracy is important - maintain the exact colors of the mug${colorDescription ? `, especially the specified color` : ''}

Style: Professional product photography, boutique aesthetic, luxury home goods catalog, high-end e-commerce, clean and minimal, sophisticated lighting, realistic ceramic texture, premium quality, lifestyle photography.`;
  }

  /**
   * Prompt for sticker pads/notepads
   */
  private static buildStickerPadPrompt(
    colorDescription: string,
    designPreservation: string,
  ): string {
    return `Create a high-quality, professional product photography image of a sticker pad or notepad${colorDescription} displayed on an elegant desk or table surface in a luxury boutique or modern workspace setting.

Requirements:
- The sticker pad should be displayed on a beautiful surface such as a wooden desk, marble table, or elegant workspace setting
- Position the pad at a slight angle (approximately 15-25 degrees) to showcase the cover design and give it a natural, inviting appearance
- The focus should be entirely on the sticker pad, which should appear as if it's made from high-quality paper and materials
- The background should suggest an upscale boutique, modern office, or lifestyle store environment - think soft, professional lighting, elegant textures, and a sophisticated atmosphere
- The image should look like professional product photography that you would see in a high-end stationery or office supplies catalog
- The lighting should be soft and flattering, highlighting the pad's design, paper texture, and quality
- The sticker pad should appear three-dimensional and realistic, as if it's an actual physical item
- The overall aesthetic should be clean, minimal, and luxurious${designPreservation}
- The surface should complement the pad without distracting from it - consider adding subtle elements like natural light, soft shadows, or minimal office/desk props
- The image should have a shallow depth of field, keeping the sticker pad in sharp focus while the background is slightly blurred
- Show the paper quality - it should look premium and well-made
- Color accuracy is important - maintain the exact colors of the sticker pad${colorDescription ? `, especially the specified color` : ''}

Style: Professional product photography, boutique aesthetic, luxury stationery catalog, high-end e-commerce, clean and minimal, sophisticated lighting, realistic paper texture, premium quality, workspace lifestyle photography.`;
  }

  /**
   * Prompt for tote bags
   */
  private static buildToteBagPrompt(
    colorDescription: string,
    designPreservation: string,
  ): string {
    return `Create a high-quality, professional product photography image of a tote bag${colorDescription} displayed hanging from an elegant hook or displayed on a surface in a luxury boutique setting.

Requirements:
- The tote bag should be displayed hanging from a premium golden or wooden hook, or elegantly arranged on a beautiful surface to showcase its shape and design
- Position the bag with a slight natural drape or fold to show both the front design and the overall structure
- The focus should be entirely on the tote bag, which should appear as if it's made from high-quality fabric or material
- The background should suggest an upscale boutique, modern retail, or lifestyle store environment - think soft, professional lighting, elegant textures, and a sophisticated atmosphere
- The image should look like professional product photography that you would see in a high-end fashion or lifestyle brand catalog
- The lighting should be soft and flattering, highlighting the bag's design, material texture, and structure
- The tote bag should appear three-dimensional and realistic, as if it's an actual physical item
- The overall aesthetic should be clean, minimal, and luxurious${designPreservation}
- The hook or surface should be visible but not distract from the bag
- The image should have a shallow depth of field, keeping the tote bag in sharp focus while the background is slightly blurred
- Show the material quality - it should look premium and well-constructed
- Color accuracy is important - maintain the exact colors of the bag${colorDescription ? `, especially the specified color` : ''}

Style: Professional product photography, boutique aesthetic, luxury fashion/lifestyle catalog, high-end e-commerce, clean and minimal, sophisticated lighting, realistic fabric/material texture, premium quality.`;
  }

  /**
   * Generic prompt fallback
   */
  private static buildGenericPrompt(
    productType: ProductType,
    colorDescription: string,
    designPreservation: string,
  ): string {
    const productName = this.getProductName(productType);

    return `Create a high-quality, professional product photography image of a ${productName}${colorDescription} displayed in a luxury boutique setting.

Requirements:
- The ${productName} should be displayed in an elegant and natural way that showcases the product beautifully
- The focus should be entirely on the ${productName}, which should appear as if it's made from high-quality materials
- The background should suggest an upscale boutique environment - think soft, professional lighting, elegant textures, and a sophisticated atmosphere
- The image should look like professional product photography that you would see in a high-end catalog or boutique website
- The lighting should be soft and flattering, highlighting the product's details and texture
- The ${productName} should appear three-dimensional and realistic, as if it's an actual physical item
- The overall aesthetic should be clean, minimal, and luxurious${designPreservation}
- The image should have a shallow depth of field, keeping the product in sharp focus while the background is slightly blurred
- Color accuracy is important - maintain the exact colors of the product${colorDescription ? `, especially the specified color` : ''}

Style: Professional product photography, boutique aesthetic, luxury catalog, high-end e-commerce, clean and minimal, sophisticated lighting, premium quality.`;
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
