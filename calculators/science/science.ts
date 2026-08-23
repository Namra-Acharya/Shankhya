/**
 * Science & Engineering Calculators - Ohm's Law, Voltage Drop, Power, Resistor, Electrical Energy, Density, Speed, Distance, Force, Pressure, Temperature
 */
import type { CalculatorDefinition } from "@/lib/calculators/types";
import { formatNumber } from "@/lib/utils/format";
import { parseNumber } from "@/lib/utils/validation";

const fin = {
  summary: "Calculate scientific and engineering values with clear, accurate results.",
  howToUse: [
    "Enter the known values for the calculation.",
    "Check that all values use consistent units.",
    "Press Calculate to compute the result instantly.",
    "Review the result and the formula shown below it.",
    "Change the inputs and recalculate to explore different scenarios.",
  ],
  interpretation: "The result reflects the standard scientific relationship between the values you entered.",
  formula: "",
  variables: [] as { symbol: string; name: string; description: string }[],
  example: undefined,
  factors: [] as string[],
  edgeCases: [] as string[],
  commonMistakes: [
    "Using mismatched units, for example mixing meters with centimeters.",
    "Entering a value in the wrong field when the relationship needs the other quantity.",
    "Interpreting a derived value as if it were a directly measured quantity.",
  ],
  assumptions: [
    "The formulas used are the standard scientific relationships for these quantities.",
    "Ideal conditions are assumed; real-world results can differ because of additional factors.",
  ],
  limitations: [
    "This tool provides estimates based only on the values you enter.",
    "It does not include every real-world factor such as temperature, friction, or efficiency loss unless your inputs capture them.",
  ],
  faqs: [] as { question: string; answer: string }[],
};

export const scienceContent = fin;

// ============ OHM'S LAW ============
export const ohmsLawCalculator: CalculatorDefinition = {
  id: "ohms-law", slug: "ohms-law-calculator", name: "Ohm's Law Calculator", category: "science",
  shortDescription: "Calculate voltage, current, resistance or power.", icon: "zap", accent: "science", popularity: 95,
  inputs: [
    { id: "voltage", label: "Voltage (V)", type: "number", unit: "V", placeholder: "12", defaultValue: 12, validation: { required: true, min: 0 } },
    { id: "current", label: "Current (I)", type: "number", unit: "A", placeholder: "2", defaultValue: 2, validation: { required: true, min: 0 } },
  ],
  calculate: (v) => {
    const voltage = parseNumber(v.voltage) ?? 0, current = parseNumber(v.current) ?? 0;
    const resistance = current > 0 ? voltage / current : 0;
    const power = voltage * current;
    return {
      sections: [
        { id: "primary", values: [{ id: "resistance", label: "RESISTANCE", value: `${formatNumber(resistance, 2)} Ω`, format: "text", primary: true, description: `R = V / I` }] },
        { id: "details", title: "Other values", values: [{ id: "power", label: "Power", value: `${formatNumber(power, 2)} W`, format: "text" }] },
      ],
      interpretation: `With ${voltage} V and ${current} A, resistance is ${formatNumber(resistance, 2)} Ω and power is ${formatNumber(power, 2)} W.`,
    };
  },
  content: {
    ...fin,
    summary:
      "The Ohm's Law Calculator computes resistance and power from the voltage and current you enter. It is a practical tool for electronics students, hobbyists, and technicians who need to verify circuit values quickly.",
    howToUse: [
      "Enter the voltage across the component in volts (V).",
      "Enter the current flowing through the component in amperes (A).",
      "Press Calculate to see the resistance in ohms (Ω) and the power in watts (W).",
      "Review the formula shown with the result to confirm the relationship.",
      "Adjust either input and recalculate to explore how resistance and power change.",
    ],
    interpretation:
      "Resistance is the ratio of voltage to current: R = V ÷ I. A higher voltage with the same current means more resistance, while a higher current with the same voltage means less resistance. Power is the product of voltage and current, representing the rate at which electrical energy is converted to heat or work.",
    formula: "R = V / I\n\nP = V × I\n\nWhere:\nR = Resistance (Ω)\nV = Voltage (V)\nI = Current (A)\nP = Power (W)",
    variables: [
      { symbol: "V", name: "Voltage", description: "The electrical potential difference across the component, measured in volts." },
      { symbol: "I", name: "Current", description: "The flow of electric charge through the component, measured in amperes." },
      { symbol: "R", name: "Resistance", description: "The opposition to current flow, measured in ohms." },
      { symbol: "P", name: "Power", description: "The rate of energy conversion, measured in watts." },
    ],
    example: {
      title: "Example: 12 V across a 2 A circuit",
      inputs: { Voltage: "12 V", Current: "2 A" },
      steps: [
        "Resistance = 12 ÷ 2 = 6 Ω",
        "Power = 12 × 2 = 24 W",
        "The component resists 6 Ω and dissipates 24 W.",
      ],
      result: "R = 6 Ω, P = 24 W",
    },
    factors: [
      "Resistance depends on the material, length, and cross-sectional area of the conductor.",
      "Temperature changes resistance in most materials — metals increase resistance when hot.",
      "Power dissipation determines how much heat a component must handle.",
    ],
    edgeCases: [
      "If current is zero, resistance is undefined (division by zero) — the calculator returns 0.",
      "Very small currents produce very large resistance values, which may be unrealistic for real components.",
      "AC circuits with reactance (capacitors or inductors) do not follow simple Ohm's Law for impedance.",
    ],
    commonMistakes: [
      "Using milliamps (mA) without converting to amps — 500 mA is 0.5 A, not 500 A.",
      "Confusing voltage drop across a component with the supply voltage.",
      "Applying Ohm's Law to AC circuits with reactive components as if they were purely resistive.",
    ],
    assumptions: [
      "The circuit is purely resistive (DC or resistive AC).",
      "Voltage and current are measured at the same point in the circuit.",
      "The component obeys Ohm's Law linearly over the operating range.",
    ],
    limitations: [
      "Does not account for reactance, inductance, or capacitance.",
      "Assumes ideal conditions without temperature effects or wire resistance.",
      "Real components may have non-linear voltage-current relationships.",
    ],
    faqs: [
      {
        question: "What is Ohm's Law?",
        answer:
          "Ohm's Law states that the current through a conductor between two points is directly proportional to the voltage across the points and inversely proportional to the resistance. It is expressed as V = I × R.",
      },
      {
        question: "How do I calculate resistance if I know voltage and current?",
        answer:
          "Divide the voltage by the current: R = V ÷ I. For example, 12 V ÷ 2 A = 6 Ω.",
      },
      {
        question: "Why does power matter in a circuit?",
        answer:
          "Power tells you how much energy the component converts per second. If a resistor cannot dissipate the power as heat, it will overheat and fail. Always check the power rating of components.",
      },
      {
        question: "Does Ohm's Law work for AC circuits?",
        answer:
          "For purely resistive AC circuits, yes. For circuits with capacitors or inductors, you need impedance (Z) instead of resistance, and the relationship becomes V = I × Z.",
      },
    ],
  },
  relatedCalculators: ["power", "voltage-drop", "resistor", "electrical-energy"],
  seo: { title: "Ohm's Law Calculator – V, I, R, P", description: "Calculate voltage, current, resistance and power using Ohm's Law. Free, instant and accurate.", keywords: ["ohms law calculator", "ohm's law"], primaryIntent: "Calculate using Ohm's Law", secondaryIntents: ["Voltage current resistance"] },
};

