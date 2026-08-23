/**
 * Construction Calculators - Area, Volume, Concrete, Square Footage, Roofing, Tile, Gravel, Mulch, Paint, Flooring, Fence, Stair
 */
import type { CalculatorDefinition } from "@/lib/calculators/types";
import { formatNumber } from "@/lib/utils/format";
import { parseNumber } from "@/lib/utils/validation";

const fin = {
  summary: "Calculate construction measurements with clear, accurate results.",
  howToUse: ["Enter your measurements.", "Press Calculate."],
  interpretation: "The result provides the measurement you need for your project.",
  formula: "",
  variables: [] as { symbol: string; name: string; description: string }[],
  example: { title: "Example", inputs: { A: 1, B: 2 }, steps: ["Step 1"], result: "Result" },
  factors: ["Measurements should be in the same units."],
  edgeCases: ["Zero inputs produce zero results."],
  commonMistakes: ["Using inconsistent units."],
  assumptions: ["Standard construction measurements."],
  limitations: ["Estimates only - verify on site."],
  faqs: [{ question: "Are results accurate?", answer: "Yes, based on standard formulas and your inputs. Always verify on site." }],
};

// ============ AREA ============
export const areaCalculator: CalculatorDefinition = {
  id: "area", slug: "area-calculator", name: "Area Calculator", category: "construction",
  shortDescription: "Calculate the area of rectangles, circles, triangles and more.", icon: "square", accent: "construction", popularity: 95,
  inputs: [
    { id: "shape", label: "Shape", type: "dropdown", defaultValue: "rectangle", options: [{ label: "Rectangle", value: "rectangle" }, { label: "Square", value: "square" }, { label: "Circle", value: "circle" }, { label: "Triangle", value: "triangle" }] },
    { id: "length", label: "Length", type: "number", unit: "m", placeholder: "10", defaultValue: 10, validation: { required: true, min: 0 } },
    { id: "width", label: "Width", type: "number", unit: "m", placeholder: "5", defaultValue: 5, validation: { required: true, min: 0 } },
  ],
  calculate: (v) => {
    const shape = String(v.shape ?? "rectangle"), length = parseNumber(v.length) ?? 0, width = parseNumber(v.width) ?? 0;
    let area = 0, label = "";
    if (shape === "rectangle") { area = length * width; label = "Rectangle"; }
    else if (shape === "square") { area = length * length; label = "Square"; }
    else if (shape === "circle") { area = Math.PI * Math.pow(length / 2, 2); label = "Circle"; }
    else if (shape === "triangle") { area = 0.5 * length * width; label = "Triangle"; }
    return {
      sections: [
        { id: "primary", values: [{ id: "area", label: "AREA", value: `${formatNumber(area, 2)} m²`, format: "text", primary: true, description: `${label} shape` }] },
      ],
      interpretation: `The area of the ${label.toLowerCase()} is ${formatNumber(area, 2)} square meters.`,
    };
  },
  content: { ...fin, summary: "The Area Calculator computes area for rectangles, squares, circles and triangles." },
  relatedCalculators: ["volume", "square-footage", "tile", "flooring"],
  seo: { title: "Area Calculator – Rectangle, Circle, Triangle", description: "Calculate the area of rectangles, circles, triangles and more. Free, instant and accurate.", keywords: ["area calculator", "square meters"], primaryIntent: "Calculate area", secondaryIntents: ["Area of rectangle", "Area of circle"] },
};

