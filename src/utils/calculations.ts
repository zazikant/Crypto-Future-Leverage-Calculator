import { CalculatorInputs, CalculationResults, RiskLevel } from '@/types/calculator';

export function calculateFutures(inputs: CalculatorInputs): CalculationResults {
  const {
    positionType,
    leverage,
    maintenanceMargin,
    lotSizeDefinition,
    entryPrice,
    lots,
    tpPercent,
    slPercent,
    fees
  } = inputs;

  // 1. Position Units
  const positionUnits = lots * lotSizeDefinition;

  // 2. Notional Value
  const notionalValue = positionUnits * entryPrice;

  // 3. Initial Margin
  const initialMargin = notionalValue / leverage;

  // 4. Liquidation Distance %
  const liquidationPercent = maintenanceMargin;

  // 5. TP Price
  const tpPrice = positionType === 'long' 
    ? entryPrice * (1 + tpPercent / 100)
    : entryPrice * (1 - tpPercent / 100);

  // 6. SL Price
  const slPrice = positionType === 'long'
    ? entryPrice * (1 - slPercent / 100)
    : entryPrice * (1 + slPercent / 100);

  // 7. Price Move to SL
  const priceMove = Math.abs(slPrice - entryPrice);

  // 8. Loss at SL
  const lossAtSL = priceMove * positionUnits;

  // 9. Liquidation Price
  const liqPrice = positionType === 'long'
    ? entryPrice * (1 - liquidationPercent / 100)
    : entryPrice * (1 + liquidationPercent / 100);

  // 10. Minimum Account Balance
  const minBalance = initialMargin + lossAtSL + fees;

  // 11. TP Profit
  const tpMove = Math.abs(tpPrice - entryPrice);
  const tpProfit = (tpMove * positionUnits) - fees;

  // 12. Check if liquidation happens before SL
  const isLiquidationBeforeSL = positionType === 'long'
    ? liqPrice > slPrice
    : liqPrice < slPrice;

  // 13. Balance needed to reach SL without liquidation
  const balanceNeededForSL = isLiquidationBeforeSL 
    ? Math.abs(slPrice - liqPrice) * positionUnits
    : 0;

  return {
    positionUnits,
    notionalValue,
    initialMargin,
    liquidationPercent,
    tpPrice,
    slPrice,
    liqPrice,
    lossAtSL,
    minBalance,
    tpProfit,
    isLiquidationBeforeSL,
    balanceNeededForSL
  };
}

export function getRiskLevel(leverage: number): RiskLevel {
  if (leverage <= 10) return 'conservative';
  if (leverage <= 50) return 'moderate';
  if (leverage <= 100) return 'aggressive';
  return 'extreme';
}

export function getRiskBadgeProps(riskLevel: RiskLevel) {
  switch (riskLevel) {
    case 'conservative':
      return {
        label: 'Conservative',
        className: 'bg-green-500/10 text-green-500 border-green-500/20'
      };
    case 'moderate':
      return {
        label: 'Moderate',
        className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      };
    case 'aggressive':
      return {
        label: 'Aggressive',
        className: 'bg-orange-500/10 text-orange-500 border-orange-500/20'
      };
    case 'extreme':
      return {
        label: 'Extreme Risk',
        className: 'bg-red-500/10 text-red-500 border-red-500/20'
      };
  }
}

export function formatCurrency(amount: number, decimals: number = 2): string {
  const sign = amount < 0 ? '-' : '';
  const abs = Math.abs(amount);
  let d = decimals;
  // Adaptive precision for sub-$1 values so small prices are not rounded away
  // (e.g. $0.0027 instead of $0.00)
  if (abs > 0 && abs < 1) {
    if (abs >= 0.01) {
      d = Math.max(decimals, 4);
    } else if (abs >= 0.0001) {
      d = Math.max(decimals, 6);
    } else {
      d = Math.max(decimals, 8);
    }
  }
  let str = abs.toFixed(d);
  // Strip trailing zeros beyond the standard decimals for clean output
  if (d > decimals) {
    str = str.replace(/(\.\d{2}\d*?)0+$/, '$1');
    if (str.endsWith('.')) {
      str = str.slice(0, -1);
    }
  }
  return `${sign}$${str}`;
}

export function formatNumber(amount: number, decimals: number = 4): string {
  return amount.toFixed(decimals);
}

export function formatPercent(amount: number, decimals: number = 2): string {
  return `${amount.toFixed(decimals)}%`;
}