// ============ VOLTAGE DROP ============
export const voltageDropCalculator: CalculatorDefinition = {
  id: "voltage-drop", slug: "voltage-drop-calculator", name: "Voltage Drop Calculator", category: "science",
  shortDescription: "Calculate voltage drop in electrical circuits.", icon: "trending-down", accent: "science", popularity: 94,
  inputs: [
    { id: "current", label: "Current", type: "number", unit: "A", placeholder: "10", defaultValue: 10, validation: { required: true, min: 0 } },
    { id: "length", label: "Cable length", type: "number", unit: "m", placeholder: "50", defaultValue: 50, validation: { required: true, min: 0 } },
    { id: "resistance", label: "Resistance per meter", type: "number", unit: "Ω/m", placeholder: "0.01", defaultValue: 0.01, validation: { required: true, min: 0 } },
  ],
  calculate: (v) => {
    const current = parseNumber(v.current) ?? 0, length = parseNumber(v.length) ?? 0, resistance = parseNumber(v.resistance) ?? 0;
    const drop = 2 * current * length * resistance;
    const pct = 230 > 0 ? (drop / 230) * 100 : 0;
    return {
      sections: [
        { id: "primary", values: [{ id: "drop", label: "VOLTAGE DROP", value: `${formatNumber(drop, 2)} V`, format: "text", primary: true, description: `${formatNumber(pct, 1)}% of 230V` }] },
      ],
      interpretation: `With ${current} A over ${length} m of cable, the voltage drop is ${formatNumber(drop, 2)} V (${formatNumber(pct, 1)}%).`,
    };
  },
  content: {
    ...fin,
    summary:
      "The Voltage Drop Calculator estimates how much voltage is lost along an electrical cable due to its resistance. It is essential for electricians, engineers, and DIY installers who need to ensure appliances receive enough voltage to operate correctly.",
    howToUse: [
      "Enter the current flowing through the cable in amperes (A).",
      "Enter the one-way cable length in meters (m).",
      "Enter the resistance per meter of the cable in ohms per meter (Ω/m).",
      "Press Calculate to see the total voltage drop in volts and as a percentage of a 230 V supply.",
      "Compare the result with the recommended maximum drop (usually 3–5% for lighting and 5% for power circuits).",
    ],
    interpretation:
      "The voltage drop is the product of the current, the total cable length (there and back, hence the factor of 2), and the resistance per meter. A larger drop means the load receives less voltage, which can cause dim lights, slow motors, or equipment malfunction. The percentage is calculated against a 230 V reference supply.",
    formula: "Voltage Drop = 2 × I × L × R\n\nWhere:\nI = Current (A)\nL = One-way cable length (m)\nR = Resistance per meter (Ω/m)\n\nThe factor of 2 accounts for the outbound and return conductors.",
    variables: [
      { symbol: "I", name: "Current", description: "The current flowing through the cable, measured in amperes." },
      { symbol: "L", name: "Length", description: "The one-way length of the cable run, measured in meters." },
      { symbol: "R", name: "Resistance per meter", description: "The resistance of the cable per meter of length, measured in ohms per meter." },
    ],
    example: {
      title: "Example: 10 A over 50 m of cable at 0.01 Ω/m",
      inputs: { Current: "10 A", Length: "50 m", "Resistance per meter": "0.01 Ω/m" },
      steps: [
        "Voltage drop = 2 × 10 × 50 × 0.01",
        "= 2 × 10 × 0.5",
        "= 10 V",
        "As a percentage of 230 V: (10 ÷ 230) × 100 = 4.3%",
      ],
      result: "10 V drop (4.3% of 230 V)",
    },
    factors: [
      "Longer cable runs produce larger voltage drops.",
      "Thicker cables (lower resistance per meter) reduce voltage drop.",
      "Higher currents increase the voltage drop proportionally.",
      "The factor of 2 accounts for both the live and return conductors in a single-phase circuit.",
    ],
    edgeCases: [
      "If current or length is zero, the voltage drop is zero.",
      "If resistance per meter is zero (superconductor), there is no drop.",
      "Three-phase circuits have a different factor (√3 instead of 2) — this calculator assumes single-phase.",
    ],
    commonMistakes: [
      "Forgetting the factor of 2 for the return conductor.",
      "Using the total cable length instead of the one-way length.",
      "Entering resistance in ohms instead of ohms per meter.",
      "Comparing the drop against the wrong supply voltage.",
    ],
    assumptions: [
      "The circuit is single-phase AC or DC.",
      "The cable resistance is uniform along its length.",
      "The supply voltage is 230 V for the percentage calculation.",
      "Temperature effects on resistance are ignored.",
    ],
    limitations: [
      "Does not account for three-phase circuits (which use a √3 factor).",
      "Ignores the effect of temperature on cable resistance.",
      "Assumes a fixed 230 V reference; other supply voltages will give different percentages.",
      "Does not include connection resistance or other losses in the circuit.",
    ],
    faqs: [
      {
        question: "What is an acceptable voltage drop?",
        answer:
          "For most installations, a voltage drop of 3% or less for lighting and 5% or less for power circuits is considered acceptable. Higher drops can cause equipment to underperform or fail.",
      },
      {
        question: "Why is the factor 2 used in the formula?",
        answer:
          "In a single-phase circuit, current travels out along the live conductor and returns along the neutral conductor. Both conductors contribute to the total resistance, so the cable length is counted twice.",
      },
      {
        question: "How can I reduce voltage drop?",
        answer:
          "Use a thicker cable with lower resistance per meter, shorten the cable run, or reduce the current. Any of these will lower the voltage drop.",
      },
      {
        question: "Does this calculator work for three-phase circuits?",
        answer:
          "No. Three-phase circuits use a factor of √3 instead of 2. This calculator is designed for single-phase or DC circuits.",
      },
    ],
  },
  relatedCalculators: ["ohms-law", "power", "resistor", "electrical-energy"],
  seo: { title: "Voltage Drop Calculator – Cable Voltage Loss", description: "Calculate voltage drop in electrical circuits. Free, instant and accurate.", keywords: ["voltage drop calculator", "cable voltage drop"], primaryIntent: "Calculate voltage drop", secondaryIntents: ["Cable loss"] },
};

