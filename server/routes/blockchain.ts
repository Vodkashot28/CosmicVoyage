/**
 * Blockchain Integration Routes
 * Handles contract interactions and blockchain queries
 */

import { Router } from "express";
import ContractManager, { CONTRACT_ADDRESSES } from "../lib/contractIntegration";

const router = Router();

// FIX: Get deployment date from an environment variable or use the current date as a fallback.
const DEPLOYMENT_DATE = process.env.CONTRACT_DEPLOYMENT_DATE || new Date().toISOString();

/**
 * GET /api/blockchain/contracts
 * Get all deployed contract addresses and info
 */
router.get("/contracts", (req, res) => {
  try {
    const contracts = ContractManager.getAllContractInfo();
    res.json({
      success: true,
      network: "testnet",
      contracts,
      // FIX: Using the dynamic or configured deployment date
      deploymentDate: DEPLOYMENT_DATE,
    });
  } catch (error) {
    console.error("Failed to get contracts:", error);
    res.status(500).json({ error: "Failed to get contract info" });
  }
});

/**
 * GET /api/blockchain/contract/:name
 * Get specific contract info
 */
router.get("/contract/:name", (req, res) => {
  try {
    const { name } = req.params;
    const address = CONTRACT_ADDRESSES[name as keyof typeof CONTRACT_ADDRESSES];

    if (!address) {
      return res.status(404).json({ error: "Contract not found" });
    }

    res.json({
      name,
      address,
      explorerUrl: ContractManager.getExplorerUrl(address),
    });
  } catch (error) {
    console.error("Failed to get contract:", error);
    res.status(500).json({ error: "Failed to get contract" });
  }
});

/**
 * GET /api/blockchain/explorer/:address
 * Get explorer URL for any address
 */
router.get("/explorer/:address", (req, res) => {
  try {
    const { address } = req.params;
    res.json({
      address,
      explorerUrl: ContractManager.getExplorerUrl(address),
    });
  } catch (error) {
    console.error("Failed to get explorer URL:", error);
    res.status(500).json({ error: "Failed to get explorer URL" });
  }
});

export default router;
