"use client";

import type { CalculatorDefinition } from "@/lib/calculators/types";
import { ageCalculator } from "@/calculators/date-time/age";
import { emiCalculator } from "@/calculators/finance/emi";
import { loanCalculator } from "@/calculators/finance/loan";
import { sipCalculator } from "@/calculators/finance/sip";
import { compoundInterestCalculator } from "@/calculators/finance/compound-interest";
import { simpleInterestCalculator } from "@/calculators/finance/simple-interest";
import { fdCalculator } from "@/calculators/finance/fd";
import { rdCalculator } from "@/calculators/finance/rd";
import { gstCalculator } from "@/calculators/finance/gst";
import { mortgageCalculator, autoLoanCalculator, investmentCalculator, savingsCalculator } from "@/calculators/finance/finance-extra";
import { retirementCalculator, creditCardPayoffCalculator, debtPayoffCalculator, dtiCalculator, roiCalculator, aprCalculator, inflationCalculator, tipCalculator, salesTaxCalculator, currencyConverterCalculator } from "@/calculators/finance/finance-extras-2";
import { ppfCalculator, cagrCalculator, npsCalculator, gratuityCalculator, hraCalculator, epfCalculator, incomeTaxCalculator, salaryCalculator, homeLoanEmiCalculator, carLoanEmiCalculator, personalLoanEmiCalculator } from "@/calculators/finance/finance-india";
import { percentageCalculator } from "@/calculators/math/percentage";
import { percentageChangeCalculator } from "@/calculators/math/percentage-change";
import {
  discountCalculator,
  fractionCalculator,
  ratioCalculator,
  averageCalculator,
  roundingCalculator,
  scientificNotationCalculator,
  numberToWordsCalculator,
  randomNumberCalculator,
  fractionToDecimalCalculator,
  decimalToFractionCalculator,
  unitConverterCalculator,
  standardCalculator,
  scientificCalculator,
} from "@/calculators/math/math-tools";
import { cgpaCalculator } from "@/calculators/education/cgpa";
import { gpaCalculator } from "@/calculators/education/gpa";
import { gradeCalculator } from "@/calculators/education/grade";
import { attendanceCalculator } from "@/calculators/education/attendance";
import { dateCalculator } from "@/calculators/date-time/date";
import { dateDifferenceCalculator } from "@/calculators/date-time/date-difference";
import { timeDurationCalculator } from "@/calculators/date-time/time-duration";
import { businessDaysCalculator } from "@/calculators/date-time/business-days";
import { bmiCalculator } from "@/calculators/health/bmi";
import { bmrCalculator } from "@/calculators/health/bmr";
import { calorieCalculator } from "@/calculators/health/calorie";
import { bodyFatCalculator } from "@/calculators/health/body-fat";
import { idealWeightCalculator } from "@/calculators/health/ideal-weight";
import { healthyWeightCalculator } from "@/calculators/health/healthy-weight";
import { macroCalculator } from "@/calculators/health/macro";
import { paceCalculator } from "@/calculators/health/pace";
import { pregnancyDueDateCalculator, pregnancyWeightGainCalculator, ovulationCalculator, periodCalculator, oneRepMaxCalculator, targetHeartRateCalculator } from "@/calculators/health/health-extra";
import { areaCalculator, volumeCalculator, concreteCalculator, squareFootageCalculator, roofingCalculator, tileCalculator, gravelCalculator, mulchCalculator, paintCalculator, flooringCalculator, fenceCalculator, stairCalculator } from "@/calculators/construction/construction";
import { ohmsLawCalculator, voltageDropCalculator, powerCalculator, resistorCalculator, electricalEnergyCalculator, densityCalculator, speedCalculator, distanceCalculator, forceCalculator, pressureCalculator, temperatureConverterCalculator } from "@/calculators/science/science";