// ============ POWER ============
export const powerCalculator: CalculatorDefinition = {
  id: "power", slug: "power-calculator", name: "Power Calculator", category: "science",
  shortDescription: "Calculate electrical power from voltage and current.", icon: "zap", accent: "science", popularity: 93,
  inputs: [
    { id: "voltage", label: "Voltage", type: "number", unit: "V", placeholder: "230", defaultValue: 230, validation: { required: true, min: 0 } },
    { id: "current", label: "Current", type: "number", unit: "A", placeholder: "5", defaultValue: 5, validation: { required: true, min: 0 } },
  ],
  calculate: (v) => {
    const voltage = parseNumber(v.voltage) ?? 0, current = parseNumber(v.current) ?? 0;
    const power = voltage * current;
    const energy = power * 1;
    return {
      sections: [
        { id: "primary", values: [{ id: "power", label: "POWER", value: `${formatNumber(power, 2)} W`, format: "text", primary: true, description: `P = V × I` }] },
        { id: "details", title: "Energy", values: [{ id: "energy", label: "Energy per hour", value: `${formatNumber(energy, 2)} Wh`, format: "text" }] },
      ],
      interpretation: `With ${voltage} V and ${current} A, the power is ${formatNumber(power, 2)} W.`,
    };
  },
  content: {
    ...fin,
    summary:
      "The Power Calculator computes electrical power from voltage and current. It is useful for sizing appliances, checking circuit loads, and understanding how much energy a device consumes.",
    howToUse: [
      "Enter the voltage in volts (V).",
      "Enter the current in amperes (A).",
      "Press Calculate to see the power in watts (W) and the energy used per hour in watt-hours (Wh).",
      "Review the formula P = V × I shown with the result.",
      "Adjust the inputs to compare different devices or operating conditions.",
    ],
    interpretation:
      "Power is the rate at which electrical energy is converted into another form, such as heat, light, or motion. It is the product of voltage and current. The energy per hour figure tells you how much energy the device consumes if it runs continuously for one hour.",
    formula: "P = V × I\n\nWhere:\nP = Power (W)\nV = Voltage (V)\nI = Current (A)\n\nEnergy per hour = P × 1 hour (Wh)",
    variables: [
      { symbol: "V", name: "Voltage", description: "The electrical potential difference, measured in volts." },
      { symbol: "I", name: "Current", description: "The flow of electric charge, measured in amperes." },
      { symbol: "P", name: "Power", description: "The rate of energy conversion, measured in watts." },
    ],
    example: {
      title: "Example: 230 V and 5 A",
      inputs: { Voltage: "230 V", Current: "5 A" },
      steps: [
        "Power = 230 × 5 = 1150 W",
        "Energy per hour = 1150 Wh = 1.15 kWh",
        "Running this device for 1 hour consumes 1.15 kWh.",
      ],
      result: "P = 1150 W (1.15 kWh per hour)",
    },
    factors: [
      "Higher voltage or current increases power consumption.",
      "Power ratings on appliances indicate their maximum consumption.",
      "Energy cost depends on both power and how long the device runs.",
    ],
    edgeCases: [
      "If voltage or current is zero, power is zero.",
      "AC circuits with power factor less than 1 will have lower real power than V × I suggests.",
      "Very high power values may indicate a circuit overload risk.",
    ],
    commonMistakes: [
      "Using peak values instead of RMS values for AC circuits.",
      "Forgetting the power factor in AC circuits.",
      "Confusing watts (power) with watt-hours (energy).",
    ],
    assumptions: [
      "The circuit is DC or purely resistive AC.",
      "Voltage and current are in phase (power factor = 1).",
      "The values are steady, not transient peaks.",
    ],
    limitations: [
      "Does not account for power factor in AC circuits.",
      "Assumes constant voltage and current.",
      "Real devices may draw different power at different times.",
    ],
    faqs: [
      {
        question: "What is the difference between watts and watt-hours?",
        answer:
          "Watts measure power — the rate of energy use at a moment. Watt-hours measure energy — the total amount used over time. A 100 W bulb running for 2 hours uses 200 Wh of energy.",
      },
      {
        question: "How do I calculate power in an AC circuit?",
        answer:
          "For AC circuits, real power is P = V × I × power factor. The power factor accounts for the phase difference between voltage and current caused by inductive or capacitive loads.",
      },
      {
        question: "Why does my appliance have a power rating?",
        answer:
          "The power rating tells you the maximum rate at which the appliance converts electrical energy. It helps you size circuits, choose the right cable, and estimate running costs.",
      },
    ],
  },
  relatedCalculators: ["ohms-law", "voltage-drop", "electrical-energy", "resistor"],
  seo: { title: "Power Calculator – Electrical Power (W)", description: "Calculate electrical power from voltage and current. Free, instant and accurate.", keywords: ["power calculator", "electrical power"], primaryIntent: "Calculate electrical power", secondaryIntents: ["Watts calculator"] },
};

// ============ RESISTOR ============
export const resistorCalculator: CalculatorDefinition = {
  id: "resistor", slug: "resistor-calculator", name: "Resistor Calculator", category: "science",
  shortDescription: "Calculate resistance from color bands or values.", icon: "circle", accent: "science", popularity: 92,
  inputs: [
    { id: "band1", label: "First band", type: "dropdown", defaultValue: "red", options: [{ label: "Black (0)", value: "0" }, { label: "Brown (1)", value: "1" }, { label: "Red (2)", value: "2" }, { label: "Orange (3)", value: "3" }, { label: "Yellow (4)", value: "4" }, { label: "Green (5)", value: "5" }, { label: "Blue (6)", value: "6" }, { label: "Violet (7)", value: "7" }, { label: "Grey (8)", value: "8" }, { label: "White (9)", value: "9" }] },
    { id: "band2", label: "Second band", type: "dropdown", defaultValue: "red", options: [{ label: "Black (0)", value: "0" }, { label: "Brown (1)", value: "1" }, { label: "Red (2)", value: "2" }, { label: "Orange (3)", value: "3" }, { label: "Yellow (4)", value: "4" }, { label: "Green (5)", value: "5" }, { label: "Blue (6)", value: "6" }, { label: "Violet (7)", value: "7" }, { label: "Grey (8)", value: "8" }, { label: "White (9)", value: "9" }] },
    { id: "multiplier", label: "Multiplier", type: "dropdown", defaultValue: "2", options: [{ label: "×1 (Black)", value: "0" }, { label: "×10 (Brown)", value: "1" }, { label: "×100 (Red)", value: "2" }, { label: "×1k (Orange)", value: "3" }, { label: "×10k (Yellow)", value: "4" }, { label: "×100k (Green)", value: "5" }, { label: "×1M (Blue)", value: "6" }] },
  ],
  calculate: (v) => {
    const b1 = parseNumber(v.band1) ?? 0, b2 = parseNumber(v.band2) ?? 0, mult = parseNumber(v.multiplier) ?? 0;
    const value = (b1 * 10 + b2) * Math.pow(10, mult);
    return {
      sections: [
        { id: "primary", values: [{ id: "value", label: "RESISTANCE", value: `${formatNumber(value, 0)} Ω`, format: "text", primary: true, description: `from color bands` }] },
      ],
      interpretation: `The resistor value is ${formatNumber(value, 0)} Ω based on the selected color bands.`,
    };
  },
  content: {
    ...fin,
    summary:
      "The Resistor Calculator decodes the resistance value from the color bands printed on a resistor. It is a handy tool for electronics students, hobbyists, and technicians who need to identify resistor values quickly without memorizing the color code.",
    howToUse: [
      "Select the color of the first significant digit band.",
      "Select the color of the second significant digit band.",
      "Select the color of the multiplier band.",
      "Press Calculate to see the decoded resistance value in ohms.",
      "Use the result to verify the resistor matches your circuit requirement.",
    ],
    interpretation:
      "The first two bands represent the first two digits of the resistance value. The multiplier band determines the power of ten applied to those digits. For example, red-red-red means 2-2 with a ×100 multiplier, giving 2,200 Ω (2.2 kΩ).",
    formula: "Resistance = (Digit1 × 10 + Digit2) × 10^Multiplier\n\nColor code:\nBlack = 0, Brown = 1, Red = 2, Orange = 3, Yellow = 4\nGreen = 5, Blue = 6, Violet = 7, Grey = 8, White = 9",
    variables: [
      { symbol: "D1", name: "First digit", description: "The first significant digit from the first color band." },
      { symbol: "D2", name: "Second digit", description: "The second significant digit from the second color band." },
      { symbol: "M", name: "Multiplier", description: "The power of ten applied to the two-digit number." },
    ],
    example: {
      title: "Example: Red-Red-Red bands",
      inputs: { "First band": "Red (2)", "Second band": "Red (2)", Multiplier: "×100 (Red)" },
      steps: [
        "First digit = 2 (Red)",
        "Second digit = 2 (Red)",
        "Two-digit number = 22",
        "Multiplier = ×100",
        "Resistance = 22 × 100 = 2,200 Ω = 2.2 kΩ",
      ],
      result: "2,200 Ω (2.2 kΩ)",
    },
    factors: [
      "The tolerance band (usually gold or silver) indicates how much the actual resistance can vary from the stated value.",
      "Standard resistor values follow the E-series (E12, E24, etc.) for preferred numbers.",
      "Surface-mount resistors use a numeric code instead of color bands.",
    ],
    edgeCases: [
      "Black as the first band is unusual but valid — it gives a leading zero.",
      "A multiplier of black (×1) means the resistance is just the two-digit number.",
      "Four-band and five-band resistors have additional tolerance and precision bands.",
    ],
    commonMistakes: [
      "Reading the bands from the wrong end of the resistor.",
      "Confusing the multiplier band with a tolerance band.",
      "Forgetting that the multiplier is a power of ten, not a direct multiplication.",
    ],
    assumptions: [
      "The resistor uses the standard 4-band color code.",
      "The bands are read from left to right with the tolerance band on the right.",
      "The color code follows the standard IEC 60062 convention.",
    ],
    limitations: [
      "Does not decode tolerance or temperature coefficient bands.",
      "Assumes the standard 4-band format; 5-band and 6-band resistors are not supported.",
      "Color perception differences can lead to misreading bands.",
    ],
    faqs: [
      {
        question: "How do I read a resistor color code?",
        answer:
          "Read the bands from left to right. The first two bands are the first two digits, the third band is the multiplier (power of ten), and the fourth band (if present) is the tolerance.",
      },
      {
        question: "What does the tolerance band mean?",
        answer:
          "The tolerance band (gold = ±5%, silver = ±10%) indicates how much the actual resistance can vary from the stated value. A 100 Ω resistor with ±5% tolerance can be anywhere from 95 Ω to 105 Ω.",
      },
      {
        question: "Why are there standard resistor values?",
        answer:
          "Standard values follow the E-series, which uses logarithmic spacing so that any required resistance can be found within a small tolerance. This reduces the number of different values manufacturers need to produce.",
      },
    ],
  },
  relatedCalculators: ["ohms-law", "power", "voltage-drop", "electrical-energy"],
  seo: { title: "Resistor Calculator – Color Band Decoder", description: "Decode resistor values from color bands. Free, instant and accurate.", keywords: ["resistor calculator", "resistor color code"], primaryIntent: "Decode resistor value", secondaryIntents: ["Color code"] },
};

