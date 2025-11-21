Rules:

A) copy the trading fees from delta exchange fees calculator. Total Profit and loss are shown in App. The actuall profit is minus this tax and total loss is with plus this tax
B) Adjust stop loss to 1.2% in case of volatility

## Updated Brief: Futures Leverage Calculator App https://crypto-future-leverage-calculator.vercel.app/

---

## Tech Stack
- **Framework**: Next.js (TypeScript)
- **Styling**: Tailwind CSS
- **Type**: Single-page calculator with real-time calculations

---

## App Purpose
Calculate the minimum account balance needed to hold a futures position until stop loss without getting liquidated at any leverage level.

---

## UI Layout

### Header Section
- Title: "Futures Leverage Calculator"
- Subtitle: "Calculate minimum balance to avoid liquidation"

---

### Input Fields (Auto-calculate on change)

**1. Position Type**
- Component: Dropdown/Select
- Options: "Long" | "Short"
- Default: "Long"

**2. Leverage**
- Component: Number input
- Placeholder: "Enter leverage (e.g., 200)"
- Label: "Leverage (x)"
- Default value: 200
- Min: 1, Max: 200
- Step: 1

**3. Lot Size Definition**
- Component: Number input
- Placeholder: "Enter lot size (e.g., 0.001)"
- Label: "1 Lot = ? Units"
- Default value: 0.001
- Step: 0.0001
- Helper text: "Define how much 1 lot represents"

**4. Entry Price**
- Component: Number input
- Placeholder: "Enter entry price (e.g., 91492)"
- Label: "Entry Price ($)"

**5. Position Size (Lots)**
- Component: Number input
- Placeholder: "Enter lot size (e.g., 10)"
- Label: "Quantity (lots)"
- Helper text: Dynamic based on lot definition: "= X.XXX units"

**6. Take Profit %**
- Component: Number input
- Default value: 0.33
- Label: "Take Profit %"
- Step: 0.01

**7. Stop Loss %**
- Component: Number input
- Default value: 1.0
- Label: "Stop Loss %"
- Step: 0.1

**8. Trading Fees**
- Component: Number input
- Default value: 0.53
- Label: "Trading Fees ($)"
- Step: 0.01

---

## Calculation Logic

### Variables to Calculate:

**1. Position Units**
```
positionUnits = lots × lotSizeDefinition
```

**2. Notional Value**
```
notionalValue = positionUnits × entryPrice
```

**3. Initial Margin (flexible leverage)**
```
initialMargin = notionalValue ÷ leverage
```

**4. Liquidation Distance %**
```
liquidationPercent = 100 ÷ leverage
```
Example: 200x = 0.5%, 100x = 1%, 50x = 2%

**5. TP Price**
- **For Long**: `tpPrice = entryPrice × (1 + tpPercent/100)`
- **For Short**: `tpPrice = entryPrice × (1 - tpPercent/100)`

**6. SL Price**
- **For Long**: `slPrice = entryPrice × (1 - slPercent/100)`
- **For Short**: `slPrice = entryPrice × (1 + slPercent/100)`

**7. Price Move to SL**
```
priceMove = Math.abs(slPrice - entryPrice)
```

**8. Loss at SL**
```
lossAtSL = priceMove × positionUnits
```

**9. Liquidation Price**
- **For Long**: `liqPrice = entryPrice × (1 - liquidationPercent/100)`
- **For Short**: `liqPrice = entryPrice × (1 + liquidationPercent/100)`

**10. Minimum Account Balance**
```
minBalance = initialMargin + lossAtSL + fees
```

**11. TP Profit (optional display)**
```
tpMove = Math.abs(tpPrice - entryPrice)
tpProfit = (tpMove × positionUnits) - fees
```

---

## Output Display Section

### Results Card (Auto-updates)

Display in a clean card format:

**Primary Result (Large, Bold)**
- "Minimum Account Balance: **$X.XX**"

**Position Details**
- Position Size: X.XXX units (X lots)
- Notional Value: $X,XXX.XX
- Leverage: Xx

**Breakdown Section**
- Initial Margin: $X.XX
- Loss at SL: $X.XX
- Trading Fees: $X.XX

**Price Levels**
- Entry Price: $X.XX
- TP Price: $X.XX (±X.XX%)
- SL Price: $X.XX (±X.XX%)
- Liquidation Price: $X.XX ⚠️ (±X.XX%)

**Profit/Loss Scenarios**
- If TP hits: +$X.XX ✅
- If SL hits: -$X.XX ❌

**Warning Messages**

If liquidation closer than SL:
- Display in red: "⚠️ **Warning**: Liquidation will occur at $X.XX before your SL at $X.XX"
- "You need $X.XX in account to reach your SL without liquidation"

If liquidation further than SL:
- Display in green: "✅ Your SL will trigger before liquidation"

---

## UX Requirements

### Real-time Calculation
- **No submit button**
- Calculations update instantly on any input change
- Use `onChange` handlers for all inputs
- Show calculated "units" dynamically when lots or lot definition changes

