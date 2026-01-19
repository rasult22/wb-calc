# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WB Calculator (Wildberries Unit Economics Calculator) - a React application for calculating product profitability on the Wildberries marketplace. The app computes profit margins, ROI, logistics costs, and marketplace commissions based on product parameters and seller settings.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production (runs TypeScript check first)
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- **React 19** with TypeScript
- **Vite 7** as build tool
- **Tailwind CSS 4** via `@tailwindcss/vite` plugin
- Deployed to GitHub Pages at `/wb-calc/`

## Architecture

### Core Calculation Flow

```
Reference Data (categories, warehouses, tariffs)
         ↓
Product Input (prices, dimensions, warehouse)  +  IP Settings (tax, commission options)
         ↓
Calculator (src/utils/calculator.ts)
         ↓
CalculationResult (profit, margins, costs breakdown)
```

### Key Files

- `src/types/index.ts` - All TypeScript interfaces (`ProductInput`, `CalculationResult`, `IPSettings`, etc.) and default values
- `src/utils/calculator.ts` - All calculation formulas (volume, logistics, commission, tax, profit)
- `src/App.tsx` - Main component managing state and connecting everything
- `src/data/` - Reference data:
  - `categories.ts` - WB product categories with commission rates (FBO/FBS)
  - `warehouses.ts` - WB warehouse tariffs (delivery/storage per liter)
  - `tariffOptions.ts` - Optional WB subscription features that add to commission
  - `logisticsRates.ts` - Base logistics rates and volume coefficients
  - `ipSettings.ts` - Default seller (IP) tax/acquiring settings

### Key Concepts

- **FBO vs FBS**: Two fulfillment models - FBO (stored at WB warehouse) vs FBS (seller ships to WB)
- **Короб vs Моно**: Delivery types - box shipment vs mono-palette
- **Commission**: Base rate from category + optional tariff features
- **IP Settings**: Individual seller's tax regime, margin threshold, acquiring fees

### Calculation Logic

The main `calculateUnitEconomics()` function in `src/utils/calculator.ts` implements the full formula chain:
1. Volume calculation from dimensions
2. Commission rate from category + tariff options
3. Logistics cost based on warehouse and volume
4. Return handling costs
5. Tax calculation (supports different tax bases)
6. Final profit = income - real costs
7. Decision (buy/don't buy) based on margin threshold

## Detailed Specification

See `WB_CALCULATOR_SPEC.md` for comprehensive documentation of all formulas, data structures, and calculation logic derived from the original Excel calculator.