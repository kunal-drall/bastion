# Bastion Protocol

**Decentralized, AI-Driven Insurance**

## Overview

Bastion Protocol is a decentralized insurance and hedging solution built on the blockchain. It protects DeFi traders from extreme market volatility by automating risk assessments and claim processing using AI, Move smart contracts, and real-time market data from Merkle Trade.

## Key Features

- **AI-Driven Risk Assessment:** Continuously evaluates market volatility and dynamically adjusts insurance premiums.
- **Automated Claims Processing:** Processes claims automatically through trustless Move smart contracts.
- **Blockchain Transparency:** All transactions (policy creation, premium payments, claim payouts) are recorded on Aptos.
- **Real-Time Data Integration:** Uses Merkle Trade’s TypeScript SDK and WebSocket APIs for live market insights.

## Technical Details

- **Blockchain:** 
- **Smart Contracts:** Written in Move for policy management.
- **SDKs Used:**
  - **Move Agent Kit:** For interacting with on-chain Move contracts.
  - **Merkle Trade TS SDK & WebSocket APIs:** For fetching real-time trading data.
- **Frontend:** Built using the Aptos Full-Stack Template with React for wallet integration and UI.
- **Backend:** Node.js/Express server handling API endpoints to interact with Move Agent Kit.

## How It Works

1. **Policy Purchase:**  
   Users connect their Aptos wallet via our dApp and purchase insurance policies.
2. **Risk Monitoring:**  
   AI agents analyze real-time market data and on-chain events to assess risk.
3. **Dynamic Adjustments & Claims:**  
   If risk thresholds are met, the protocol automatically adjusts premiums and processes claims via Move smart contracts.
4. **Transparency:**  
   All transactions are verifiable on the Aptos blockchain.

## Setup & Installation

### Prerequisites

- [Rust & Cargo](https://rustup.rs/)
- [Node.js v16+](https://nodejs.org/)
- Aptos CLI (use stable release or prebuilt binary to avoid build issues)

### Clone the Repository

```bash
git clone https://github.com/kunal-drall/bastion-protocol.git
cd bastion-protocol
