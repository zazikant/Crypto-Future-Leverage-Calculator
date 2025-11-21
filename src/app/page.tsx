'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { CalculatorInputs, CalculationResults } from '@/types/calculator';
import { calculateFutures, getRiskLevel, getRiskBadgeProps, formatCurrency, formatNumber, formatPercent } from '@/utils/calculations';
import { AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Info, RotateCcw } from 'lucide-react';
import { CopyButton } from '@/components/copy-button';

export default function FuturesCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    positionType: 'long',
    leverage: 200,
    lotSizeDefinition: 0.001,
    entryPrice: 91492,
    lots: 10,
    tpPercent: 0.33,
    slPercent: 1.0,
    fees: 0.53
  });

  const [results, setResults] = useState<CalculationResults | null>(null);
  const [errors, setErrors] = useState<Partial<CalculatorInputs>>({});

  useEffect(() => {
    if (validateInputs()) {
      const calculationResults = calculateFutures(inputs);
      setResults(calculationResults);
    } else {
      setResults(null);
    }
  }, [inputs]);

  const validateInputs = (): boolean => {
    const newErrors: Partial<CalculatorInputs> = {};
    
    if (inputs.leverage < 1 || inputs.leverage > 200) {
      newErrors.leverage = inputs.leverage;
    }
    if (inputs.lotSizeDefinition <= 0) {
      newErrors.lotSizeDefinition = inputs.lotSizeDefinition;
    }
    if (inputs.entryPrice <= 0) {
      newErrors.entryPrice = inputs.entryPrice;
    }
    if (inputs.lots <= 0) {
      newErrors.lots = inputs.lots;
    }
    if (inputs.tpPercent < 0) {
      newErrors.tpPercent = inputs.tpPercent;
    }
    if (inputs.slPercent <= 0) {
      newErrors.slPercent = inputs.slPercent;
    }
    if (inputs.fees < 0) {
      newErrors.fees = inputs.fees;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CalculatorInputs, value: string | number) => {
    // For positionType, keep the string value as-is
    if (field === 'positionType') {
      console.log('Position type changed to:', value);
      setInputs(prev => ({ ...prev, [field]: value }));
      return;
    }
    
    // For numeric fields, convert to number
    const numValue = typeof value === 'string' ? (value === '' ? 0 : parseFloat(value) || 0) : value;
    setInputs(prev => ({ ...prev, [field]: numValue }));
  };

  const handleReset = () => {
    setInputs({
      positionType: 'long',
      leverage: 200,
      lotSizeDefinition: 0.001,
      entryPrice: 91492,
      lots: 10,
      tpPercent: 0.33,
      slPercent: 1.0,
      fees: 0.53
    });
  };

  const riskLevel = getRiskLevel(inputs.leverage);
  const riskBadge = getRiskBadgeProps(riskLevel);

  const positionUnits = inputs.lots * inputs.lotSizeDefinition;

  return (
    <div className="min-h-screen bg-white text-gray-900 p-4">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Futures Leverage Calculator</h1>
          <p className="text-gray-600 text-lg">Calculate minimum balance to avoid liquidation</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl">Position Parameters</CardTitle>
                  <CardDescription className="text-gray-600">
                    Configure your trading position details
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="bg-white border-gray-300 hover:bg-gray-50"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Position Type */}
              <div className="space-y-2">
                <Label htmlFor="positionType">Position Type</Label>
                <RadioGroup
                  value={inputs.positionType}
                  onValueChange={(value) => {
                    console.log('RadioGroup onValueChange:', value);
                    handleInputChange('positionType', value);
                  }}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="long" id="long" />
                    <Label htmlFor="long" className="text-gray-900 cursor-pointer">Long</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="short" id="short" />
                    <Label htmlFor="short" className="text-gray-900 cursor-pointer">Short</Label>
                  </div>
                </RadioGroup>
                {/* Debug info */}
                <div className="text-xs text-gray-500 mt-1">
                  Current: {inputs.positionType}
                </div>
              </div>

              {/* Leverage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="leverage">Leverage (x)</Label>
                  <Badge className={riskBadge.className}>
                    {riskBadge.label}
                  </Badge>
                </div>
                <Input
                  id="leverage"
                  type="number"
                  min="1"
                  max="200"
                  step="1"
                  value={inputs.leverage}
                  onChange={(e) => handleInputChange('leverage', e.target.value)}
                  className={`bg-white border-gray-300 text-gray-900 ${errors.leverage ? 'border-red-500' : ''}`}
                />
                {errors.leverage && (
                  <p className="text-red-500 text-sm">Leverage must be between 1 and 200</p>
                )}
                {inputs.leverage > 100 && (
                  <Alert className="bg-orange-500/10 border-orange-500/20">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <AlertDescription className="text-orange-500 text-sm">
                      Extreme leverage! Consider reducing risk.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Lot Size Definition */}
              <div className="space-y-2">
                <Label htmlFor="lotSizeDefinition">1 Lot = ? Units</Label>
                <Input
                  id="lotSizeDefinition"
                  type="number"
                  step="0.0001"
                  value={inputs.lotSizeDefinition}
                  onChange={(e) => handleInputChange('lotSizeDefinition', e.target.value)}
                  className={`bg-white border-gray-300 text-gray-900 ${errors.lotSizeDefinition ? 'border-red-500' : ''}`}
                />
                <p className="text-gray-500 text-xs">Define how much 1 lot represents</p>
                {errors.lotSizeDefinition && (
                  <p className="text-red-500 text-sm">Lot size must be positive</p>
                )}
              </div>

              {/* Entry Price */}
              <div className="space-y-2">
                <Label htmlFor="entryPrice">Entry Price ($)</Label>
                <Input
                  id="entryPrice"
                  type="number"
                  step="0.01"
                  value={inputs.entryPrice}
                  onChange={(e) => handleInputChange('entryPrice', e.target.value)}
                  className={`bg-white border-gray-300 text-gray-900 ${errors.entryPrice ? 'border-red-500' : ''}`}
                />
                {errors.entryPrice && (
                  <p className="text-red-500 text-sm">Entry price must be positive</p>
                )}
              </div>

              {/* Position Size */}
              <div className="space-y-2">
                <Label htmlFor="lots">Quantity (lots)</Label>
                <Input
                  id="lots"
                  type="number"
                  step="0.01"
                  value={inputs.lots}
                  onChange={(e) => handleInputChange('lots', e.target.value)}
                  className={`bg-white border-gray-300 text-gray-900 ${errors.lots ? 'border-red-500' : ''}`}
                />
                <p className="text-gray-500 text-xs">= {formatNumber(positionUnits, 6)} units</p>
                {errors.lots && (
                  <p className="text-red-500 text-sm">Quantity must be positive</p>
                )}
              </div>

              <Separator className="bg-gray-700" />

              {/* Take Profit */}
              <div className="space-y-2">
                <Label htmlFor="tpPercent">Take Profit %</Label>
                <Input
                  id="tpPercent"
                  type="number"
                  step="0.01"
                  value={inputs.tpPercent}
                  onChange={(e) => handleInputChange('tpPercent', e.target.value)}
                  className={`bg-white border-gray-300 text-gray-900 ${errors.tpPercent ? 'border-red-500' : ''}`}
                />
                {errors.tpPercent && (
                  <p className="text-red-500 text-sm">Take profit must be non-negative</p>
                )}
              </div>

              {/* Stop Loss */}
              <div className="space-y-2">
                <Label htmlFor="slPercent">Stop Loss %</Label>
                <Input
                  id="slPercent"
                  type="number"
                  step="0.1"
                  value={inputs.slPercent}
                  onChange={(e) => handleInputChange('slPercent', e.target.value)}
                  className={`bg-white border-gray-300 text-gray-900 ${errors.slPercent ? 'border-red-500' : ''}`}
                />
                {errors.slPercent && (
                  <p className="text-red-500 text-sm">Stop loss must be positive</p>
                )}
              </div>

              {/* Trading Fees */}
              <div className="space-y-2">
                <Label htmlFor="fees">Trading Fees ($)</Label>
                <Input
                  id="fees"
                  type="number"
                  step="0.01"
                  value={inputs.fees}
                  onChange={(e) => handleInputChange('fees', e.target.value)}
                  className={`bg-white border-gray-300 text-gray-900 ${errors.fees ? 'border-red-500' : ''}`}
                />
                {errors.fees && (
                  <p className="text-red-500 text-sm">Fees must be non-negative</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            {results ? (
              <>
                {/* Main Result */}
                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">Calculation Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="text-sm text-gray-600 mb-2">Minimum Account Balance</div>
                      <div className="text-4xl font-bold text-green-600 mb-4">
                        {formatCurrency(results.minBalance)}
                      </div>
                      <CopyButton 
                        text={formatCurrency(results.minBalance)} 
                        className="bg-white border-gray-300 hover:bg-gray-50"
                      />
                    </div>

                    {/* Warning Alert */}
                    {results.isLiquidationBeforeSL && (
                      <Alert className="bg-red-500/10 border-red-500/20 mb-6">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <AlertDescription className="text-red-500">
                          <div className="font-semibold mb-1">⚠️ Warning: Liquidation Risk!</div>
                          <div className="text-sm">
                            Liquidation will occur at {formatCurrency(results.liqPrice)} before your SL at {formatCurrency(results.slPrice)}
                          </div>
                          <div className="text-sm mt-1">
                            You need {formatCurrency(results.balanceNeededForSL)} in account to reach your SL without liquidation
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}

                    {!results.isLiquidationBeforeSL && (
                      <Alert className="bg-green-500/10 border-green-500/20 mb-6">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <AlertDescription className="text-green-500">
                          ✅ Your SL will trigger before liquidation
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Position Details */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2 text-gray-700">Position Details</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>Position Size:</div>
                          <div className="text-right">{formatNumber(results.positionUnits, 6)} units ({inputs.lots} lots)</div>
                          <div>Notional Value:</div>
                          <div className="text-right">{formatCurrency(results.notionalValue)}</div>
                          <div>Leverage:</div>
                          <div className="text-right">{inputs.leverage}x</div>
                        </div>
                      </div>

                      <Separator className="bg-gray-200" />

                      {/* Breakdown */}
                      <div>
                        <h4 className="font-semibold mb-2 text-gray-700">Cost Breakdown</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>Initial Margin:</div>
                          <div className="text-right">{formatCurrency(results.initialMargin)}</div>
                          <div>Loss at SL:</div>
                          <div className="text-right text-red-600">{formatCurrency(results.lossAtSL)}</div>
                          <div>Trading Fees:</div>
                          <div className="text-right">{formatCurrency(inputs.fees)}</div>
                        </div>
                      </div>

                      <Separator className="bg-gray-200" />

                      {/* Price Levels */}
                      <div>
                        <h4 className="font-semibold mb-2 text-gray-700">Price Levels</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Entry Price:</span>
                            <span>{formatCurrency(inputs.entryPrice)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>TP Price:</span>
                            <span className="text-green-600">
                              {formatCurrency(results.tpPrice)} (+{formatPercent(inputs.tpPercent)})
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>SL Price:</span>
                            <span className="text-red-600">
                              {formatCurrency(results.slPrice)} (-{formatPercent(inputs.slPercent)})
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Liquidation Price:</span>
                            <span className={results.isLiquidationBeforeSL ? "text-red-600 font-semibold" : "text-yellow-600"}>
                              {formatCurrency(results.liqPrice)} (±{formatPercent(results.liquidationPercent)})
                            </span>
                          </div>
                        </div>
                      </div>

                      <Separator className="bg-gray-200" />

                      {/* P&L Scenarios */}
                      <div>
                        <h4 className="font-semibold mb-2 text-gray-700">Profit/Loss Scenarios</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between items-center">
                            <span>If TP hits:</span>
                            <span className="text-green-600 font-semibold">
                              <TrendingUp className="inline h-4 w-4 mr-1" />
                              +{formatCurrency(results.tpProfit)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>If SL hits:</span>
                            <span className="text-red-600 font-semibold">
                              <TrendingDown className="inline h-4 w-4 mr-1" />
                              -{formatCurrency(results.lossAtSL)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Risk Info Card */}
                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Info className="h-5 w-5 text-blue-600" />
                      Risk Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Liquidation Distance:</span>
                      <span className="font-semibold">{formatPercent(results.liquidationPercent)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Risk Level:</span>
                      <Badge className={riskBadge.className}>{riskBadge.label}</Badge>
                    </div>
                    <div className="text-gray-500 text-xs mt-3">
                      Higher leverage increases liquidation risk exponentially. Consider position sizing carefully.
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="text-center py-12">
                  <div className="text-gray-500">
                    <Info className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Enter valid parameters to see calculations</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}