### Input Validation
- All numeric inputs must be positive numbers
- Leverage: 1-200 range
- Show error state for invalid inputs
- Disable calculations if required fields empty
- Show warning if leverage > 100x

### Responsive Design
- Mobile-first approach
- Single column on mobile
- Two-column layout on desktop (inputs left, results right)

### Visual Feedback
- Success state: Green accent when SL is reachable
- Warning state: Red/yellow when liquidation comes first
- Info badges for leverage risk levels:
  - 1-10x: "Conservative" (green)
  - 11-50x: "Moderate" (yellow)
  - 51-100x: "Aggressive" (orange)
  - 101-200x: "Extreme Risk" (red)

---

## Component Structure

```
app/
├── page.tsx (main calculator component)
├── components/
│   ├── InputSection.tsx (all input fields)
│   ├── LeverageBadge.tsx (risk level indicator)
│   ├── ResultsCard.tsx (calculation results)
│   ├── PriceLevels.tsx (TP/SL/Liq display)
│   └── WarningAlert.tsx (liquidation warnings)
├── utils/
│   └── calculations.ts (all calculation functions)
└── types/
    └── calculator.ts (TypeScript interfaces)
```

---

## TypeScript Interfaces

```typescript
interface CalculatorInputs {
  positionType: 'long' | 'short';
  leverage: number;
  lotSizeDefinition: number; // 1 lot = X units
  entryPrice: number;
  lots: number;
  tpPercent: number;
  slPercent: number;
  fees: number;
}

interface CalculationResults {
  positionUnits: number;
  notionalValue: number;
  initialMargin: number;
  liquidationPercent: number;
  tpPrice: number;
  slPrice: number;
  liqPrice: number;
  lossAtSL: number;
  minBalance: number;
  tpProfit: number;
  isLiquidationBeforeSL: boolean;
  balanceNeededForSL: number;
}
```

---

## Styling Guidelines

### Color Scheme
- Background: Dark theme (bg-gray-900)
- Cards: bg-gray-800
- Text: text-gray-100
- Accents: 
  - Green (#10b981) for profits/safe
  - Red (#ef4444) for losses/danger
  - Orange (#f59e0b) for warnings
  - Blue (#3b82f6) for inputs
  - Yellow (#eab308) for caution

### Typography
- Headers: text-2xl font-bold
- Labels: text-sm font-medium
- Values: text-lg font-semibold
- Helper text: text-xs text-gray-400
- Warning text: text-sm font-semibold

### Spacing
- Container: max-w-6xl mx-auto px-4 py-8
- Card padding: p-6
- Input spacing: space-y-4
- Section gaps: gap-8

### Badges/Pills
- Leverage risk badges: px-3 py-1 rounded-full text-xs font-semibold

---

## Example Values (for testing)

**Test Case 1: Short Position (200x)**
- Position: Short
- Leverage: 200
- 1 Lot: 0.001 units
- Entry: 91492
- Lots: 10
- TP%: 0.33
- SL%: 1.0
- Fees: 0.53
- **Expected Result: ~$15**

**Test Case 2: Long Position (50x)**
- Position: Long
- Leverage: 50
- 1 Lot: 0.001 units
- Entry: 91190
- Lots: 10
- TP%: 0.33
- SL%: 1.0
- Fees: 0.53
- **Expected Result: ~$28** (2% liquidation distance)

**Test Case 3: Different Asset (100x)**
- Position: Long
- Leverage: 100
- 1 Lot: 0.01 units
- Entry: 3500
- Lots: 5
- TP%: 0.5
- SL%: 1.5
- Fees: 0.30
- **Expected Result: Calculate**

---

## Additional Features (Optional)

1. **Copy Result Button**: Copy minimum balance to clipboard
2. **Reset Button**: Clear all inputs to defaults
3. **Risk/Reward Ratio**: Display TP profit vs SL loss ratio
4. **Points Display**: Show distance in points for TP/SL/Liq
5. **Save Presets**: Save common configurations for different assets
6. **Leverage Slider**: Alternative to number input with visual feedback
7. **ROI Display**: Show return on investment % for TP and SL scenarios

---

## Formula Display Section (Optional Educational Feature)

Add a collapsible section showing the formulas being used:
- Liquidation % = 100 ÷ Leverage
- Initial Margin = Notional Value ÷ Leverage
- Min Balance = Initial Margin + Loss at SL + Fees

---

## Final Notes

- Keep UI clean and minimal - focus on the calculation
- All decimals should display 2 decimal places for USD
- Prices should match entry price decimal places
- Position units should show appropriate decimal places (4-6 decimals)
- Make the "Minimum Account Balance" result the hero element
- Add tooltips for technical terms
- Clearly warn users about extreme leverage risks
- Never mention specific asset names (BTC, ETH, etc.) - keep it generic

---

This brief is ready to hand over to your development agent!