// ============ ELECTRICAL ENERGY ============
export const electricalEnergyCalculator: CalculatorDefinition = {
  id: "electrical-energy", slug: "electrical-energy-calculator", name: "Electrical Energy Calculator", category: "science",
  shortDescription: "Calculate electrical energy consumption and cost.", icon: "plug", accent: "science", popularity: 91,
  inputs: [
    { id: "power", label: "Power", type: "number", unit: "W", placeholder: "1000", defaultValue: 1000, validation: { required: true, min: 0 } },
    { id: "hours", label: "Hours per day", type: "number", unit: "h", placeholder: "5", defaultValue: 5, validation: { required: true, min: 0 } },
    { id: "days", label: "Days", type: "number", placeholder: "30", defaultValue: 30, validation: { required: true, min: 1 } },
    { id: "rate", label: "Rate per kWh", type: "currency", unit: "₹", placeholder: "8", defaultValue: 8, validation: { required: true, min: 0 } },
  ],
  calculate: (v) => {
    const power = parseNumber(v.power) ?? 0, hours = parseNumber(v.hours) ?? 0, days = parseNumber(v.days) ?? 30, rate = parseNumber(v.rate) ?? 0;
    const kwh = (power / 1000) * hours * days;
    const cost = kwh * rate;
    return {
      sections: [
        { id: "primary", values: [{ id: "kwh", label: "ENERGY USED", value: `${formatNumber(kwh, 2)} kWh`, format: "text", primary: true, description: `over ${days} days` }] },
        { id: "details", title: "Cost", values: [{ id: "cost", label: "Estimated cost", value: `₹${formatNumber(cost, 2)}`, format: "text" }] },
      ],
      interpretation: `A ${power} W device running ${hours} hours/day for ${days} days uses ${formatNumber(kwh, 2)} kWh, costing about ₹${formatNumber(cost, 2)}.`,
    };
  },
  content: {
    ...fin,
    summary:
      "The Electrical Energy Calculator estimates how much electricity a device consumes and what it costs. It is useful for budgeting household energy use, comparing appliances, and understanding your electricity bill.",
    howToUse: [
      "Enter the power rating of the device in watts (W).",
      "Enter how many hours per day the device runs.",
      "Enter the number of days in the billing period.",
      "Enter the cost per kilowatt-hour (kWh) charged by your utility.",
      "Press Calculate to see total energy used and estimated cost.",
    ],
    interpretation:
      "Energy is power multiplied by time. The calculator converts watts to kilowatts (÷1000), multiplies by hours and days to get total kWh, then multiplies by the rate to estimate cost. This tells you how much running a device contributes to your electricity bill.",
    formula: "Energy (kWh) = (Power in W ÷ 1000) × Hours per day × Days\n\nCost = Energy (kWh) × Rate per kWh",
    variables: [
      { symbol: "P", name: "Power", description: "The device's power rating in watts." },
      { symbol: "H", name: "Hours per day", description: "How long the device runs each day." },
      { symbol: "D", name: "Days", description: "The number of days in the billing period." },
      { symbol: "R", name: "Rate", description: "The cost per kilowatt-hour in your currency." },
    ],
    example: {
      title: "Example: 1000 W device running 5 hours/day for 30 days at ₹8/kWh",
      inputs: { Power: "1000 W", "Hours per day": "5", Days: "30", "Rate per kWh": "₹8" },
      steps: [
        "Convert to kW: 1000 ÷ 1000 = 1 kW",
        "Energy per day = 1 × 5 = 5 kWh",
        "Energy over 30 days = 5 × 30 = 150 kWh",
        "Cost = 150 × 8 = ₹1,200",
      ],
      result: "150 kWh, costing ₹1,200",
    },
    factors: [
      "Devices with higher wattage consume more energy per hour.",
      "Running time has a direct linear effect on energy use.",
      "Electricity rates often vary by time of day or slab.",
      "Standby power (devices left plugged in) can add up over a month.",
    ],
    edgeCases: [
      "If power or hours is zero, energy is zero.",
      "Very high wattage devices running long hours can produce large costs.",
      "The calculator assumes a constant power draw; real devices may vary.",
    ],
    commonMistakes: [
      "Forgetting to convert watts to kilowatts.",
      "Using peak power instead of average power.",
      "Ignoring standby power consumption.",
    ],
    assumptions: [
      "The device runs at its rated power continuously.",
      "The electricity rate is constant over the period.",
      "No seasonal or time-of-day rate variations.",
    ],
    limitations: [
      "Does not account for variable power draw or efficiency.",
      "Assumes a flat rate; many utilities use tiered pricing.",
      "Real bills include fixed charges, taxes, and other fees.",
    ],
    faqs: [
      {
        question: "What is a kilowatt-hour (kWh)?",
        answer:
          "A kilowatt-hour is the energy used by a 1,000-watt device running for one hour. It is the standard unit electricity companies use to bill customers.",
      },
      {
        question: "How can I reduce my electricity bill?",
        answer:
          "Use lower-wattage devices, reduce running time, unplug devices on standby, and use energy-efficient appliances. This calculator helps you see which devices cost the most.",
      },
      {
        question: "Why does my bill differ from this estimate?",
        answer:
          "Real bills include fixed charges, taxes, tiered rates, and seasonal variations. This calculator gives a rough estimate of the energy cost for a single device.",
      },
    ],
  },
  relatedCalculators: ["power", "ohms-law", "voltage-drop", "resistor"],
  seo: { title: "Electrical Energy Calculator – kWh & Cost", description: "Calculate electrical energy consumption and cost. Free, instant and accurate.", keywords: ["electrical energy calculator", "kwh calculator"], primaryIntent: "Calculate energy consumption", secondaryIntents: ["Electricity cost"] },
};

