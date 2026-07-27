import { Injectable, signal } from '@angular/core';
export interface ProductVariant {
  name: string;              // e.g. "Classic", "Sport", "Luxury"
  price: number;
  image: string;
  images: string[];          // design-specific images
  description: string;       // design-specific description
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  description: string;
  features: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
  sizes?: string[];
  designs?: string[];
  variants?: ProductVariant[];
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly products = signal<Product[]>([
    {
      id: '1',
      name: 'Royal Diamond Urli',
      price: 975,
      originalPrice: 999,
      image: '/assets/items/RoyalDiamondUrli1.png',
      images: [
        '/assets/items/RoyalDiamondUrli1.png',
        '/assets/items/RoyalDiamondUrli2.png',
        '/assets/items/RoyalDiamondUrli3.png',
        '/assets/items/RoyalDiamondUrli4.png',
        '/assets/items/RoyalDiamondUrli5.png',
        '/assets/items/RoyalDiamondUrli6.png',
        '/assets/items/RoyalDiamondUrli7.png',
      ],
      category: 'Urli',
      description: 'The Royal Diamond Urli is a handcrafted pure brass decorative bowl featuring a polished golden finish and a striking embossed diamond texture. It serves as an elegant centerpiece for traditional festive arrangements with floating flowers and candles, a stylish fruit bowl for dining tables, or an accent vessel for everyday home decor.',
      features: ['100% pure brass construction', 'Embossed diamond-cut exterior pattern', 'Dimensions: 22.7 cm (L) x 22.7 cm (B) x 10.7 cm (H)', 'Weight: 340 grams', 'Polished golden luster', 'Deep basin with a stable, flat base', 'Handcrafted artisan finish'],
      inStock: true,
      rating: 4.8,
      reviews: 156,
    },
    {
      id: '2',
      name: 'Flower Urli (Hammer)',
      price: 950,
      image: '/assets/items/FlowerUrli1.png',
      images: [
        '/assets/items/FlowerUrli1.png',
        '/assets/items/FlowerUrli2.png',
        '/assets/items/FlowerUrli3.png',
        '/assets/items/FlowerUrli4.png',
        '/assets/items/FlowerUrli5.png',
        '/assets/items/FlowerUrli6.png',
        '/assets/items/FlowerUrli7.png',
      ],
      category: 'Urli',
      description: 'The Flower Urli is a handcrafted pure brass decorative bowl featuring a distinctive scalloped, flower-petal rim and an intricate hammered interior texture. Designed to elevate home decor and spiritual spaces, it serves as an elegant traditional centerpiece for floating flower petals and tea-light candles, a welcoming entryway accent, or a statement vessel for everyday table arrangements.',
      features: ['100% pure brass construction', 'Scalloped flower-petal silhouette', 'Hand-hammered textured interior', 'Dimensions: 26.3 cm (L) x 26.3 cm (B) x 11.2 cm (H)', 'Weight: 440 grams', 'Polished golden luster', 'Deep, spacious basin with a stable base', 'Handcrafted artisan finish'],
      inStock: true,
      rating: 4.6,
      reviews: 89,
    },
    {
      id: '3',
      name: 'Rasberry Bowl',
      price: 325,
      originalPrice: 399,
      image: '/assets/items/RasberyBowl1.png',
      images: [
        '/assets/items/RasberyBowl1.png',
        '/assets/items/RasberyBowl2.png',
        '/assets/items/RasberyBowl3.png',
        '/assets/items/RasberyBowl4.png',
        '/assets/items/RasberyBowl5.png',
        '/assets/items/RasberyBowl6.png',
      ],
      category: 'Bowl',
      description: 'The Rasberry Bowl is an elegant, handcrafted pure brass lidded container featuring intricate floral and peacock engravings across its exterior and domed lid. Designed with a classic pedestal base and a decorative finial handle, this versatile vessel is ideal for serving dry fruits, nuts, prasad, or mouth fresheners (mukhwas) during festive occasions, while also doubling as a sophisticated decorative box for jewelry, trinkets, and daily home decor.',
      features: ['100% pure brass construction', 'Intricate floral and peacock engraved motifs', 'Includes a matching domed lid with a decorative finial handle', 'Dimensions: 10.5 cm (L) x 10.5 cm (B) x 11.3 cm (H)', 'Weight: 442 grams', 'Polished golden luster with a smooth interior', 'Elevated pedestal base for enhanced stability', 'Handcrafted traditional artisan design'],
      inStock: true,
      rating: 4.7,
      reviews: 203,
    },
    {
      id: '4',
      name: 'Peacock Candle',
      price: 350,
      image: '/assets/items/PeacockCandle1.png',
      images: [
        '/assets/items/PeacockCandle1.png',
        '/assets/items/PeacockCandle2.jpg',
        '/assets/items/PeacockCandle3.jpg',
        '/assets/items/PeacockCandle4.jpg',
        '/assets/items/PeacockCandle5.jpg',
        '/assets/items/PeacockCandle6.jpg',
      ],
      category: 'Candle',
      description: 'The Peacock Candle holder is an elegant, handcrafted pure aluminum decorative piece featuring a brilliant polished silver finish and deeply engraved feather textures. Designed to cradle a glass votive on its back, it creates a warm, aromatic glow that enhances everyday living spaces, festive decor, and romantic dining settings, while doubling as an exceptional, ready-to-gift statement piece for weddings and special occasions.',
      features: ['100% pure aluminum construction', 'Intricate peacock feather engraved detailing', 'Dimensions: 10.6 cm (L) x 12.4 cm (B) x 10.4 cm (H)', 'Weight: 460 grams', 'Brilliant polished silver finish', 'Includes 1 fragranced candle in a glass votive', 'Packaged in a premium velvet gift box', 'Handcrafted artisan finish'],
      inStock: true,
      rating: 4.4,
      reviews: 67,
    },
    {
      id: '5',
      name: 'Elephant Diya',
      price: 340,
      image: '/assets/items/ElephantCandle1.png',
      images: [
        '/assets/items/ElephantCandle1.png',
        '/assets/items/ElephantCandle2.jpg',
        '/assets/items/ElephantCandle3.png',
        '/assets/items/ElephantCandle4.jpg',
        '/assets/items/ElephantCandle5.jpg',
      ],
      category: 'Diya',
      description: 'The Elephant Diya is an elegant, handcrafted pure aluminum traditional oil lamp featuring a brilliant polished silver finish. Designed with a majestically detailed standing elephant—a traditional symbol of wisdom, strength, and good fortune—carrying an intricately engraved diya cup upon its back, this versatile piece brings a serene, divine illumination to pooja altars, spiritual rituals, and festive home arrangements, while also doubling as an auspicious, ready-to-gift keepsake for weddings, housewarmings, and Diwali.',
      features: ['100% pure aluminum construction', 'Traditional auspicious elephant design with an raised trunk', 'Intricate floral and paisley engravings on the diya cup and elephant blanket', 'Dimensions: 12.2 cm (L) x 6.5 cm (B) x 11.4 cm (H)', 'Weight: 260 grams', 'Brilliant polished silver finish', 'Stable four-legged standing base', 'Packaged in a premium satin-lined velvet gift box', 'Handcrafted traditional artisan finish'],
      inStock: true,
      rating: 4.5,
      reviews: 134,
    },
    {
      id: '6',
      name: '2-Duck Candle Set',
      price: 799,
      originalPrice: 899,
      image: '/assets/items/2DuckCandleSet1.png',
      images: [
        '/assets/items/2DuckCandleSet1.png',
        '/assets/items/2DuckCandleSet2.png',
        '/assets/items/2DuckCandleSet3.jpg',
        '/assets/items/2DuckCandleSet4.jpg',
        '/assets/items/2DuckCandleSet5.png',
        '/assets/items/2DuckCandleSet6.jpg',
        '/assets/items/2DuckCandleSet7.jpg',
        '/assets/items/2DuckCandleSet8.jpg',
      ],
      category: 'Candle',
      description: 'The 2-Duck Candle Set is an elegant, handcrafted pure aluminum decorative pairing featuring a brilliant polished silver finish and intricate feather engravings. Designed as a matching couple with complementary long and short necks, each duck cradles a glass votive on its back to diffuse a warm, aromatic glow. This versatile set creates a serene, romantic ambiance for dining tables, festive setups, and everyday living spaces, while doubling as an exceptional, ready-to-gift keepsake for weddings, anniversaries, and housewarmings.',
      features: ['100% pure aluminum construction', 'Includes a complementary pair of long-neck and short-neck ducks', 'Intricate feather-engraved detailing with a polished silver luster', 'Long Neck Duck: 12.4 cm (L) x 6.5 cm (B) x 16 cm (H) | Weight: 440 grams', 'Short Neck Duck: 11.3 cm (L) x 6.5 cm (B) x 12.7 cm (H) | Weight: 440 grams', 'Includes 2 fragranced candles in glass votives', 'Packaged in a premium velvet gift box', 'Handcrafted artisan finish'],
      inStock: true,
      rating: 4.3,
      reviews: 45,
    },
    {
      id: '7',
      name: 'Luban Jali',
      price: 499,
      image: '/assets/items/LubanJali1.png',
      images: [
        '/assets/items/LubanJali1.png',
        '/assets/items/LubanJali2.png',
        '/assets/items/LubanJali3.png',
        '/assets/items/LubanJali4.png',
        '/assets/items/LubanJali5.png',
        '/assets/items/LubanJali6.png',
      ],
      category: 'other',
      description: 'The Luban Jali is a traditional handcrafted pure brass incense burner featuring an intricately carved openwork dome and a polished golden luster. Designed for burning loban (benzoin resin), dhoop, bakhoor, or sambrani, it allows aromatic smoke to gracefully diffuse through the decorative jali lid while safely containing ash inside. Equipped with a sturdy pedestal base and a convenient carrying handle, this vessel serves as an elegant and functional accessory for pooja rituals, meditation spaces, and natural home fragrance purification.',
      features: ['100% pure brass construction', 'Intricately carved openwork (jali) domed lid with finial', 'Dimensions: 12.5 cm (L) x 12.5 cm (B) x 13 cm (H)', 'Weight: 590 grams', 'Polished golden luster with a smooth interior', 'Convenient arched carrying handle for safe mobility', 'Elevated pedestal base for stability and surface heat protection', 'Handcrafted traditional artisan finish'],
      inStock: true,
      rating: 4.3,
      reviews: 45,
    },
    {
      id: '8',
      name: 'Akhand Urli Deep(Fancy)',
      price: 525,
      image: '/assets/items/AkhandDeepUrliFancy1.png',
      images: [
        '/assets/items/AkhandDeepUrliFancy1.png',
        '/assets/items/AkhandDeepUrliFancy2.png',
        '/assets/items/AkhandDeepUrliFancy3.png',
        '/assets/items/AkhandDeepUrliFancy4.png',
        '/assets/items/AkhandDeepUrliFancy5.png',
        '/assets/items/AkhandDeepUrliFancy6.png',
      ],
      category: 'Deep',
      description: 'The Akhand Urli Deep (Fancy) is an elegant, handcrafted pure brass traditional oil lamp featuring a radiant polished golden luster and deeply embossed floral detailing. Designed for continuous, uninterrupted illumination (Akhand Jyoti) during pooja rituals, daily prayers, and spiritual ceremonies, it comes equipped with a convenient adjustable wick mechanism and a protective cylindrical glass chimney that shields the sacred flame from drafts while ensuring safe, long-lasting burning. Supported by three ornately carved standing feet, this versatile diya brings a serene, divine glow to home altars and meditation spaces, while also serving as an auspicious, timeless gift for weddings, housewarmings, Diwali, and religious festivals.',
      features: ['100% pure brass construction with a polished golden luster', 'Deeply embossed traditional floral and scrollwork engravings on the urli base', 'Includes a protective cylindrical glass cover to shield the flame from wind and drafts', 'Features an external adjustment knob for smooth, precise wick control and extended burning', 'Dimensions: 5.9 cm (L) x 5.9 cm (B) x 24.5 cm (H)', 'Weight: 300 grams', 'Supported by three ornate, elevated legs for enhanced stability and surface heat protection', 'Complete set includes: 1 embossed urli deep base, 1 adjustable wick holder, and 1 glass cover', 'Handcrafted traditional artisan finish'],
      inStock: true,
      rating: 4.3,
      reviews: 45,
      designs: ['Akhand Urli Deep (Fancy)', 'Akhand Urli Deep(Hammer)'],
      variants:[
        {
          name: 'Akhand Urli Deep (Fancy)',
          price: 525,
          image: '/assets/items/AkhandDeepUrliFancy1.png',
          images: [
            '/assets/items/AkhandDeepUrliFancy1.png',
            '/assets/items/AkhandDeepUrliFancy2.png',
            '/assets/items/AkhandDeepUrliFancy3.png',
            '/assets/items/AkhandDeepUrliFancy4.png',
            '/assets/items/AkhandDeepUrliFancy5.png',
            '/assets/items/AkhandDeepUrliFancy6.png',
          ],
          description: 'The Akhand Urli Deep (Fancy) is an elegant, handcrafted pure brass traditional oil lamp featuring a radiant polished golden luster and deeply embossed floral detailing. Designed for continuous, uninterrupted illumination (Akhand Jyoti) during pooja rituals, daily prayers, and spiritual ceremonies, it comes equipped with a convenient adjustable wick mechanism and a protective cylindrical glass chimney that shields the sacred flame from drafts while ensuring safe, long-lasting burning. Supported by three ornately carved standing feet, this versatile diya brings a serene, divine glow to home altars and meditation spaces, while also serving as an auspicious, timeless gift for weddings, housewarmings, Diwali, and religious festivals.',
          inStock: true,
        },
        {
          name: 'Akhand Urli Deep (Hammer)',
          price: 520,
          image: '/assets/items/AkhandDeepUrliHammer1.png',
          images: [
            '/assets/items/AkhandDeepUrliHammer1.png',
            '/assets/items/AkhandDeepUrliHammer2.png',
            '/assets/items/AkhandDeepUrliHammer3.png',
            '/assets/items/AkhandDeepUrliHammer4.png',
            '/assets/items/AkhandDeepUrliHammer5.png',
            '/assets/items/AkhandDeepUrliHammer6.png',
          ],
          description: 'The Akhand Urli Deep (Hammer) is an elegant, handcrafted pure brass traditional oil lamp featuring a radiant polished golden luster and a distinctive hand-hammered texture. Designed for continuous, uninterrupted illumination (Akhand Jyoti) during pooja rituals, daily prayers, and spiritual ceremonies, it comes equipped with a convenient adjustable wick mechanism and a protective cylindrical glass chimney that shields the sacred flame from drafts while ensuring safe, long-lasting burning. The hammered interior beautifully catches and reflects the warm light of the diya, while three ornately carved standing feet provide stable support, making this versatile piece a stunning focal point for home altars, meditation spaces, and an auspicious gift for weddings, Diwali, and housewarmings.',
          inStock: true,
        },
      ]
    },
    {
      id: '9',
      name: 'Chandra Mukhi',
      price: 249,
      image: '/assets/items/ChandraMukhi1.png',
      images: [
        '/assets/items/ChandraMukhi1.png',
        '/assets/items/ChandraMukhi2.png',
        '/assets/items/ChandraMukhi3.png',
        '/assets/items/ChandraMukhi4.png',
        '/assets/items/ChandraMukhi5.png',
      ],
      category: 'Diya',
      description: 'The Chandra Mukhi Diya is an elegant, handcrafted pure brass traditional oil lamp featuring a radiant polished golden luster and a graceful scalloped rim reminiscent of a blooming lotus or radiating moonlight. Designed with an elevated pedestal stand and a deep, flared bowl for holding oil or ghee, this classic diya provides steady, serene illumination for pooja altars, daily spiritual rituals, and festive home arrangements. Its compact, well-balanced profile makes it an ideal addition to personal meditation spaces, while also serving as an auspicious, timeless return gift for weddings, housewarmings, Diwali, and religious ceremonies.',
      features: ['100% pure brass construction with a brilliant polished golden luster', 'Elegant scalloped rim design inspired by traditional floral and lunar motifs', 'Deep bowl capacity for oil or ghee to ensure extended burning time', 'Dimensions: 9 cm (L) x 9 cm (B) x 6.5 cm (H)', 'Weight: 100 grams', 'Elevated pedestal base that provides stability and protects table surfaces from heat', 'Compact and lightweight profile, ideal for daily pooja rituals and festive decor', 'Handcrafted traditional artisan finish'],
      inStock: true,
      rating: 4.3,
      reviews: 45,
    },
    {
      id: '10',
      name: 'Ring Diya',
      price: 550,
      image: '/assets/items/RingDiya1.png',
      images: [
        '/assets/items/RingDiya1.png',
        '/assets/items/RingDiya2.png',
        '/assets/items/RingDiya3.png',
        '/assets/items/RingDiya4.png',
        '/assets/items/RingDiya5.png',
        '/assets/items/RingDiya6.png',
        '/assets/items/RingDiya7.png',
      ],
      category: 'Diya',
      description: 'The Ring Diya is a magnificent, handcrafted pure aluminum traditional oil lamp featuring a brilliant polished silver finish and an ornate architectural silhouette. Centered around a classic diya bowl backed by a sacred conch (Shankh) emblem, the lamp is framed by an intricately engraved circular arch (prabhavali) that symbolizes divine radiance and protection. Supported by an elegant bell-shaped pedestal resting on a sturdy circular base tray, this statement piece brings a serene, auspicious illumination to pooja altars, daily prayers, and festive home arrangements, while doubling as an exceptional, ready-to-gift keepsake for weddings, Diwali, housewarmings, and religious ceremonies.',
      features: ['100% pure aluminum construction with a brilliant polished silver luster', 'Ornate circular arch (prabhavali) featuring intricately carved traditional floral and scalloped detailing', 'Sacred conch (Shankh) emblem positioned prominently above the diya bowl to attract positive, auspicious energy', 'Dimensions: 12 cm (L) x 10 cm (B) x 18.3 cm (H)', 'Weight: 300 grams', 'Elevated bell-shaped pedestal resting on a wide circular base tray for maximum stability and surface heat protection', 'Packaged in a premium satin-lined velvet gift box with a secure latch', 'Handcrafted traditional artisan finish, ideal for pooja rituals, festive decor, and celebratory gifting'],
      inStock: true,
      rating: 4.3,
      reviews: 45,
    },
    {
      id: '11',
      name: 'Plain Urli',
      price: 955,
      image: '/assets/items/PlainUrli1.png',
      images: [
        '/assets/items/PlainUrli1.png',
        '/assets/items/PlainUrli2.png',
        '/assets/items/PlainUrli3.png',
        '/assets/items/PlainUrli4.png',
        '/assets/items/PlainUrli5.png',
        '/assets/items/PlainUrli6.png',
        '/assets/items/PlainUrli7.png',
      ],
      category: 'Urli',
      description: 'The Plain Urli is a classic, handcrafted pure brass traditional vessel featuring a brilliant polished golden luster and a sleek, unembellished silhouette. Deeply rooted in Indian traditions, urlis are auspiciously placed at home entrances, living rooms, and pooja altars filled with water, floating flowers, and glowing tea-light candles to attract positive energy, serenity, and good fortune. Designed with sturdy, ergonomic side handles for effortless carrying, this wide and spacious bowl serves as an elegant centerpiece for everyday decor and grand festive occasions like Diwali, Pongal, and weddings, while also making a timeless, traditional gift.',
      features: ['100% pure brass construction with a radiant, mirror-like polished golden finish', 'Classic plain design that beautifully reflects the light of floating candles and flowers', 'Equipped with solid, ergonomic side handles for secure grip and easy transport', 'Dimensions: 26 cm (L) x 21.1 cm (B) x 7.1 cm (H)', 'Weight: 420 grams', 'Wide, deep basin optimized for floating flower petals, potpourri, and diyas', 'Flat, stable base that sits securely on floor setups, tables, and entrance consoles', 'Handcrafted traditional artisan finish, perfect for festive decor, pooja setups, and celebratory gifting'],
      inStock: true,
      rating: 4.3,
      reviews: 45,
      designs:['Plain Urli', 'Hammer Urli', 'Diamond Urli', 'Chand Chitai Urli', 'Ankh Chitai Urli' ],
      variants:[
        {
          name: 'Plain Urli',
          price: 955,
          image: '/assets/items/PlainUrli1.png',
          images: [
            '/assets/items/PlainUrli1.png',
            '/assets/items/PlainUrli2.png',
            '/assets/items/PlainUrli3.png',
            '/assets/items/PlainUrli4.png',
            '/assets/items/PlainUrli5.png',
            '/assets/items/PlainUrli6.png',
            '/assets/items/PlainUrli7.png',
          ],
          description: 'The Plain Urli is a classic, handcrafted pure brass traditional vessel featuring a brilliant polished golden luster and a sleek, unembellished silhouette. Deeply rooted in Indian traditions, urlis are auspiciously placed at home entrances, living rooms, and pooja altars filled with water, floating flowers, and glowing tea-light candles to attract positive energy, serenity, and good fortune. Designed with sturdy, ergonomic side handles for effortless carrying, this wide and spacious bowl serves as an elegant centerpiece for everyday decor and grand festive occasions like Diwali, Pongal, and weddings, while also making a timeless, traditional gift.',
          inStock: true,
        },
        {
          name: 'Hammer Urli',
          price: 975,
          image: '/assets/items/HammerUrli1.png',
          images: [
            '/assets/items/HammerUrli1.png',
            '/assets/items/HammerUrli2.png',
            '/assets/items/HammerUrli3.png',
            '/assets/items/HammerUrli4.png',
            '/assets/items/HammerUrli5.png',
            '/assets/items/HammerUrli6.png',
            '/assets/items/HammerUrli7.png',
          ],
          description: 'The Hammer Urli is an exquisite, handcrafted pure brass traditional vessel featuring a brilliant polished golden luster and a distinctive hand-hammered texture across its inner basin and outer rim. Deeply rooted in Indian cultural traditions, urlis are auspiciously displayed at home entrances, living rooms, and pooja altars filled with water, floating flower petals, and glowing tea-light candles or diyas to attract positive energy, serenity, and good fortune. The artisanal hammered indentations catch and scatter light beautifully, creating a mesmerizing shimmer when illuminated. Equipped with solid, ergonomic side handles for effortless carrying, this versatile bowl serves as a captivating centerpiece for daily home decor and grand festive occasions such as Diwali, Pongal, weddings, and housewarmings.',
          inStock: true,
        },
        {
          name: 'Diamond Urli',
          price: 999,
          image: '/assets/items/UrliDiamond1.png', 
          images: [
            '/assets/items/UrliDiamond1.png',
            '/assets/items/UrliDiamond2.png',
            '/assets/items/UrliDiamond3.png',
            '/assets/items/UrliDiamond4.png',
            '/assets/items/UrliDiamond5.png',
            '/assets/items/UrliDiamond6.png',
            '/assets/items/UrliDiamond7.png',
            '/assets/items/UrliDiamond8.png',
          ],
          description: 'The Diamond Urli is a stunning, handcrafted pure brass traditional vessel featuring a radiant polished golden luster and intricate geometric diamond-cut embossed detailing. Deeply rooted in Indian cultural decor, urlis are traditionally placed at home entrances, living rooms, and pooja altars filled with water, floating flowers, and glowing tea-light candles to attract positive energy, serenity, and good fortune. The distinctive faceted pattern on the interior basin and outer rim catches and reflects light beautifully, while sturdy side handles ensure effortless carrying. This versatile bowl serves as an eye-catching centerpiece for daily decor and grand festive occasions like Diwali, weddings, and housewarmings.',
          inStock: true,
        },
        {
          name: 'Chand Chitai Urli',
          price: 975,
          image: '/assets/items/UrliChandChitai1.png',
          images: [
            '/assets/items/UrliChandChitai1.png',
            '/assets/items/UrliChandChitai2.png',
            '/assets/items/UrliChandChitai3.png',
            '/assets/items/UrliChandChitai4.png',
            '/assets/items/UrliChandChitai5.png',
            '/assets/items/UrliChandChitai6.png',
            '/assets/items/UrliChandChitai7.png',
            '/assets/items/UrliChandChitai8.png',
          ],
          description: 'The Chand Chitai Urli is a magnificent, handcrafted pure brass traditional vessel featuring a radiant polished golden luster and intricate artisanal metalwork. Deeply rooted in Indian cultural traditions, urlis are auspiciously displayed at home entrances, living rooms, and pooja altars filled with water, floating flowers, and glowing tea-light candles to invite serenity, positive energy, and prosperity into the living space. This piece showcases traditional Chitai (hand-chased and embossed) floral and vine engravings around the outer rim, paired with graceful crescent moon (Chand)-shaped scalloped detailing across the inner basin. Designed with solid, ergonomic side handles for effortless handling, it serves as an exquisite centerpiece for daily decor and celebratory occasions such as Diwali, Pongal, weddings, and housewarmings.',
          inStock: true,
        },
        {
          name: 'Ankh Chitai Urli',
          price: 975,
          image: '/assets/items/UrliAnkhChita1.png',
          images: [
            '/assets/items/UrliAnkhChitai1.png',
            '/assets/items/UrliAnkhChitai2.png',
            '/assets/items/UrliAnkhChitai3.png',
            '/assets/items/UrliAnkhChitai4.png',
            '/assets/items/UrliAnkhChitai5.png',
            '/assets/items/UrliAnkhChitai6.png',
            '/assets/items/UrliAnkhChitai7.png',
          ],
          description: 'The Ankh Chitai Urli is a striking, handcrafted pure brass traditional vessel featuring a brilliant polished golden luster and intricate artisanal metalwork. Deeply rooted in Indian cultural heritage, urlis are auspiciously placed at home entrances, living rooms, and pooja altars filled with water, floating flower petals, and glowing tea-light candles or diyas to invite positive energy, serenity, and good fortune into the home. This piece is distinguished by its elegant Ankh (eye- and petal-like fluted) embossed detailing radiating across the interior basin, complemented by traditional Chitai (hand-chased and engraved) motifs around the outer rim. Equipped with solid, ergonomic side handles for effortless lifting and transport, this versatile bowl serves as a mesmerizing centerpiece for daily home decor and grand festive occasions such as Diwali, Pongal, weddings, and housewarmings.',
          inStock: true,
        },
      ]
    },
  ]);

  getProducts() {
    return this.products();
  }

  getProduct(id: string) {
    return this.products().find((product) => product.id === id);
  }
}