// ============ VOLUME ============
export const volumeCalculator: CalculatorDefinition = {
  id: "volume", slug: "volume-calculator", name: "Volume Calculator", category: "construction",
  shortDescription: "Calculate the volume of boxes, cylinders, spheres and more.", icon: "box", accent: "construction", popularity: 94,
  inputs: [
    { id: "shape", label: "Shape", type: "dropdown", defaultValue: "box", options: [{ label: "Box", value: "box" }, { label: "Cylinder", value: "cylinder" }, { label: "Sphere", value: "sphere" }, { label: "Cone", value: "cone" }] },
    { id: "length", label: "Length / Height", type: "number", unit: "m", placeholder: "10", defaultValue: 10, validation: { required: true, min: 0 } },
    { id: "width", label: "Width / Radius", type: "number", unit: "m", placeholder: "5", defaultValue: 5, validation: { required: true, min: 0 } },
    { id: "depth", label: "Depth", type: "number", unit: "m", placeholder: "2", defaultValue: 2, validation: { required: true, min: 0 } },
  ],
  calculate: (v) => {
    const shape = String(v.shape ?? "box"), length = parseNumber(v.length) ?? 0, width = parseNumber(v.width) ?? 0, depth = parseNumber(v.depth) ?? 0;
    let volume = 0, label = "";
    if (shape === "box") { volume = length * width * depth; label = "Box"; }
    else if (shape === "cylinder") { volume = Math.PI * Math.pow(width, 2) * length; label = "Cylinder"; }
    else if (shape === "sphere") { volume = (4 / 3) * Math.PI * Math.pow(width, 3); label = "Sphere"; }
    else if (shape === "cone") { volume = (1 / 3) * Math.PI * Math.pow(width, 2) * length; label = "Cone"; }
    return {
      sections: [
        { id: "primary", values: [{ id: "volume", label: "VOLUME", value: `${formatNumber(volume, 2)} m³`, format: "text", primary: true, description: `${label} shape` }] },
      ],
      interpretation: `The volume of the ${label.toLowerCase()} is ${formatNumber(volume, 2)} cubic meters.`,
    };
  },
  content: { ...fin, summary: "The Volume Calculator computes volume for boxes, cylinders, spheres and cones." },
  relatedCalculators: ["area", "concrete", "gravel", "mulch"],
  seo: { title: "Volume Calculator – Box, Cylinder, Sphere", description: "Calculate the volume of boxes, cylinders, spheres and cones. Free, instant and accurate.", keywords: ["volume calculator", "cubic meters"], primaryIntent: "Calculate volume", secondaryIntents: ["Volume of box", "Volume of cylinder"] },
};

// ============ CONCRETE ============
export const concreteCalculator: CalculatorDefinition = {
  id: "concrete", slug: "concrete-calculator", name: "Concrete Calculator", category: "construction",
  shortDescription: "Calculate concrete needed for slabs, footings and columns.", icon: "layers", accent: "construction", popularity: 93,
  inputs: [
    { id: "length", label: "Length", type: "number", unit: "m", placeholder: "10", defaultValue: 10, validation: { required: true, min: 0 } },
    { id: "width", label: "Width", type: "number", unit: "m", placeholder: "5", defaultValue: 5, validation: { required: true, min: 0 } },
    { id: "depth", label: "Depth", type: "number", unit: "cm", placeholder: "15", defaultValue: 15, validation: { required: true, min: 0 } },
  ],
  calculate: (v) => {
    const length = parseNumber(v.length) ?? 0, width = parseNumber(v.width) ?? 0, depth = parseNumber(v.depth) ?? 0;
    const volume = length * width * (depth / 100);
    const bags = Math.ceil(volume * 1.54 * 6.25);
    return {
      sections: [
        { id: "primary", values: [{ id: "volume", label: "CONCRETE NEEDED", value: `${formatNumber(volume, 2)} m³`, format: "text", primary: true, description: `for slab` }] },
        { id: "details", title: "Material estimate", values: [{ id: "bags", label: "Cement bags (50kg)", value: `${bags} bags`, format: "text" }] },
      ],
      interpretation: `For a slab of ${length}m × ${width}m × ${depth}cm, you need approximately ${formatNumber(volume, 2)} m³ of concrete, about ${bags} bags of cement.`,
    };
  },
  content: { ...fin, summary: "The Concrete Calculator estimates concrete volume and cement bags for slabs." },
  relatedCalculators: ["volume", "area", "gravel", "mulch"],
  seo: { title: "Concrete Calculator – Estimate Concrete Needed", description: "Calculate concrete volume and cement bags for your project. Free, instant and accurate.", keywords: ["concrete calculator", "cement calculator"], primaryIntent: "Calculate concrete needed", secondaryIntents: ["Cement bags"] },
};