// ============ DENSITY ============
export const densityCalculator: CalculatorDefinition = {
  id: "density", slug: "density-calculator", name: "Density Calculator", category: "science",
  shortDescription: "Calculate density from mass and volume.", icon: "scale", accent: "science", popularity: 90,
  inputs: [
    { id: "mass", label: "Mass", type: "number", unit: "kg", placeholder: "10", defaultValue: 10, validation: { required: true, min: 0 } },
    { id: "volume", label: "Volume", type: "number", unit: "m³", placeholder: "2", defaultValue: 2, validation: { required: true, min: 0 } },
  ],
  calculate: (v) => {
    const mass = parseNumber(v.mass) ?? 0, volume = parseNumber(v.volume) ?? 0;
    const density = volume > 0 ? mass / volume : 0;
    return {
      sections: [
        { id: "primary", values: [{ id: "density", label: "DENSITY", value: `${formatNumber(density, 2)} kg/m³`, format: "text", primary: true, description: `ρ = m / V` }] },
      ],
      interpretation: `With ${mass} kg and ${volume} m³, the density is ${formatNumber(density, 2)} kg/m³.`,
    };
  },
  content: {
    ...fin,
    summary:
      "The Density Calculator computes density from mass and volume. It is useful in physics, materials science, and everyday situations like checking whether an object will float or sink.",
    howToUse: [
      "Enter the mass of the object in kilograms (kg).",
      "Enter the volume of the object in cubic meters (m³).",
      "Press Calculate to see the density in kg/m³.",
      "Compare the result with known densities (water ≈ 1000 kg/m³).",
      "Use the result to understand whether the material is dense or light.",
    ],
    interpretation:
      "Density is mass divided by volume. It tells you how much mass is packed into a given space. A higher density means more mass in the same volume. Objects with density less than water (1000 kg/m³) float; those with higher density sink.",
    formula: "Density (ρ) = Mass (m) ÷ Volume (V)\n\nρ = m / V",
    variables: [
      { symbol: "m", name: "Mass", description: "The amount of matter in the object, measured in kilograms." },
      { symbol: "V", name: "Volume", description: "The space the object occupies, measured in cubic meters." },
      { symbol: "ρ", name: "Density", description: "The mass per unit volume, measured in kg/m³." },
    ],
    example: {
      title: "Example: 10 kg object with 2 m³ volume",
      inputs: { Mass: "10 kg", Volume: "2 m³" },
      steps: [
        "Density = 10 ÷ 2",
        "= 5 kg/m³",
        "This is much less than water (1000 kg/m³), so it would float.",
      ],
      result: "5 kg/m³",
    },
    factors: [
      "Density depends on the material and its state (solid, liquid, gas).",
      "Temperature and pressure affect density, especially for gases.",
      "The same material can have different densities in different forms.",
    ],
    edgeCases: [
      "If volume is zero, density is undefined — the calculator returns 0.",
      "Very small volumes with large mass produce very high densities.",
      "Gases have much lower densities than solids or liquids.",
    ],
    commonMistakes: [
      "Using grams and cubic centimeters without converting to kg and m³.",
      "Confusing density with weight.",
      "Forgetting that volume must be in cubic meters for kg/m³.",
    ],
    assumptions: [
      "The object is uniform — density is the same throughout.",
      "Mass and volume are measured accurately.",
      "Standard metric units are used.",
    ],
    limitations: [
      "Assumes uniform density; real objects may have varying density.",
      "Does not account for temperature or pressure effects.",
      "Requires accurate volume measurement, which can be difficult for irregular shapes.",
    ],
    faqs: [
      {
        question: "What is the density of water?",
        answer:
          "Water has a density of approximately 1000 kg/m³ (1 g/cm³) at 4°C. Objects with lower density float in water; objects with higher density sink.",
      },
      {
        question: "How is density different from weight?",
        answer:
          "Weight is the force of gravity on an object's mass. Density is the ratio of mass to volume. Two objects of the same weight can have very different densities if their volumes differ.",
      },
      {
        question: "Why does ice float on water?",
        answer:
          "Ice has a lower density than liquid water (about 917 kg/m³ vs 1000 kg/m³) because water expands when it freezes, increasing its volume while keeping the same mass.",
      },
    ],
  },
  relatedCalculators: ["volume", "force", "pressure", "speed"],
  seo: { title: "Density Calculator – Mass / Volume", description: "Calculate density from mass and volume. Free, instant and accurate.", keywords: ["density calculator", "density formula"], primaryIntent: "Calculate density", secondaryIntents: ["Mass volume density"] },
};