const clientCalculators: Record<string, CalculatorDefinition> = {
  // Math
  [percentageCalculator.id]: percentageCalculator,
  [percentageChangeCalculator.id]: percentageChangeCalculator,
  [discountCalculator.id]: discountCalculator,
  [fractionCalculator.id]: fractionCalculator,
  [ratioCalculator.id]: ratioCalculator,
  [averageCalculator.id]: averageCalculator,
  [roundingCalculator.id]: roundingCalculator,
  [scientificNotationCalculator.id]: scientificNotationCalculator,
  [numberToWordsCalculator.id]: numberToWordsCalculator,
  [randomNumberCalculator.id]: randomNumberCalculator,
  [fractionToDecimalCalculator.id]: fractionToDecimalCalculator,
  [decimalToFractionCalculator.id]: decimalToFractionCalculator,
  [unitConverterCalculator.id]: unitConverterCalculator,
  [standardCalculator.id]: standardCalculator,
  [scientificCalculator.id]: scientificCalculator,
  // Finance
  [emiCalculator.id]: emiCalculator,
  [loanCalculator.id]: loanCalculator,
  [sipCalculator.id]: sipCalculator,
  [compoundInterestCalculator.id]: compoundInterestCalculator,
  [simpleInterestCalculator.id]: simpleInterestCalculator,
  [fdCalculator.id]: fdCalculator,
  [rdCalculator.id]: rdCalculator,
  [gstCalculator.id]: gstCalculator,
  [mortgageCalculator.id]: mortgageCalculator,
  [autoLoanCalculator.id]: autoLoanCalculator,
  [investmentCalculator.id]: investmentCalculator,
  [savingsCalculator.id]: savingsCalculator,
  [retirementCalculator.id]: retirementCalculator,
  [creditCardPayoffCalculator.id]: creditCardPayoffCalculator,
  [debtPayoffCalculator.id]: debtPayoffCalculator,
  [dtiCalculator.id]: dtiCalculator,
  [roiCalculator.id]: roiCalculator,
  [aprCalculator.id]: aprCalculator,
  [inflationCalculator.id]: inflationCalculator,
  [tipCalculator.id]: tipCalculator,
  [salesTaxCalculator.id]: salesTaxCalculator,
  [currencyConverterCalculator.id]: currencyConverterCalculator,
  [ppfCalculator.id]: ppfCalculator,
  [cagrCalculator.id]: cagrCalculator,
  [npsCalculator.id]: npsCalculator,
  [gratuityCalculator.id]: gratuityCalculator,
  [hraCalculator.id]: hraCalculator,
  [epfCalculator.id]: epfCalculator,
  [incomeTaxCalculator.id]: incomeTaxCalculator,
  [salaryCalculator.id]: salaryCalculator,
  [homeLoanEmiCalculator.id]: homeLoanEmiCalculator,
  [carLoanEmiCalculator.id]: carLoanEmiCalculator,
  [personalLoanEmiCalculator.id]: personalLoanEmiCalculator,
  // Education
  [cgpaCalculator.id]: cgpaCalculator,
  [gpaCalculator.id]: gpaCalculator,
  [gradeCalculator.id]: gradeCalculator,
  [attendanceCalculator.id]: attendanceCalculator,
  // Health
  [bmiCalculator.id]: bmiCalculator,
  [bmrCalculator.id]: bmrCalculator,
  [calorieCalculator.id]: calorieCalculator,
  [bodyFatCalculator.id]: bodyFatCalculator,
  [idealWeightCalculator.id]: idealWeightCalculator,
  [healthyWeightCalculator.id]: healthyWeightCalculator,
  [macroCalculator.id]: macroCalculator,
  [paceCalculator.id]: paceCalculator,
  [pregnancyDueDateCalculator.id]: pregnancyDueDateCalculator,
  [pregnancyWeightGainCalculator.id]: pregnancyWeightGainCalculator,
  [ovulationCalculator.id]: ovulationCalculator,
  [periodCalculator.id]: periodCalculator,
  [oneRepMaxCalculator.id]: oneRepMaxCalculator,
  [targetHeartRateCalculator.id]: targetHeartRateCalculator,
  // Construction
  [areaCalculator.id]: areaCalculator,
  [volumeCalculator.id]: volumeCalculator,
  [concreteCalculator.id]: concreteCalculator,
  [squareFootageCalculator.id]: squareFootageCalculator,
  [roofingCalculator.id]: roofingCalculator,
  [tileCalculator.id]: tileCalculator,
  [gravelCalculator.id]: gravelCalculator,
  [mulchCalculator.id]: mulchCalculator,
  [paintCalculator.id]: paintCalculator,
  [flooringCalculator.id]: flooringCalculator,
  [fenceCalculator.id]: fenceCalculator,
  [stairCalculator.id]: stairCalculator,
  // Science
  [ohmsLawCalculator.id]: ohmsLawCalculator,
  [voltageDropCalculator.id]: voltageDropCalculator,
  [powerCalculator.id]: powerCalculator,
  [resistorCalculator.id]: resistorCalculator,
  [electricalEnergyCalculator.id]: electricalEnergyCalculator,
  [densityCalculator.id]: densityCalculator,
  [speedCalculator.id]: speedCalculator,
  [distanceCalculator.id]: distanceCalculator,
  [forceCalculator.id]: forceCalculator,
  [pressureCalculator.id]: pressureCalculator,
  [temperatureConverterCalculator.id]: temperatureConverterCalculator,
  // Date & Time
  [ageCalculator.id]: ageCalculator,
  [dateCalculator.id]: dateCalculator,
  [dateDifferenceCalculator.id]: dateDifferenceCalculator,
  [timeDurationCalculator.id]: timeDurationCalculator,
  [businessDaysCalculator.id]: businessDaysCalculator,
};

export function getClientCalculator(slug: string): CalculatorDefinition | undefined {
  return Object.values(clientCalculators).find((c) => c.slug === slug);
}