// ============ SQUARE FOOTAGE ============
export const squareFootageCalculator: CalculatorDefinition = {
  id: "square-footage", slug: "square-footage-calculator", name: "Square Footage Calculator", category: "construction",
  shortDescription: "Calculate the square footage of a room or space.", icon: "ruler", accent: "construction", popularity: 92,
  inputs: [
    { id: "length", label: "Length", type: "number", unit: "ft", placeholder: "20", defaultValue: 20, validation: { required: true, min: 0 } },
    { id: "width", label: "Width", type: "number", unit: "ft", placeholder: "15", defaultValue: 15, validation: { required: true, min: 0 } },
  ],
  calculate: (v) => {
    const length = parseNumber(v.length) ?? 0, width = parseNumber(v.width) ?? 0;
    const sqft = length * width;
    const sqm = sqft * 0.092903;
    return {
      sections: [
        { id: "primary", values: [{ id: "sqft", label: "SQUARE FOOTAGE", value: `${formatNumber(sqft, 2)} sq ft`, format: "text", primary: true, description: `= ${formatNumber(sqm, 2)} m²` }] },
      ],
      interpretation: `A space of ${length} ft × ${width} ft has ${formatNumber(sqft, 2)} square feet (${formatNumber(sqm, 2)} m²).`,
    };
  },
  content: { ...fin, summary: "The Square Footage Calculator computes the area of a room in square feet." },
  relatedCalculators: ["area", "flooring", "tile", "paint"],
  seo: { title: "Square Footage Calculator – Room Area in sq ft", description: "Calculate the square footage of any room or space. Free, instant and accurate.", keywords: ["square footage calculator", "sq ft calculator"], primaryIntent: "Calculate square footage", secondaryIntents: ["Room area"] },
};

// ============ ROOFING ============
export const roofingCalculator: CalculatorDefinition = {
  id: "roofing", slug: "roofing-calculator", name: "Roofing Calculator", category: "construction",
  shortDescription: "Estimate roofing materials needed for your roof.", icon: "home", accent: "construction", popularity: 91,
  inputs: [
    { id: "length", label: "Roof length", type: "number", unit: "m", placeholder: "12", defaultValue: 12, validation: { required: true, min: 0 } },
    { id: "width", label: "Roof width", type: "number", unit: "m", placeholder: "8", defaultValue: 8, validation: { required: true, min: 0 } },
    { id: "pitch", label: "Roof pitch", type: "number", unit: "°", placeholder: "30", defaultValue: 30, validation: { required: true, min: 0, max: 60 } },
  ],
  calculate: (v) => {
    const length = parseNumber(v.length) ?? 0, width = parseNumber(v.width) ?? 0, pitch = parseNumber(v.pitch) ?? 30;
    const factor = 1 / Math.cos((pitch * Math.PI) / 180);
    const area = length * width * factor;
    const sheets = Math.ceil(area / 2.5);
    return {
      sections: [
        { id: "primary", values: [{ id: "area", label: "ROOF AREA", value: `${formatNumber(area, 2)} m²`, format: "text", primary: true, description: `at ${pitch}° pitch` }] },
        { id: "details", title: "Material estimate", values: [{ id: "sheets", label: "Sheets needed", value: `${sheets} sheets`, format: "text" }] },
      ],
      interpretation: `A roof of ${length}m × ${width}m at ${pitch}° pitch has an area of about ${formatNumber(area, 2)} m², needing approximately ${sheets} sheets.`,
    };
  },
  content: { ...fin, summary: "The Roofing Calculator estimates roof area and material needs based on pitch." },
  relatedCalculators: ["area", "square-footage", "tile", "paint"],
  seo: { title: "Roofing Calculator – Estimate Roof Materials", description: "Calculate roof area and material needs. Free, instant and accurate.", keywords: ["roofing calculator", "roof area"], primaryIntent: "Estimate roofing materials", secondaryIntents: ["Roof area"] },
};

// ============ TILE ============
export const tileCalculator: CalculatorDefinition = {
  id: "tile", slug: "tile-calculator", name: "Tile Calculator", category: "construction",
  shortDescription: "Calculate how many tiles you need for a floor or wall.", icon: "grid", accent: "construction", popularity: 90,
  inputs: [
    { id: "length", label: "Floor length", type: "number", unit: "m", placeholder: "5", defaultValue: 5, validation: { required: true, min: 0 } },
    { id: "width", label: "Floor width", type: "number", unit: "m", placeholder: "4", defaultValue: 4, validation: { required: true, min: 0 } },
    { id: "tileSize", label: "Tile size", type: "dropdown", defaultValue: "60", options: [{ label: "30×30 cm", value: "30" }, { label: "45×45 cm", value: "45" }, { label: "60×60 cm", value: "60" }, { label: "80×80 cm", value: "80" }] },
  ],
  calculate: (v) => {
    const length = parseNumber(v.length) ?? 0, width = parseNumber(v.width) ?? 0, tileSize = parseNumber(v.tileSize) ?? 60;
    const area = length * width;
    const tileArea = Math.pow(tileSize / 100, 2);
    const tiles = Math.ceil(area / tileArea * 1.1);
    return {
      sections: [
        { id: "primary", values: [{ id: "tiles", label: "TILES NEEDED", value: `${tiles} tiles`, format: "text", primary: true, description: `for ${formatNumber(area, 2)} m² (10% waste)` }] },
      ],
      interpretation: `For a floor of ${length}m × ${width}m (${formatNumber(area, 2)} m²) with ${tileSize}×${tileSize} cm tiles, you need about ${tiles} tiles including 10% waste.`,
    };
  },
  content: { ...fin, summary: "The Tile Calculator estimates how many tiles you need including waste." },
  relatedCalculators: ["area", "flooring", "square-footage", "paint"],
  seo: { title: "Tile Calculator – How Many Tiles Do I Need?", description: "Calculate how many tiles you need for your floor or wall. Free, instant and accurate.", keywords: ["tile calculator", "tiles needed"], primaryIntent: "Calculate tiles needed", secondaryIntents: ["Floor tiles"] },
};

