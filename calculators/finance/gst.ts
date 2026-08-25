/**
 * GST Calculator - Goods and Services Tax calculator
 */

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { roundTo } from "@/lib/utils/format";
import { formatMoney } from "@/lib/currency/format";
import { DEFAULT_CURRENCY } from "@/lib/currency/currencies";
import { parseNumber } from "@/lib/utils/validation";

export const gstCalculator: CalculatorDefinition = {
  id: "gst",
  slug: "gst-calculator",
  name: "GST Calculator",
  category: "finance",
  shortDescription: "Calculate GST amount and total price for any product or service.",
  icon: "receipt",
  accent: "finance",
  popularity: 84,

  inputs: [
    {
      id: "amount",
      label: "Amount",
      type: "currency",
      unit: "₹",
      placeholder: "10000",
      hint: "The base price before or after GST.",
      example: "e.g. ₹10,000",
      defaultValue: 10000,
      validation: { required: true, min: 1, max: 100000000 },
    },
    {
      id: "rate",
      label: "GST rate",
      type: "dropdown",
      defaultValue: "18",
      options: [
        { label: "0% (Exempt)", value: "0" },
        { label: "5%", value: "5" },
        { label: "12%", value: "12" },
        { label: "18%", value: "18" },
        { label: "28%", value: "28" },
      ],
    },
    {
      id: "type",
      label: "Calculation type",
      type: "radio",
      defaultValue: "exclusive",
      options: [
        { label: "Amount is exclusive of GST", value: "exclusive" },
        { label: "Amount is inclusive of GST", value: "inclusive" },
      ],
    },
  ],

  calculate: (values, currency = DEFAULT_CURRENCY) => {
    const amount = parseNumber(values.amount) ?? 0;
    const rate = parseNumber(values.rate) ?? 0;
    const type = String(values.type ?? "exclusive");

    let gstAmount: number;
    let baseAmount: number;
    let totalAmount: number;

    if (type === "inclusive") {
      totalAmount = amount;
      baseAmount = amount / (1 + rate / 100);
      gstAmount = totalAmount - baseAmount;
    } else {
      baseAmount = amount;
      gstAmount = (amount * rate) / 100;
      totalAmount = baseAmount + gstAmount;
    }

    return {
      sections: [
        {
          id: "primary",
          values: [
            {
              id: "gstAmount",
              label: "GST AMOUNT",
              value: roundTo(gstAmount),
              format: "currency",
              primary: true,
              description: `at ${rate}% GST`,
            },
          ],
        },
        {
          id: "breakdown",
          title: "Price breakdown",
          values: [
            { id: "base", label: "Base amount", value: roundTo(baseAmount), format: "currency" },
            { id: "total", label: "Total amount", value: roundTo(totalAmount), format: "currency" },
          ],
        },
      ],
      interpretation: `The GST amount is ${formatMoney(roundTo(gstAmount), currency)} at ${rate}%. The base amount is ${formatMoney(roundTo(baseAmount), currency)} and the total including GST is ${formatMoney(roundTo(totalAmount), currency)}.`,
    };
  },

  content: {
    summary:
      "The GST Calculator computes the GST amount and total price for any product or service. It works for both GST-exclusive and GST-inclusive prices.",
    howToUse: [
      "Enter the price of the product or service.",
      "Select the applicable GST rate.",
      "Choose whether the amount includes GST or not.",
      "Press Calculate to see the GST amount and total.",
    ],
    interpretation:
      "If the amount is exclusive of GST, the calculator adds GST to get the total. If the amount is inclusive, it extracts the GST portion from the total price.",
    formula:
      "GST Amount = Base Amount × Rate / 100 (exclusive)\n\nTotal = Base + GST\n\nBase = Total / (1 + Rate/100) (inclusive)",
    variables: [
      { symbol: "Base", name: "Base amount", description: "The price before GST." },
      { symbol: "Rate", name: "GST rate", description: "The applicable GST percentage." },
      { symbol: "Total", name: "Total amount", description: "The price including GST." },
    ],
    example: {
      title: "Example: ₹10,000 at 18% GST (exclusive)",
      inputs: { Amount: "₹10,000", Rate: "18%", Type: "Exclusive" },
      steps: [
        "GST = 10,000 × 18 / 100 = ₹1,800",
        "Total = ₹10,000 + ₹1,800 = ₹11,800",
      ],
      result: "GST = ₹1,800, Total = ₹11,800",
    },
    factors: [
      "Different products have different GST rates.",
      "GST rates in India: 0%, 5%, 12%, 18%, 28%.",
      "Some items are exempt from GST.",
    ],
    edgeCases: [
      "Zero GST rate means no tax is added.",
      "Inclusive calculation extracts GST from the total.",
      "Rounding may cause minor differences in invoices.",
    ],
    commonMistakes: [
      "Using the wrong GST rate for a product.",
      "Confusing inclusive and exclusive calculations.",
      "Forgetting that GST is added to the base price.",
    ],
    assumptions: [
      "The GST rate is correctly selected.",
      "No other taxes or cess are applied.",
    ],
    limitations: [
      "Does not account for cess or other surcharges.",
      "GST rules may change - verify current rates.",
    ],
    faqs: [
      {
        question: "What is GST?",
        answer:
          "GST (Goods and Services Tax) is a value-added tax levied on most goods and services sold in India. It replaced multiple indirect taxes and is collected at each stage of the supply chain.",
      },
      {
        question: "What are the GST rates in India?",
        answer:
          "The main GST slabs are 0%, 5%, 12%, 18% and 28%. Essential items are often taxed at lower rates or exempt, while luxury items are taxed at higher rates.",
      },
      {
        question: "What is the difference between inclusive and exclusive GST?",
        answer:
          "Exclusive means GST is added on top of the base price. Inclusive means the displayed price already includes GST, and the GST portion needs to be extracted from it.",
      },
    ],
  },

  relatedCalculators: ["percentage-increase", "percentage", "loan", "simple-interest"],

  seo: {
    title: "GST Calculator – Calculate GST Amount & Total Price",
    description:
      "Calculate GST amount and total price for any product or service. Works for both inclusive and exclusive GST. Free, instant and accurate.",
    keywords: ["gst calculator", "gst amount calculator", "gst inclusive", "gst exclusive"],
    primaryIntent: "Calculate GST amount",
    secondaryIntents: ["GST inclusive price", "GST exclusive price", "Total with GST"],
  },
};