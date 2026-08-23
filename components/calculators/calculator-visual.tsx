"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import { Delete, Divide, Minus, Plus, X, Equal } from "lucide-react";

interface CalculatorVisualProps {
  type: "standard" | "scientific";
}

function btnClass(primary = false): string {
  return primary
    ? "flex items-center justify-center rounded-xl bg-accent-600 text-white text-lg font-semibold transition-all active:scale-95 hover:bg-accent-700 dark:bg-accent-500 dark:hover:bg-accent-400 h-14 select-none"
    : "flex items-center justify-center rounded-xl bg-surface-secondary text-text-primary text-lg font-semibold transition-all active:scale-95 hover:bg-border dark:bg-dark-secondary dark:text-dark-text-primary dark:hover:bg-dark-border h-14 select-none";
}

function opBtnClass(): string {
  return "flex items-center justify-center rounded-xl bg-accent-50 text-accent-700 text-lg font-semibold transition-all active:scale-95 hover:bg-accent-100 dark:bg-accent-950/50 dark:text-accent-300 dark:hover:bg-accent-950 h-14 select-none";
}

export function StandardCalculator() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [memory, setMemory] = useState<number | null>(null);
  const [newNumber, setNewNumber] = useState(true);
  const [lastOp, setLastOp] = useState<string | null>(null);
  const [lastValue, setLastValue] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateDisplay = useCallback((val: string) => {
    setDisplay((prev) => newNumber ? val : prev === "0" && val !== "." ? val : prev + val);
    setNewNumber(false);
  }, [newNumber]);

  const handleNumber = useCallback((n: string) => {
    updateDisplay(n);
    inputRef.current?.focus();
  }, [updateDisplay]);

  const handleDecimal = useCallback(() => {
    if (newNumber) { setDisplay("0."); setNewNumber(false); return; }
    if (!display.includes(".")) setDisplay(prev => prev + ".");
  }, [newNumber, display]);

  const handleOperator = useCallback((op: string) => {
    const current = parseFloat(display);
    if (lastOp && lastValue !== null && !newNumber) {
      const result = calculate(lastValue, current, lastOp);
      setDisplay(String(result));
      setLastValue(result);
    } else {
      setLastValue(current);
    }
    setLastOp(op);
    setNewNumber(true);
    setExpression(`${current} ${op}`);
  }, [display, lastOp, lastValue, newNumber]);

  const handleEquals = useCallback(() => {
    const current = parseFloat(display);
    if (lastOp && lastValue !== null) {
      const result = calculate(lastValue, current, lastOp);
      setExpression(`${lastValue} ${lastOp} ${current} =`);
      setDisplay(String(result));
      setLastOp(null);
      setLastValue(null);
      setNewNumber(true);
    }
  }, [display, lastOp, lastValue]);

  const handleClear = useCallback(() => {
    setDisplay("0"); setExpression(""); setNewNumber(true);
    setLastOp(null); setLastValue(null);
  }, []);

  const handleBackspace = useCallback(() => {
    setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : "0");
  }, []);

  const handlePercent = useCallback(() => {
    setDisplay(String(parseFloat(display) / 100));
    setNewNumber(true);
  }, [display]);

  const handlePlusMinus = useCallback(() => {
    setDisplay(String(-parseFloat(display)));
  }, [display]);

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") handleNumber(e.key);
      else if (e.key === ".") handleDecimal();
      else if (e.key === "+") handleOperator("+");
      else if (e.key === "-") handleOperator("−");
      else if (e.key === "*") handleOperator("×");
      else if (e.key === "/") handleOperator("÷");
      else if (e.key === "Enter" || e.key === "=") handleEquals();
      else if (e.key === "Escape") handleClear();
      else if (e.key === "Backspace") handleBackspace();
      else if (e.key === "%") handlePercent();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleNumber, handleDecimal, handleOperator, handleEquals, handleClear, handleBackspace, handlePercent]);

  return (
    <div className="mx-auto max-w-sm">
      {/* Display */}
      <div className="mb-4 rounded-2xl border border-border bg-surface px-5 py-4 text-right dark:border-dark-border dark:bg-dark-surface">
        {expression && <p className="text-xs text-text-muted dark:text-dark-text-muted">{expression}</p>}
        <input
          ref={inputRef}
          type="text"
          value={display}
          readOnly
          className="mt-1 w-full bg-transparent text-right text-3xl font-semibold tracking-tight text-text-primary outline-none dark:text-dark-text-primary"
          aria-label="Calculator display"
        />
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-2.5" role="group" aria-label="Calculator buttons">
        {/* Row 1 */}
        <button onClick={handleClear} className={`${btnClass()} bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50`}>AC</button>
        <button onClick={handleBackspace} className={btnClass()}><Delete className="h-5 w-5" /></button>
        <button onClick={handlePercent} className={btnClass()}>%</button>
        <button onClick={() => handleOperator("÷")} className={opBtnClass()}><Divide className="h-5 w-5" /></button>

        {/* Row 2 */}
        <button onClick={() => handleNumber("7")} className={btnClass()}>7</button>
        <button onClick={() => handleNumber("8")} className={btnClass()}>8</button>
        <button onClick={() => handleNumber("9")} className={btnClass()}>9</button>
        <button onClick={() => handleOperator("×")} className={opBtnClass()}><X className="h-5 w-5" /></button>

        {/* Row 3 */}
        <button onClick={() => handleNumber("4")} className={btnClass()}>4</button>
        <button onClick={() => handleNumber("5")} className={btnClass()}>5</button>
        <button onClick={() => handleNumber("6")} className={btnClass()}>6</button>
        <button onClick={() => handleOperator("−")} className={opBtnClass()}><Minus className="h-5 w-5" /></button>

        {/* Row 4 */}
        <button onClick={() => handleNumber("1")} className={btnClass()}>1</button>
        <button onClick={() => handleNumber("2")} className={btnClass()}>2</button>
        <button onClick={() => handleNumber("3")} className={btnClass()}>3</button>
        <button onClick={() => handleOperator("+")} className={opBtnClass()}><Plus className="h-5 w-5" /></button>

        {/* Row 5 */}
        <button onClick={handlePlusMinus} className={btnClass()}>±</button>
        <button onClick={() => handleNumber("0")} className={btnClass()}>0</button>
        <button onClick={handleDecimal} className={btnClass()}>.</button>
        <button onClick={handleEquals} className="flex items-center justify-center rounded-xl bg-accent-600 text-white text-lg font-semibold transition-all active:scale-95 hover:bg-accent-700 dark:bg-accent-500 dark:hover:bg-accent-400 h-14 select-none"><Equal className="h-5 w-5" /></button>
      </div>
    </div>
  );
}