// ============ GRAVEL ============
export const gravelCalculator: CalculatorDefinition = {
  id: "gravel", slug: "gravel-calculator", name: "Gravel Calculator", category: "construction",
  shortDescription: "Calculate gravel needed for driveways and paths.", icon: "mountain", accent: "construction", popularity: 89,
  inputs: [
    { id: "length", label: "Length", type: "number", unit: "m", placeholder: "10", defaultValue: 10, validation: { required: true, min: 0 } },
    { id: "width", label: "Width", type: "number", unit: "m", placeholder: "3", defaultValue: 3, validation: { required: true, min: 0 } },
    { id: "depth", label: "Depth", type: "number", unit: "cm", placeholder: "10", defaultValue: 10, validation: { required: true, min: 0 } },
  ],
  calculate: (v) => {
    const length = parseNumber(v.length) ?? 0, width = parseNumber(v.width) ?? 0, depth = parseNumber(v.depth) ?? 0;
    const volume = length * width * (depth / 100);
    const tonnes = volume * 1.6;
    return {
      sections: [
        { id: "primary", values: [{ id: "volume", label: "GRAVEL NEEDED", value: `${formatNumber(volume, 2)} m³`, format: "text", primary: true, description: `≈ ${formatNumber(tonnes, 1)} tonnes` }] },
      ],
      interpretation: `For a ${length}m × ${width}m area at ${depth}cm depth, you need about ${formatNumber(volume, 2)} m³ (${formatNumber(tonnes, 1)} tonnes) of gravel.`,
    };
  },
  content: { ...fin, summary: "The Gravel Calculator estimates gravel volume and weight for driveways and paths." },
  relatedCalculators: ["volume", "mulch", "concrete", "area"],
  seo: { title: "Gravel Calculator – Estimate Gravel Needed", description: "Calculate gravel volume and weight for your project. Free, instant and accurate.", keywords: ["gravel calculator", "gravel needed"], primaryIntent: "Calculate gravel needed", secondaryIntents: ["Driveway gravel"] },
};

// ============ MULCH ============
export const mulchCalculator: CalculatorDefinition = {
  id: "mulch", slug: "mulch-calculator", name: "Mulch Calculator", category: "construction",
  shortDescription: "Calculate mulch needed for garden beds.", icon: "leaf", accent: "construction", popularity: 88,
  inputs: [
    { id: "length", label: "Length", type: "number", unit: "m", placeholder: "5", defaultValue: 5, validation: { required: true, min: 0 } },
    { id: "width", label: "Width", type: "number", unit: "m", placeholder: "3", defaultValue: 3, validation: { required: true, min: 0 } },
    { id: "depth", label: "Depth", type: "number", unit: "cm", placeholder: "5", defaultValue: 5, validation: { required: true, min: 0 } },
  ],
  calculate: (v) => {
    const length = parseNumber(v.length) ?? 0, width = parseNumber(v.width) ?? 0, depth = parseNumber(v.depth) ?? 0;
    const volume = length * width * (depth / 100);
    const bags = Math.ceil(volume / 0.05);
    return {
      sections: [
        { id: "primary", values: [{ id: "volume", label: "MULCH NEEDED", value: `${formatNumber(volume, 2)} m³`, format: "text", primary: true, description: `≈ ${bags} bags (50L)` }] },
      ],
      interpretation: `For a ${length}m × ${width}m garden bed at ${depth}cm depth, you need about ${formatNumber(volume, 2)} m³ of mulch, roughly ${bags} bags.`,
    };
  },
  content: { ...fin, summary: "The Mulch Calculator estimates mulch volume and bags for garden beds." },
  relatedCalculators: ["gravel", "volume", "area", "concrete"],
  seo: { title: "Mulch Calculator – Estimate Mulch Needed", description: "Calculate mulch volume and bags for your garden. Free, instant and accurate.", keywords: ["mulch calculator", "mulch needed"], primaryIntent: "Calculate mulch needed", secondaryIntents: ["Garden mulch"] },
};