// ============ SPEED ============
export const speedCalculator: CalculatorDefinition = {
  id: "speed", slug: "speed-calculator", name: "Speed Calculator", category: "science",
  shortDescription: "Calculate speed, distance or time.", icon: "gauge", accent: "science", popularity: 89,
  inputs: [
    { id: "distance", label: "Distance", type: "number", unit: "km", placeholder: "100", defaultValue: 100, validation: { required: true, min: 0 } },
    { id: "time", label: "Time", type: "number", unit: "hours", placeholder: "2", defaultValue: 2, validation: { required: true, min: 0 } },
  ],
  calculate: (v) => {
    const distance = parseNumber(v.distance) ?? 0, time = parseNumber(v.time) ?? 0;
    const speed = time > 0 ? distance / time : 0;
    const ms = speed * 1000 / 3600;
    return {
      sections: [
        { id: "primary", values: [{ id: "speed", label: "SPEED", value: `${formatNumber(speed, 2)} km/h`, format: "text", primary: true, description: `= ${formatNumber(ms, 2)} m/s` }] },
      ],
      interpretation: `Covering ${distance} km in ${time} hours gives a speed of ${formatNumber(speed, 2)} km/h.`,
    };
  },
  content: {
    ...fin,
    summary:
      "The Speed Calculator computes speed from distance and time. It is useful for travel planning, running, driving, and physics problems where you need to know how fast something is moving.",
    howToUse: [
      "Enter the distance traveled in kilometers (km).",
      "Enter the time taken in hours.",
      "Press Calculate to see the speed in km/h and m/s.",
      "Review the formula speed = distance ÷ time.",
      "Adjust the inputs to compare different journeys.",
    ],
    interpretation:
      "Speed is the distance covered per unit of time. A higher speed means more distance covered in the same time. The result is shown in both km/h (common for driving) and m/s (common in physics).",
    formula: "Speed (v) = Distance (d) ÷ Time (t)\n\nv = d / t\n\nTo convert km/h to m/s: divide by 3.6",
    variables: [
      { symbol: "d", name: "Distance", description: "The distance traveled, measured in kilometers." },
      { symbol: "t", name: "Time", description: "The time taken, measured in hours." },
      { symbol: "v", name: "Speed", description: "The rate of travel, measured in km/h or m/s." },
    ],
    example: {
      title: "Example: 100 km in 2 hours",
      inputs: { Distance: "100 km", Time: "2 hours" },
      steps: [
        "Speed = 100 ÷ 2",
        "= 50 km/h",
        "In m/s: 50 ÷ 3.6 = 13.89 m/s",
      ],
      result: "50 km/h (13.89 m/s)",
    },
    factors: [
      "Speed depends on both distance and time.",
      "Average speed differs from instantaneous speed during a journey.",
      "Traffic, stops, and acceleration affect real-world average speed.",
    ],
    edgeCases: [
      "If time is zero, speed is undefined — the calculator returns 0.",
      "Very short times with long distances produce very high speeds.",
      "The calculator assumes constant speed over the journey.",
    ],
    commonMistakes: [
      "Using minutes instead of hours without converting.",
      "Confusing average speed with instantaneous speed.",
      "Forgetting to convert units when comparing speeds.",
    ],
    assumptions: [
      "The speed is constant over the entire journey.",
      "Distance and time are measured accurately.",
      "Standard metric units are used.",
    ],
    limitations: [
      "Assumes constant speed; real journeys have varying speeds.",
      "Does not account for stops, acceleration, or deceleration.",
      "Requires accurate distance and time measurements.",
    ],
    faqs: [
      {
        question: "What is the difference between speed and velocity?",
        answer:
          "Speed is a scalar — it only tells you how fast something moves. Velocity is a vector — it includes both speed and direction. This calculator computes speed.",
      },
      {
        question: "How do I convert km/h to m/s?",
        answer:
          "Divide the speed in km/h by 3.6. For example, 72 km/h ÷ 3.6 = 20 m/s.",
      },
      {
        question: "What is average speed?",
        answer:
          "Average speed is the total distance divided by the total time. It does not reflect variations in speed during the journey.",
      },
    ],
  },
  relatedCalculators: ["distance", "density", "force", "pressure"],
  seo: { title: "Speed Calculator – Distance / Time", description: "Calculate speed from distance and time. Free, instant and accurate.", keywords: ["speed calculator", "km/h calculator"], primaryIntent: "Calculate speed", secondaryIntents: ["Distance time speed"] },
};

// ============ DISTANCE ============
export const distanceCalculator: CalculatorDefinition = {
  id: "distance", slug: "distance-calculator", name: "Distance Calculator", category: "science",
  shortDescription: "Calculate distance from speed and time.", icon: "map", accent: "science", popularity: 88,
  inputs: [
    { id: "speed", label: "Speed", type: "number", unit: "km/h", placeholder: "60", defaultValue: 60, validation: { required: true, min: 0 } },
    { id: "time", label: "Time", type: "number", unit: "hours", placeholder: "3", defaultValue: 3, validation: { required: true, min: 0 } },
  ],
  calculate: (v) => {
    const speed = parseNumber(v.speed) ?? 0, time = parseNumber(v.time) ?? 0;
    const distance = speed * time;
    return {
      sections: [
        { id: "primary", values: [{ id: "distance", label: "DISTANCE", value: `${formatNumber(distance, 2)} km`, format: "text", primary: true, description: `d = v × t` }] },
      ],
      interpretation: `At ${speed} km/h for ${time} hours, you travel ${formatNumber(distance, 2)} km.`,
    };
  },
  content: {
    ...fin,
    summary:
      "The Distance Calculator computes distance from speed and time. It is useful for planning trips, estimating travel ranges, and solving physics problems.",
    howToUse: [
      "Enter the speed in kilometers per hour (km/h).",
      "Enter the time in hours.",
      "Press Calculate to see the distance traveled in kilometers.",
      "Review the formula distance = speed × time.",
      "Adjust the inputs to explore different scenarios.",
    ],
    interpretation:
      "Distance is the product of speed and time. If you travel at a constant speed for a given time, the distance is simply speed multiplied by time. This is the fundamental relationship in motion.",
    formula: "Distance (d) = Speed (v) × Time (t)\n\nd = v × t",
    variables: [
      { symbol: "v", name: "Speed", description: "The rate of travel, measured in km/h." },
      { symbol: "t", name: "Time", description: "The duration of travel, measured in hours." },
      { symbol: "d", name: "Distance", description: "The distance covered, measured in kilometers." },
    ],
    example: {
      title: "Example: 60 km/h for 3 hours",
      inputs: { Speed: "60 km/h", Time: "3 hours" },
      steps: [
        "Distance = 60 × 3",
        "= 180 km",
      ],
      result: "180 km",
    },
    factors: [
      "Higher speed or longer time increases distance.",
      "Real-world travel includes stops and speed variations.",
      "Fuel efficiency and range depend on distance traveled.",
    ],
    edgeCases: [
      "If speed or time is zero, distance is zero.",
      "Very high speeds over long times produce very large distances.",
      "The calculator assumes constant speed.",
    ],
    commonMistakes: [
      "Using minutes instead of hours without converting.",
      "Confusing distance with displacement.",
      "Forgetting that speed must be in the same unit system as time.",
    ],
    assumptions: [
      "Speed is constant over the entire journey.",
      "Time is measured in hours.",
      "Standard metric units are used.",
    ],
    limitations: [
      "Assumes constant speed; real journeys vary.",
      "Does not account for stops, detours, or terrain.",
      "Requires accurate speed and time inputs.",
    ],
    faqs: [
      {
        question: "What is the difference between distance and displacement?",
        answer:
          "Distance is the total length of the path traveled. Displacement is the straight-line distance from start to end, including direction. This calculator computes distance.",
      },
      {
        question: "How do I estimate travel time?",
        answer:
          "Divide the distance by the average speed. For example, 180 km at 60 km/h takes 3 hours.",
      },
      {
        question: "Why does my actual travel distance differ?",
        answer:
          "Real journeys include stops, traffic, detours, and speed variations. The calculator assumes constant speed for a straight-line estimate.",
      },
    ],
  },
  relatedCalculators: ["speed", "density", "force", "pressure"],
  seo: { title: "Distance Calculator – Speed × Time", description: "Calculate distance from speed and time. Free, instant and accurate.", keywords: ["distance calculator", "distance formula"], primaryIntent: "Calculate distance", secondaryIntents: ["Speed time distance"] },
};

