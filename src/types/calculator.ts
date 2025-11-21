export interface CalculatorInputs {
  positionType: 'long' | 'short';
  leverage: number;
  lotSizeDefinition: number; // 1 lot = X units
  entryPrice: number;
  lots: number;
  tpPercent: number;
  slPercent: number;
  fees: number;
}

export interface CalculationResults {
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

export type RiskLevel = 'conservative' | 'moderate' | 'aggressive' | 'extreme';