// ============ PAINT ============
export const paintCalculator: CalculatorDefinition = {
  id: "paint", slug: "paint-calculator", name: "Paint Calculator", category: "construction",
  shortDescription: "Calculate how much paint you need for a room.", icon: "paintbrush", accent: "construction", popularity: 87,
  inputs: [
    { id: "length", label: "Room length", type: "number", unit: "m", placeholder: "5", defaultValue: 5, validation: { required: true, min: 0 } },
    { id: "width", label: "Room width", type: "number", unit: "m", placeholder: "4", defaultValue: 4, validation: { required: true, min: 0 } },
    { id: "height", label: "Wall height", type: "number", unit: "m", placeholder: "3", defaultValue: 3, validation: { required: true, min: 0 } },
    { id: "coats", label: "Coats", type: "number", placeholder: "2", defaultValue: 2, validation: { required: true, min: 1, max: 5 } },
  ],
  calculate: (v) => {
    const length = parseNumber(v.length) ?? 0, width = parseNumber(v.width) ?? 0, height = parseNumber(v.height) ?? 0, coats = parseNumber(v.coats) ?? 2;
    const wallArea = 2 * (length + width) * height;
    const totalArea = wallArea * coats;
    const litres = totalArea / 10;
    const cans = Math.ceil(litres / 4);
    return {
      sections: [
        { id: "primary", values: [{ id: "litres", label: "PAINT NEEDED", value: `${formatNumber(litres, 1)} litres`, format: "text", primary: true, description: `for ${coats} coats` }] },
        { id: "details", title: "Paint estimate", values: [{ id: "cans", label: "4L cans", value: `${cans} cans`, format: "text" }] },
      ],
      interpretation: `For a ${length}m × ${width}m room with ${height}m walls and ${coats} coats, you need about ${formatNumber(litres, 1)} litres of paint (${cans} × 4L cans).`,
    };
  },
  content: { ...fin, summary: "The Paint Calculator estimates paint needed for a room based on wall area." },
  relatedCalculators: ["area", "square-footage", "tile", "flooring"],
  seo: { title: "Paint Calculator – How Much Paint Do I Need?", description: "Calculate how much paint you need for any room. Free, instant and accurate.", keywords: ["paint calculator", "paint needed"], primaryIntent: "Calculate paint needed", secondaryIntents: ["Room paint"] },
};

// ============ FLOORING ============
export const flooringCalculator: CalculatorDefinition = {
  id: "flooring", slug: "flooring-calculator", name: "Flooring Calculator", category: "construction",
  shortDescription: "Calculate flooring material needed for a room.", icon: "layout-grid", accent: "construction", popularity: 86,
  inputs: [
    { id: "length", label: "Room length", type: "number", unit: "m", placeholder: "6", defaultValue: 6, validation: { required: true, min: 0 } },
    { id: "width", label: "Room width", type: "number", unit: "m", placeholder: "4", defaultValue: 4, validation: { required: true, min: 0 } },
    { id: "waste", label: "Waste %", type: "percentage", unit: "%", placeholder: "10", defaultValue: 10, validation: { required: true, min: 0, max: 30 } },
  ],
  calculate: (v) => {
    const length = parseNumber(v.length) ?? 0, width = parseNumber(v.width) ?? 0, waste = parseNumber(v.waste) ?? 10;
    const area = length * width;
    const total = area * (1 + waste / 100);
    return {
      sections: [
        { id: "primary", values: [{ id: "area", label: "FLOORING NEEDED", value: `${formatNumber(total, 2)} m²`, format: "text", primary: true, description: `including ${waste}% waste` }] },
        { id: "details", title: "Flooring details", values: [{ id: "area", label: "Room area", value: `${formatNumber(area, 2)} m²`, format: "text" }] },
      ],
      interpretation: `For a ${length}m × ${width}m room (${formatNumber(area, 2)} m²), you need ${formatNumber(total, 2)} m² of flooring including ${waste}% waste.`,
    };
  },
  content: { ...fin, summary: "The Flooring Calculator estimates flooring material including waste." },
  relatedCalculators: ["tile", "area", "square-footage", "paint"],
  seo: { title: "Flooring Calculator – Estimate Flooring Needed", description: "Calculate flooring material needed for any room. Free, instant and accurate.", keywords: ["flooring calculator", "flooring needed"], primaryIntent: "Calculate flooring needed", secondaryIntents: ["Room flooring"] },
};