export function ScientificCalculator() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [angleMode, setAngleMode] = useState<"deg" | "rad">("deg");
  const newNumberRef = useRef(true);

  const append = useCallback((s: string) => {
    setDisplay(prev => {
      if (newNumberRef.current) {
        newNumberRef.current = false;
        return s;
      }
      return prev === "0" && s !== "." ? s : prev + s;
    });
  }, []);

  const handleNumber = useCallback((n: string) => append(n), [append]);

  const handleFunction = useCallback((fn: string) => {
    const v = parseFloat(display);
    const rad = angleMode === "rad" ? v : (v * Math.PI) / 180;
    let r: number;
    switch (fn) {
      case "sin": r = Math.sin(rad); setExpression(`sin(${v}°)`); break;
      case "cos": r = Math.cos(rad); setExpression(`cos(${v}°)`); break;
      case "tan": r = Math.tan(rad); setExpression(`tan(${v}°)`); break;
      case "ln": r = Math.log(v); setExpression(`ln(${v})`); break;
      case "log": r = Math.log10(v); setExpression(`log(${v})`); break;
      case "sqrt": r = Math.sqrt(Math.max(0, v)); setExpression(`√(${v})`); break;
      case "square": r = v * v; setExpression(`${v}²`); break;
      case "cube": r = v * v * v; setExpression(`${v}³`); break;
      case "inv": r = v !== 0 ? 1 / v : 0; setExpression(`1/${v}`); break;
      case "pi": setExpression("π"); setDisplay(String(Math.PI)); newNumberRef.current = true; return;
      case "e": setExpression("e"); setDisplay(String(Math.E)); newNumberRef.current = true; return;
      default: return;
    }
    setDisplay(String(r));
    newNumberRef.current = true;
  }, [display, angleMode]);

  const handleEquals = useCallback(() => {
    try {
      const result = Function(`"use strict"; return (${display.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-")})`)();
      setExpression(display);
      setDisplay(String(result));
      newNumberRef.current = true;
    } catch { /* ignore parse errors */ }
  }, [display]);

  const handleClear = useCallback(() => { setDisplay("0"); setExpression(""); newNumberRef.current = true; }, []);

  const handleBackspace = useCallback(() => {
    setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : "0");
  }, []);

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        setDisplay(prev => {
          if (newNumberRef.current) {
            newNumberRef.current = false;
            return e.key;
          }
          return prev === "0" ? e.key : prev + e.key;
        });
      }
      else if (e.key === ".") setDisplay(p => p.includes(".") ? p : p + ".");
      else if (e.key === "Enter" || e.key === "=") handleEquals();
      else if (e.key === "Escape") handleClear();
      else if (e.key === "Backspace") handleBackspace();
      else if (["+", "-", "*", "/"].includes(e.key)) setDisplay(p => p + e.key);
      else if (e.key === "(" || e.key === ")") setDisplay(p => p + e.key);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleEquals, handleBackspace, handleClear]);

  return (
    <div className="mx-auto max-w-sm">
      {/* Display */}
      <div className="mb-4 rounded-2xl border border-border bg-surface px-5 py-4 text-right dark:border-dark-border dark:bg-dark-surface">
        {expression && <p className="text-xs text-text-muted dark:text-dark-text-muted">{expression}</p>}
        <input
          type="text"
          value={display}
          readOnly
          className="mt-1 w-full bg-transparent text-right text-3xl font-semibold tracking-tight text-text-primary outline-none dark:text-dark-text-primary"
          aria-label="Calculator display"
        />
      </div>

      {/* Mode toggle */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex gap-1">
          <button onClick={() => setAngleMode("deg")} className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${angleMode === "deg" ? "bg-accent-600 text-white" : "bg-surface-secondary text-text-secondary dark:bg-dark-secondary dark:text-dark-text-secondary"}`}>DEG</button>
          <button onClick={() => setAngleMode("rad")} className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${angleMode === "rad" ? "bg-accent-600 text-white" : "bg-surface-secondary text-text-secondary dark:bg-dark-secondary dark:text-dark-text-secondary"}`}>RAD</button>
        </div>
        <button onClick={handleClear} className="rounded-lg bg-red-50 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50">AC</button>
      </div>

      <div className="grid grid-cols-5 gap-2" role="group" aria-label="Scientific calculator buttons">
        {/* Row 1 - Scientific */}
        <button onClick={() => handleFunction("sin")} className={opBtnClass()} style={{ height: "3rem", fontSize: "0.8125rem" }}>sin</button>
        <button onClick={() => handleFunction("cos")} className={opBtnClass()} style={{ height: "3rem", fontSize: "0.8125rem" }}>cos</button>
        <button onClick={() => handleFunction("tan")} className={opBtnClass()} style={{ height: "3rem", fontSize: "0.8125rem" }}>tan</button>
        <button onClick={() => handleFunction("ln")} className={opBtnClass()} style={{ height: "3rem", fontSize: "0.8125rem" }}>ln</button>
        <button onClick={() => handleFunction("log")} className={opBtnClass()} style={{ height: "3rem", fontSize: "0.8125rem" }}>log</button>

        {/* Row 2 */}
        <button onClick={() => handleFunction("sqrt")} className={opBtnClass()} style={{ height: "3rem", fontSize: "0.8125rem" }}>√</button>
        <button onClick={() => handleFunction("square")} className={opBtnClass()} style={{ height: "3rem", fontSize: "0.8125rem" }}>x²</button>
        <button onClick={() => handleFunction("cube")} className={opBtnClass()} style={{ height: "3rem", fontSize: "0.8125rem" }}>x³</button>
        <button onClick={() => handleFunction("inv")} className={opBtnClass()} style={{ height: "3rem", fontSize: "0.8125rem" }}>1/x</button>
        <button onClick={handleBackspace} className={opBtnClass()} style={{ height: "3rem" }}><Delete className="h-4 w-4" /></button>

        {/* Row 3 */}
        <button onClick={() => handleFunction("pi")} className={opBtnClass()} style={{ height: "3rem", fontSize: "0.8125rem" }}>π</button>
        <button onClick={() => handleFunction("e")} className={opBtnClass()} style={{ height: "3rem", fontSize: "0.8125rem" }}>e</button>
        <button onClick={() => append("(")} className={opBtnClass()} style={{ height: "3rem" }}>(</button>
        <button onClick={() => append(")")} className={opBtnClass()} style={{ height: "3rem" }}>)</button>
        <button onClick={() => append("%")} className={opBtnClass()} style={{ height: "3rem" }}>%</button>

        {/* Numbers */}
        <button onClick={() => handleNumber("7")} className={btnClass()} style={{ height: "3.2rem" }}>7</button>
        <button onClick={() => handleNumber("8")} className={btnClass()} style={{ height: "3.2rem" }}>8</button>
        <button onClick={() => handleNumber("9")} className={btnClass()} style={{ height: "3.2rem" }}>9</button>
        <button onClick={() => setDisplay(p => p + "/")} className={opBtnClass()} style={{ height: "3.2rem" }}><Divide className="h-4 w-4" /></button>
        <button onClick={() => setDisplay(p => p + "*")} className={opBtnClass()} style={{ height: "3.2rem" }}><X className="h-4 w-4" /></button>

        <button onClick={() => handleNumber("4")} className={btnClass()} style={{ height: "3.2rem" }}>4</button>
        <button onClick={() => handleNumber("5")} className={btnClass()} style={{ height: "3.2rem" }}>5</button>
        <button onClick={() => handleNumber("6")} className={btnClass()} style={{ height: "3.2rem" }}>6</button>
        <button onClick={() => setDisplay(p => p + "-")} className={opBtnClass()} style={{ height: "3.2rem" }}><Minus className="h-4 w-4" /></button>
        <button onClick={() => setDisplay(p => p + "+")} className={opBtnClass()} style={{ height: "3.2rem" }}><Plus className="h-4 w-4" /></button>

        <button onClick={() => handleNumber("1")} className={btnClass()} style={{ height: "3.2rem" }}>1</button>
        <button onClick={() => handleNumber("2")} className={btnClass()} style={{ height: "3.2rem" }}>2</button>
        <button onClick={() => handleNumber("3")} className={btnClass()} style={{ height: "3.2rem" }}>3</button>
        <button onClick={() => append(".")} className={btnClass()} style={{ height: "3.2rem" }}>.</button>
        <button onClick={handleEquals} className="flex items-center justify-center rounded-xl bg-accent-600 text-white text-lg font-semibold transition-all active:scale-95 hover:bg-accent-700 dark:bg-accent-500 dark:hover:bg-accent-400" style={{ height: "3.2rem" }}><Equal className="h-5 w-5" /></button>
      </div>
    </div>
  );
}

function calculate(a: number, b: number, op: string): number {
  switch (op) {
    case "+": return a + b;
    case "−": return a - b;
    case "×": return a * b;
    case "÷": return b !== 0 ? a / b : 0;
    default: return b;
  }
}