// ============ FORCE ============
export const forceCalculator: CalculatorDefinition = {
  id: "force", slug: "force-calculator", name: "Force Calculator", category: "science",
  shortDescription: "Calculate force from mass and acceleration.", icon: "move", accent: "science", popularity: 87,
  inputs: [
    { id: "mass", label: "Mass", type: "number", unit: "kg", placeholder: "10", defaultValue: 10, validation: { required: true, min: 0 } },
    { id: "acceleration", label: "Acceleration", type: "number", unit: "m/s²", placeholder: "9.8", defaultValue: 9.8, validation: { required: true, min: 0 } },
  ],
  calculate: (v) => {
    const mass = parseNumber(v.mass) ?? 0, accel = parseNumber(v.acceleration) ?? 0;
    const force = mass * accel;
    return {
      sections: [
        { id: "primary", values: [{ id: "force", label: "FORCE", value: `${formatNumber(force, 2)} N`, format: "text", primary: true, description: `F = m × a` }] },
      ],
      interpretation: `With ${mass} kg and ${accel} m/s² acceleration, the force is ${formatNumber(force, 2)} N.`,
    };
  },
  content: {
    ...fin,
    summary:
      "The Force Calculator computes force from mass and acceleration using Newton's Second Law (F = ma). It is essential in physics, engineering, and everyday situations involving motion.",
    howToUse: [
      "Enter the mass of the object in kilograms (kg).",
      "Enter the acceleration in meters per second squared (m/s²).",
      "Press Calculate to see the force in newtons (N).",
      "Review the formula F = m × a.",
      "Use the result to understand the force required to accelerate an object.",
    ],
    interpretation:
      "Force is the product of mass and acceleration. A larger mass or a larger acceleration requires more force. The standard unit is the newton (N), where 1 N accelerates 1 kg at 1 m/s².",
    formula: "Force (F) = Mass (m) × Acceleration (a)\n\nF = m × a",
    variables: [
      { symbol: "m", name: "Mass", description: "The amount of matter in the object, measured in kilograms." },
      { symbol: "a", name: "Acceleration", description: "The rate of change of velocity, measured in m/s²." },
      { symbol: "F", name: "Force", description: "The push or pull applied, measured in newtons." },
    ],
    example: {
      title: "Example: 10 kg object accelerating at 9.8 m/s²",
      inputs: { Mass: "10 kg", Acceleration: "9.8 m/s²" },
      steps: [
        "Force = 10 × 9.8",
        "= 98 N",
        "This is the weight of a 10 kg object under Earth's gravity.",
      ],
      result: "98 N",
    },
    factors: [
      "Force increases with both mass and acceleration.",
      "Weight is a specific force: mass × gravitational acceleration (9.8 m/s² on Earth).",
      "Friction and air resistance oppose motion and require additional force.",
    ],
    edgeCases: [
      "If mass or acceleration is zero, force is zero.",
      "Negative acceleration (deceleration) produces force in the opposite direction.",
      "Very large masses or accelerations produce very large forces.",
    ],
    commonMistakes: [
      "Using grams instead of kilograms.",
      "Confusing mass with weight.",
      "Forgetting that acceleration has direction.",
    ],
    assumptions: [
      "The mass is constant.",
      "The acceleration is uniform.",
      "Standard metric units are used.",
    ],
    limitations: [
      "Assumes constant mass and acceleration.",
      "Does not account for friction, air resistance, or other opposing forces.",
      "Requires accurate mass and acceleration inputs.",
    ],
    faqs: [
      {
        question: "What is the difference between mass and weight?",
        answer:
          "Mass is the amount of matter in an object, measured in kilograms. Weight is the force of gravity on that mass, measured in newtons. On Earth, weight = mass × 9.8 m/s².",
      },
      {
        question: "What is a newton?",
        answer:
          "A newton (N) is the force needed to accelerate 1 kilogram of mass at 1 meter per second squared. It is the standard SI unit of force.",
      },
      {
        question: "How do I calculate the force needed to lift an object?",
        answer:
          "To lift an object, you need to overcome its weight: F = mass × 9.8 m/s². For a 10 kg object, that's 98 N.",
      },
    ],
  },
  relatedCalculators: ["pressure", "density", "speed", "distance"],
  seo: { title: "Force Calculator – F = ma", description: "Calculate force from mass and acceleration. Free, instant and accurate.", keywords: ["force calculator", "newton calculator"], primaryIntent: "Calculate force", secondaryIntents: ["F = ma"] },
};

// ============ PRESSURE ============
export const pressureCalculator: CalculatorDefinition = {
  id: "pressure", slug: "pressure-calculator", name: "Pressure Calculator", category: "science",
  shortDescription: "Calculate pressure from force and area.", icon: "gauge", accent: "science", popularity: 86,
  inputs: [
    { id: "force", label: "Force", type: "number", unit: "N", placeholder: "100", defaultValue: 100, validation: { required: true, min: 0 } },
    { id: "area", label: "Area", type: "number", unit: "m²", placeholder: "2", defaultValue: 2, validation: { required: true, min: 0 } },
  ],
  calculate: (v) => {
    const force = parseNumber(v.force) ?? 0, area = parseNumber(v.area) ?? 0;
    const pressure = area > 0 ? force / area : 0;
    return {
      sections: [
        { id: "primary", values: [{ id: "pressure", label: "PRESSURE", value: `${formatNumber(pressure, 2)} Pa`, format: "text", primary: true, description: `P = F / A` }] },
      ],
      interpretation: `With ${force} N over ${area} m², the pressure is ${formatNumber(pressure, 2)} Pa.`,
    };
  },
  content: {
    ...fin,
    summary:
      "The Pressure Calculator computes pressure from force and area. It is useful in physics, engineering, hydraulics, and understanding how force distributes over surfaces.",
    howToUse: [
      "Enter the force applied in newtons (N).",
      "Enter the area over which the force is applied in square meters (m²).",
      "Press Calculate to see the pressure in pascals (Pa).",
      "Review the formula P = F ÷ A.",
      "Use the result to understand how force distribution affects pressure.",
    ],
    interpretation:
      "Pressure is force divided by area. The same force applied over a smaller area produces higher pressure. This is why a sharp knife cuts more easily than a blunt one — the force is concentrated on a smaller area.",
    formula: "Pressure (P) = Force (F) ÷ Area (A)\n\nP = F / A",
    variables: [
      { symbol: "F", name: "Force", description: "The force applied, measured in newtons." },
      { symbol: "A", name: "Area", description: "The surface area over which force is applied, measured in m²." },
      { symbol: "P", name: "Pressure", description: "The force per unit area, measured in pascals." },
    ],
    example: {
      title: "Example: 100 N over 2 m²",
      inputs: { Force: "100 N", Area: "2 m²" },
      steps: [
        "Pressure = 100 ÷ 2",
        "= 50 Pa",
      ],
      result: "50 Pa",
    },
    factors: [
      "Pressure increases when force increases or area decreases.",
      "The same force on a smaller area produces higher pressure.",
      "Atmospheric pressure is about 101,325 Pa at sea level.",
    ],
    edgeCases: [
      "If area is zero, pressure is undefined — the calculator returns 0.",
      "Very small areas with large forces produce very high pressures.",
      "Pressure can be negative in some contexts (suction).",
    ],
    commonMistakes: [
      "Using square centimeters without converting to m².",
      "Confusing pressure with force.",
      "Forgetting that area must be in square meters for pascals.",
    ],
    assumptions: [
      "The force is applied uniformly over the area.",
      "The area is measured perpendicular to the force.",
      "Standard metric units are used.",
    ],
    limitations: [
      "Assumes uniform force distribution.",
      "Does not account for fluid pressure variations with depth.",
      "Requires accurate force and area measurements.",
    ],
    faqs: [
      {
        question: "What is a pascal?",
        answer:
          "A pascal (Pa) is the pressure from 1 newton of force spread over 1 square meter. It is the standard SI unit of pressure.",
      },
      {
        question: "Why does a sharp knife cut better than a blunt one?",
        answer:
          "A sharp knife has a much smaller contact area, so the same force produces much higher pressure. Higher pressure makes it easier to cut through materials.",
      },
      {
        question: "What is atmospheric pressure?",
        answer:
          "Atmospheric pressure is the weight of the air above us, about 101,325 Pa (1 atmosphere) at sea level. It decreases with altitude.",
      },
    ],
  },
  relatedCalculators: ["force", "density", "speed", "distance"],
  seo: { title: "Pressure Calculator – Force / Area", description: "Calculate pressure from force and area. Free, instant and accurate.", keywords: ["pressure calculator", "pascal calculator"], primaryIntent: "Calculate pressure", secondaryIntents: ["Force area pressure"] },
};

