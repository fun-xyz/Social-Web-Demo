import {
  convertToValidUserId,
  useConnectors,
  useCreateFun,
  MetamaskConnector,
  CoinbaseWalletConnector,
  WalletConnectConnector,
  SocialOauthConnector,
  SUPPORTED_OAUTH_PROVIDERS,
  Goerli,
  configureNewFunStore,
  usePrimaryAuth,
} from "@funkit/react";
import { useState, useMemo, useCallback } from "react";

//Step 1: Initialize the FunStore. This action configures your environment based on your apikey, chain, and the authentication methods of your choosing.
const DEFAULT_FUN_WALLET_CONFIG = {
  apiKey: "hnHevQR0y394nBprGrvNx4HgoZHUwMet5mXTOBhf",
  chain: Goerli,
  gasSponsor: {
    sponsorAddress: "0xCB5D0b4569A39C217c243a436AC3feEe5dFeb9Ad", //Gasless payments on Goerli. Please switch to another gas sponsor method, or prefund your wallet on mainnet!
  },
};
const DEFAULT_CONNECTORS = [
  MetamaskConnector(),
  CoinbaseWalletConnector("FUN EXAMPLE APP NAME"),
  WalletConnectConnector(),
  SocialOauthConnector(SUPPORTED_OAUTH_PROVIDERS),
];
configureNewFunStore({
  config: DEFAULT_FUN_WALLET_CONFIG,
  connectors: DEFAULT_CONNECTORS,
});

const useFunDemo = () => {
  const [receiptTxId, setReceiptTxId] = useState("");

  //Step 2: Use the initializeFunAccount method to create your funWallet object
  const { activeConnectors: allConnectors } = useConnectors();
  const { account, initializeFunAccount, funWallet } = useCreateFun();
  const [auth] = usePrimaryAuth();

  const activeConnectors = useMemo(() => {
    return allConnectors.filter((connector) => connector.active);
  }, [allConnectors]);

  const initializeGroupAuthWallet = useCallback(() => {
    if (activeConnectors.length === 0) {
      alert("No authentication methods are used. Please follow the steps.");
      return;
    }
    initializeFunAccount({
      users: activeConnectors.map((connection) => ({
        userId: convertToValidUserId(connection.account),
      })),
      index: parseInt(Math.random() * 10000000), //random number
    }).catch();
  }, [initializeFunAccount, activeConnectors]);

  const createWallet = useCallback(async () => {
    if (!funWallet) {
      alert("FunWallet not initialized. Please follow the steps.");
      return;
    }

    // Add your custom action code here!

    //Step 3: Create the operation
    const op = await funWallet.create(auth, await auth.getAddress());

    //Step 4: Execute the operation.

    const receipt = await funWallet.executeOperation(auth, op);
    setReceiptTxId(receipt.txId);

    // FINAL STEP: Add your custom action logic here (swap, transfer, etc)
  }, [funWallet, setReceiptTxId, auth]);

  return { initializeGroupAuthWallet, createWallet, receiptTxId, account };
};

export default useFunDemo;
