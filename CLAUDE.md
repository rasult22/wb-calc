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

# Run tests (watch mode)
npm test

# Run tests once
npm run test:run
```

## Tech Stack

- **React 19** with TypeScript
- **Vite 7** as build tool
- **Vitest** for unit testing
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
- `src/hooks/useIPSettings.ts` - Hook for IP settings management with localStorage persistence
- `src/components/` - UI components:
  - `IPSettingsPanel.tsx` - IP selection, quick settings, tariff options
  - `IPSettingsModal.tsx` - Modal for creating/editing IP profiles
  - `ProductForm.tsx` - Product input form
  - `ResultCard.tsx` - Calculation results display
- `src/data/` - Reference data:
  - `categories.ts` - WB product categories with commission rates (FBO/FBS)
  - `warehouses.ts` - WB warehouse tariffs (delivery/storage per liter)
  - `tariffOptions.ts` - Optional WB subscription features that add to commission
  - `logisticsRates.ts` - Base logistics rates and volume coefficients
  - `ipSettings.ts` - Default seller (IP) profiles

### Key Concepts

- **FBO vs FBS**: Two fulfillment models - FBO (stored at WB warehouse) vs FBS (seller ships to WB)
- **Короб vs Моно**: Delivery types - box shipment vs mono-palette
- **Commission**: Base rate from category + optional tariff features
- **IP Settings**: Individual seller's tax regime, margin threshold, acquiring fees

### IP Settings Module

The `useIPSettings` hook manages multiple IP (seller) profiles:
- **CRUD operations**: create, update, delete IP profiles
- **localStorage keys**: `wb-calc-ip-settings` (profiles), `wb-calc-selected-ip` (selected ID)
- **Each IP has**: id, name, margin_type, min_margin, tax_usn, tax_type, tax_nds, acquiring, selected_options
- **Margin types**: "Маржинальность прихода" (profit/cost) vs "Маржинальность продаж" (profit/revenue)
- **Quick settings**: Users can edit IP parameters inline without opening modal

### Calculation Logic

The main `calculateUnitEconomics()` function in `src/utils/calculator.ts` implements the full formula chain:
1. Volume calculation from dimensions
2. Commission rate from category + tariff options
3. Logistics cost based on warehouse and volume
4. Return handling costs
5. Tax calculation (supports different tax bases)
6. Final profit = income - real costs
7. Decision (buy/don't buy) based on margin threshold

## Testing

Tests are located in `src/utils/__tests__/` and use Vitest framework.

### Test Structure
- `calculator.test.ts` - Unit and integration tests for calculator functions
- `fixtures/resnitsy.ts` - Test data from Excel "Калькулятор маржи СР7.0" (row 141)

### Golden Test Case "ресницы"
Input: purchase=146₽, sale=600₽, category="Накладные ресницы" (32.5%), warehouse="Коледино", FBO
Expected: profit=146.39₽, ROI=85.97%, margin_sales=24.40%, margin_income=46.23%

### Running Tests
```bash
npm test        # watch mode
npm run test:run  # single run
```

## Reference Data Sources

- **Commissions**: `public/data/wb_commissions.csv` - loaded at runtime via fetch
  - Source: Excel "📄 Комиссии" sheet
  - To update: export Excel sheet to CSV, then run `python -X utf8 scripts/convert_commissions.py`
- **Warehouses**: `src/data/warehouses.ts` - WB warehouse tariffs
- **Tariff Options**: `src/data/tariffOptions.ts` - WB subscription features

## Detailed Specification

See `WB_CALCULATOR_SPEC.md` for comprehensive documentation of all formulas, data structures, and calculation logic derived from the original Excel calculator.