// ============ TEMPERATURE CONVERTER ============
export const temperatureConverterCalculator: CalculatorDefinition = {
  id: "temperature-converter", slug: "temperature-converter", name: "Temperature Converter", category: "science",
  shortDescription: "Convert between Celsius, Fahrenheit and Kelvin.", icon: "thermometer", accent: "science", popularity: 94,
  inputs: [
    { id: "value", label: "Temperature", type: "number", placeholder: "25", defaultValue: 25, validation: { required: true } },
    { id: "from", label: "From", type: "dropdown", defaultValue: "celsius", options: [{ label: "Celsius (°C)", value: "celsius" }, { label: "Fahrenheit (°F)", value: "fahrenheit" }, { label: "Kelvin (K)", value: "kelvin" }] },
  ],
  calculate: (v) => {
    const value = parseNumber(v.value) ?? 0, from = String(v.from ?? "celsius");
    let celsius = value;
    if (from === "fahrenheit") celsius = (value - 32) * 5 / 9;
    else if (from === "kelvin") celsius = value - 273.15;
    const fahrenheit = celsius * 9 / 5 + 32;
    const kelvin = celsius + 273.15;
    return {
      sections: [
        { id: "primary", values: [{ id: "celsius", label: "CELSIUS", value: `${formatNumber(celsius, 2)} °C`, format: "text", primary: true, description: `from ${from}` }] },
        { id: "details", title: "Other units", values: [{ id: "fahrenheit", label: "Fahrenheit", value: `${formatNumber(fahrenheit, 2)} °F`, format: "text" }, { id: "kelvin", label: "Kelvin", value: `${formatNumber(kelvin, 2)} K`, format: "text" }] },
      ],
      interpretation: `${value}° ${from === "celsius" ? "C" : from === "fahrenheit" ? "F" : "K"} equals ${formatNumber(celsius, 2)} °C, ${formatNumber(fahrenheit, 2)} °F, and ${formatNumber(kelvin, 2)} K.`,
    };
  },
  content: {
    ...fin,
    summary:
      "The Temperature Converter converts between Celsius, Fahrenheit, and Kelvin. It is useful for cooking, weather, science, and international travel where different temperature scales are used.",
    howToUse: [
      "Enter the temperature value.",
      "Select the unit you are converting from (Celsius, Fahrenheit, or Kelvin).",
      "Press Calculate to see the equivalent in all three scales.",
      "Review the conversion formulas shown with the result.",
      "Use the result for cooking, science, or travel planning.",
    ],
    interpretation:
      "The three temperature scales use different reference points. Celsius is based on water's freezing (0°C) and boiling (100°C) points. Fahrenheit uses 32°F and 212°F for the same points. Kelvin is an absolute scale starting at absolute zero (-273.15°C).",
    formula: "Celsius to Fahrenheit: °F = (°C × 9/5) + 32\n\nFahrenheit to Celsius: °C = (°F − 32) × 5/9\n\nCelsius to Kelvin: K = °C + 273.15\n\nKelvin to Celsius: °C = K − 273.15",
    variables: [
      { symbol: "°C", name: "Celsius", description: "The temperature in degrees Celsius." },
      { symbol: "°F", name: "Fahrenheit", description: "The temperature in degrees Fahrenheit." },
      { symbol: "K", name: "Kelvin", description: "The temperature in kelvin (absolute scale)." },
    ],
    example: {
      title: "Example: 25°C",
      inputs: { Temperature: "25", From: "Celsius" },
      steps: [
        "Fahrenheit = (25 × 9/5) + 32 = 45 + 32 = 77°F",
        "Kelvin = 25 + 273.15 = 298.15 K",
      ],
      result: "25°C = 77°F = 298.15 K",
    },
    factors: [
      "Celsius and Fahrenheit are relative scales with different zero points.",
      "Kelvin is an absolute scale — it cannot be negative.",
      "The same temperature has different numerical values in each scale.",
    ],
    edgeCases: [
      "Absolute zero is -273.15°C, -459.67°F, or 0 K — the lowest possible temperature.",
      "Kelvin values cannot be negative.",
      "Very high temperatures (like the Sun's surface) are best expressed in kelvin.",
    ],
    commonMistakes: [
      "Using the wrong conversion formula direction.",
      "Forgetting to add 32 when converting Celsius to Fahrenheit.",
      "Treating kelvin as if it used the degree symbol.",
    ],
    assumptions: [
      "Standard conversion formulas are used.",
      "The input value is a valid temperature.",
      "No rounding is applied to intermediate steps.",
    ],
    limitations: [
      "Does not account for temperature scales used in specialized fields.",
      "Assumes standard atmospheric conditions for reference points.",
      "Requires a valid temperature input.",
    ],
    faqs: [
      {
        question: "What is absolute zero?",
        answer:
          "Absolute zero is the lowest possible temperature, where particles have minimal thermal motion. It is 0 K, -273.15°C, or -459.67°F.",
      },
      {
        question: "Why does the US use Fahrenheit?",
        answer:
          "The Fahrenheit scale was developed by Daniel Fahrenheit in the 18th century and became standard in the US. Most other countries use Celsius, and science uses Kelvin.",
      },
      {
        question: "At what temperature are Celsius and Fahrenheit equal?",
        answer:
          "Celsius and Fahrenheit are equal at -40 degrees. At -40°C, the temperature is also -40°F.",
      },
    ],
  },
  relatedCalculators: ["unit-converter", "density", "speed", "pressure"],
  seo: { title: "Temperature Converter – °C, °F, K", description: "Convert between Celsius, Fahrenheit and Kelvin. Free, instant and accurate.", keywords: ["temperature converter", "celsius to fahrenheit"], primaryIntent: "Convert temperature", secondaryIntents: ["C to F", "F to C"] },
};