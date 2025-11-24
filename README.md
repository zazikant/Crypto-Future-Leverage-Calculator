# Crypto Futures Leverage Calculator

This is a Next.js application that provides a client-side cryptocurrency futures leverage calculator. It helps traders calculate the minimum balance required to open a leveraged futures position while avoiding immediate liquidation.

## Features

*   **Long and Short Positions:** Calculate for both long and short positions.
*   **Leverage and Margin:** Input your desired leverage and the contract's maintenance margin.
*   **Position Sizing:** Define your position size in lots and the lot size definition.
*   **Entry, TP, and SL:** Set your entry price, take profit percentage, and stop loss percentage.
*   **Fee Calculation:** Include trading fees in your calculation.
*   **Real-time Calculation:** Results are updated in real-time as you type.
*   **Detailed Results:**
    *   Minimum account balance required.
    *   Liquidation price and distance.
    *   Take profit and stop loss prices.
    *   Potential profit and loss.
    *   Notional value of the position.
    *   Initial margin required.
*   **Risk Assessment:**
    *   Risk level indicator based on leverage.
    *   Warning when the stop loss is beyond the liquidation price.
*   **Reset Functionality:** Easily reset all inputs to their default values.
*   **Copy to Clipboard:** Conveniently copy the calculated minimum balance.

## Technologies Used

*   **Framework:** [Next.js](https://nextjs.org/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
*   **State Management:** [React Hooks](https://reactjs.org/docs/hooks-intro.html) (`useState`, `useEffect`)
*   **Icons:** [Lucide React](https://lucide.dev/guide/packages/lucide-react)

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (version 20 or later)
*   [npm](https://www.npmjs.com/) or [yarn](httpshttps://yarnpkg.com/)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/zazikant/Crypto-Future-Leverage-Calculator.git
    cd crypto-leverage-calculator-new
    ```

2.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Application

To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the calculator.

## How to Use

1.  **Position Type:** Select whether you are opening a "Long" or "Short" position.
2.  **Leverage:** Enter the leverage multiplier you intend to use (e.g., 50 for 50x).
3.  **Maintenance Margin %:** Find this value in the contract details on your exchange. It's the margin percentage at which your position gets liquidated.
4.  **1 Lot = ? Units:** Define how many units of the asset are in one lot (e.g., for BTC, 1 lot might be 0.001 units).
5.  **Entry Price ($):** The price at which you plan to open your position.
6.  **Quantity (lots):** The number of lots you want to trade.
7.  **Take Profit %:** The percentage gain at which you want to close your position.
8.  **Stop Loss %:** The percentage loss at which you want to close your position.
9.  **Trading Fees ($):** The estimated total fees for opening and closing the position.

The "Calculation Results" section will update automatically, providing you with all the critical information for your trade.