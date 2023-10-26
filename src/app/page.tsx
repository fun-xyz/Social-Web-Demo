"use client"; // All React hooks need to be used in a client context
import {
  FunContextProvider,
  Goerli,
  usePrivyAuth,
  useFunWallet,
  useAction,
  ActionType,
  ExecutionReceipt,
} from "@funkit/react";

import React, { useState } from "react";
import { ChecklistItems, AsyncButton } from "./UI";
import Link from "next/link";

// Step 1: Initialize the FunStore. This action configures your environment based on your ApiKey, chain, and the authentication methods of your choosing.
const DEFAULT_FUN_WALLET_CONFIG = {
  apiKey: "hnHevQR0y394nBprGrvNx4HgoZHUwMet5mXTOBhf",
  chain: Goerli,
  gasSponsor: {
    sponsorAddress:
      "0xCB5D0b4569A39C217c243a436AC3feEe5dFeb9Ad" as `0x${string}`, //Gasless payments on Goerli. Please switch to another gas sponsor method, or prefund your wallet on mainnet!
  },
};

function App() {
  const [receiptTxId, setReceiptTxId] = useState("");
  const [step, setStep] = useState(0);
  // const active = false;
  /* ========================================================================
                            STEP 1: CONNECT SOCIAL AUTH PROVIDER
     ======================================================================== */

  const { auth: PrivyAuth, active, authAddr, login, logout } = usePrivyAuth();

 if (active && step === 0) setStep(1);

  async function step1ConnectPrivy() {
    login();
  }

  /* ========================================================================
                              STEP 2: CREATE WALLET
     ======================================================================== */

  const { wallet, address, createFunWallet } = useFunWallet();

  async function step2CreateWallet() {
    if (!active || !PrivyAuth) {
      alert("MetaMask not connected. Please follow the steps in order.");
      return;
    }
    createFunWallet(PrivyAuth).catch();
  }

  /* ========================================================================
                              STEP 3: SEND TRANSACTION
     ======================================================================== */

  const { executeOperation, ready, result } = useAction({
    action: ActionType.create,
    params: null,
  });

  async function step3SendTransaction() {
    if (!ready) {
      alert("FunWallet not initialized. Please follow the steps in order.");
      return;
    }

    // // Add your custom action code here!
    const op = (await executeOperation(PrivyAuth)) as ExecutionReceipt;
    if (!op) return;
    setReceiptTxId(op.txId as string);

    // // FINAL STEP: Add your custom action logic here (swap, transfer, etc)
  }

  return (
    <div className="App p-6 mt-8 ml-4 flex justify-center items-start">
      <div className="w-[600px]">
        <h1>Create FunWallet with Social Auth</h1>
        <ChecklistItems stepNumber={step}>
          {/* ========================================================================
                                  STEP 1: CONNECT A privy Signer
          ======================================================================== */}
          <div>
            <h3>
              {active ? "Social auth connected!" : "Connect using Social auth"}
            </h3>
            {active ? (
              <>
                <p> You are now ready to use FunWallet </p>
                <AsyncButton
                  onClick={async () => {
                    logout();
                  }}
                  disabled={false}
                >
                  <p>logout</p>
                </AsyncButton>
              </>
            ) : (
              <AsyncButton
                onClick={async () => {
                  await step1ConnectPrivy();
                  setStep(1);
                }}
                disabled={false}
              >
                <p>Connect</p>
              </AsyncButton>
            )}
          </div>
          {/* ========================================================================
                                    STEP 2: CREATE WALLET
          ======================================================================== */}
          <div>
            <h3>Initialize FunWallet</h3>
            {address ? (
              <p>Success! FunWallet Address: {address}</p>
            ) : (
              <AsyncButton
                disabled={!active}
                onClick={async () => {
                  await step2CreateWallet();
                  setStep(2);
                }}
              >
                <p>Initialize</p>
              </AsyncButton>
            )}
          </div>
          {/* ========================================================================
                                    STEP 3: SEND TRANSACTION
          ======================================================================== */}
          <div>
            <h3> Create FunWallet </h3>
            <AsyncButton
              disabled={step < 2 || result !== null}
              onClick={async () => {
                await step3SendTransaction();
                setStep(3);
              }}
            >
              <p>Create</p>
            </AsyncButton>
            {receiptTxId && (
              <div style={{ paddingTop: 10, fontSize: 14 }}>
                <Link
                  href={`https://goerli.etherscan.io/tx/${receiptTxId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline text-blue-600"
                >
                  Transaction submitted!
                </Link>{" "}
                View wallet on{" "}
                <Link
                  href={`https://goerli.etherscan.io/address/${address}`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline text-blue-600"
                >
                  block explorer.
                </Link>
              </div>
            )}
          </div>
        </ChecklistItems>
      </div>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <FunContextProvider
      privyAppId={"clnatprpv00sfmi0fv3qc185b"}
      options={DEFAULT_FUN_WALLET_CONFIG}
    >
      <App />
    </FunContextProvider>
  );
}