// ============ FENCE ============
export const fenceCalculator: CalculatorDefinition = {
  id: "fence", slug: "fence-calculator", name: "Fence Calculator", category: "construction",
  shortDescription: "Calculate fencing materials needed for your property.", icon: "fence", accent: "construction", popularity: 85,
  inputs: [
    { id: "length", label: "Fence length", type: "number", unit: "m", placeholder: "30", defaultValue: 30, validation: { required: true, min: 0 } },
    { id: "height", label: "Fence height", type: "number", unit: "m", placeholder: "1.8", defaultValue: 1.8, validation: { required: true, min: 0 } },
    { id: "postSpacing", label: "Post spacing", type: "number", unit: "m", placeholder: "2.4", defaultValue: 2.4, validation: { required: true, min: 0.5 } },
  ],
  calculate: (v) => {
    const length = parseNumber(v.length) ?? 0, height = parseNumber(v.height) ?? 0, spacing = parseNumber(v.postSpacing) ?? 2.4;
    const posts = Math.ceil(length / spacing) + 1;
    const rails = Math.ceil(length / 3) * 2;
    const area = length * height;
    return {
      sections: [
        { id: "primary", values: [{ id: "posts", label: "POSTS NEEDED", value: `${posts} posts`, format: "text", primary: true, description: `for ${length}m fence` }] },
        { id: "details", title: "Fence materials", values: [{ id: "rails", label: "Rails needed", value: `${rails} rails`, format: "text" }, { id: "area", label: "Fence area", value: `${formatNumber(area, 2)} m²`, format: "text" }] },
      ],
      interpretation: `For a ${length}m fence at ${height}m height with ${spacing}m post spacing, you need about ${posts} posts and ${rails} rails.`,
    };
  },
  content: { ...fin, summary: "The Fence Calculator estimates posts, rails and area for fencing." },
  relatedCalculators: ["area", "square-footage", "concrete", "gravel"],
  seo: { title: "Fence Calculator – Estimate Fencing Materials", description: "Calculate posts, rails and area for your fence. Free, instant and accurate.", keywords: ["fence calculator", "fencing materials"], primaryIntent: "Estimate fencing materials", secondaryIntents: ["Fence posts"] },
};

// ============ STAIR ============
export const stairCalculator: CalculatorDefinition = {
  id: "stair", slug: "stair-calculator", name: "Stair Calculator", category: "construction",
  shortDescription: "Calculate stair dimensions - risers, treads and stringers.", icon: "stairs", accent: "construction", popularity: 84,
  inputs: [
    { id: "height", label: "Total rise", type: "number", unit: "cm", placeholder: "280", defaultValue: 280, validation: { required: true, min: 0 } },
    { id: "run", label: "Total run", type: "number", unit: "cm", placeholder: "300", defaultValue: 300, validation: { required: true, min: 0 } },
  ],
  calculate: (v) => {
    const height = parseNumber(v.height) ?? 0, run = parseNumber(v.run) ?? 0;
    const riser = 18;
    const steps = Math.ceil(height / riser);
    const actualRiser = height / steps;
    const tread = run / (steps - 1);
    return {
      sections: [
        { id: "primary", values: [{ id: "steps", label: "NUMBER OF STEPS", value: `${steps} steps`, format: "text", primary: true, description: `with ${formatNumber(actualRiser, 1)} cm risers` }] },
        { id: "details", title: "Stair dimensions", values: [{ id: "tread", label: "Tread depth", value: `${formatNumber(tread, 1)} cm`, format: "text" }] },
      ],
      interpretation: `For a total rise of ${height} cm, you need ${steps} steps with ${formatNumber(actualRiser, 1)} cm risers and ${formatNumber(tread, 1)} cm treads.`,
    };
  },
  content: { ...fin, summary: "The Stair Calculator computes risers, treads and step count for stairs." },
  relatedCalculators: ["area", "volume", "concrete", "flooring"],
  seo: { title: "Stair Calculator – Risers, Treads & Steps", description: "Calculate stair dimensions - risers, treads and step count. Free, instant and accurate.", keywords: ["stair calculator", "stair dimensions"], primaryIntent: "Calculate stair dimensions", secondaryIntents: ["Riser tread"] },
};