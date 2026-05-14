import { aurenAssets } from "@/lib/auren-assets";

export const navLinks = [
  { label: "Fragrance", href: "#fragrance-notes" },
  { label: "Gallery", href: "#campaign-gallery" },
  { label: "Ritual", href: "#ritual-story" },
  { label: "Film", href: "#film" },
  { label: "Editions", href: "#editions" },
  { label: "Contact", href: "#footer" }
];

export const materialCallouts = [
  { index: "01", label: "CAP", copy: "Brushed champagne gold finish" },
  { index: "02", label: "GLASS", copy: "Smoked crystal glass" },
  { index: "03", label: "LABEL", copy: "Textured black label" },
  { index: "04", label: "LIQUID", copy: "Amber elixir" }
];

export const ritualStoryLines = [
  "Some fragrances are worn.",
  "AUREN NOIR is inhabited.",
  "It does not announce your arrival.",
  "It announces your departure."
];

export const fragranceNotes = [
  {
    title: "Top Notes",
    notes: ["Black Saffron", "Smoked Oud", "Bergamot Noir"],
    caption: "Mineral brightness through heated resin.",
    imagePosition: "20% center",
    icon: "sprig"
  },
  {
    title: "Heart Notes",
    notes: ["Midnight Rose", "Amber Resin", "Dark Jasmine"],
    caption: "A controlled bloom held in shadow.",
    imagePosition: "50% center",
    icon: "rose"
  },
  {
    title: "Base Notes",
    notes: ["Vetiver", "Sandalwood", "Musk Absolute", "Benzoin"],
    caption: "Warm, precise, and almost ceremonial.",
    imagePosition: "80% center",
    icon: "root"
  }
];

export const galleryItems = [
  {
    index: "01",
    title: "Signature Extrait",
    caption: "Bottle on black marble",
    image: aurenAssets.images.campaignGallery[0]
  },
  {
    index: "02",
    title: "The Essence Within",
    caption: "Model in shadow",
    image: aurenAssets.images.campaignGallery[1]
  },
  {
    index: "03",
    title: "Ingredient Story",
    caption: "Saffron origin",
    image: aurenAssets.images.fragranceNotes
  },
  {
    index: "04",
    title: "Architecture of Desire",
    caption: "Brutalist interior",
    image: aurenAssets.images.campaignGallery[2]
  },
  {
    index: "05",
    title: "Moonlit Obsession",
    caption: "Bottle under moonlight",
    image: aurenAssets.images.campaignGallery[4]
  }
];

export const productEditions = [
  {
    name: "AUREN NOIR Original",
    size: "50ml",
    price: "$129",
    image: aurenAssets.images.editions
  },
  {
    name: "AUREN NOIR Intense",
    size: "100ml",
    price: "$199",
    image: aurenAssets.images.productReveal
  },
  {
    name: "AUREN NOIR Absolu",
    size: "30ml limited",
    price: "$249",
    image: aurenAssets.images.hero
  }
];

export const ritualSteps = [
  "Warm the bottle between your palms.",
  "Apply to wrist, neck, behind the ear.",
  "Allow 30 minutes for the full composition to emerge."
];
