const imagePath = (fileName: string) => encodeURI(`/reference/images/${fileName}`);

// Mapping is based on visible captions/compositions in the generated reference images.
export const aurenAssets = {
  bottleModel: "/models/auren-bottle.glb",
  floorModel: "/models/auren_fractured_floor.glb",
  images: {
    loading: imagePath("ChatGPT Image Apr 30, 2026, 12_31_23 PM.png"),
    hero: imagePath("ChatGPT Image Apr 30, 2026, 12_30_52 PM.png"),
    productReveal: imagePath("ChatGPT Image Apr 30, 2026, 12_30_35 PM.png"),
    ritualStory: imagePath("ChatGPT Image Apr 30, 2026, 12_30_22 PM.png"),
    fragranceNotes: imagePath("ChatGPT Image Apr 30, 2026, 12_30_03 PM.png"),
    campaignGallery: [
      imagePath("ChatGPT Image Apr 30, 2026, 12_29_40 PM.png"),
      imagePath("ChatGPT Image Apr 30, 2026, 12_29_51 PM.png"),
      imagePath("ChatGPT Image Apr 30, 2026, 12_30_52 PM.png"),
      imagePath("ChatGPT Image Apr 30, 2026, 12_30_35 PM.png"),
      imagePath("ChatGPT Image Apr 30, 2026, 12_29_27 PM.png")
    ],
    film: imagePath("ChatGPT Image Apr 30, 2026, 12_29_27 PM.png"),
    editions: imagePath("ChatGPT Image Apr 30, 2026, 12_28_58 PM.png"),
    ritualGuide: imagePath("ChatGPT Image Apr 30, 2026, 12_28_44 PM.png"),
    footer: imagePath("ChatGPT Image Apr 30, 2026, 12_31_23 PM.png")
  }
} as const;

export const criticalAssets = [
  aurenAssets.bottleModel,
  aurenAssets.floorModel,
  aurenAssets.images.loading,
  aurenAssets.images.hero,
  aurenAssets.images.productReveal,
  aurenAssets.images.fragranceNotes,
  "/desire-gallery/saffron-crocus.png",
  "/desire-gallery/black-rose.png",
  "/desire-gallery/taproot.png",
  "/asset-manifest.json"
];
