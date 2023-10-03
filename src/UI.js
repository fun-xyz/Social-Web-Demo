import "./styles.css";
import React, { useState } from "react";
import useFunDemo from "./useFunDemo";
import Modal from "react-modal";
import SocialConnectorDisplay from "./components/SocialConnectorDisplay";

export const ChecklistItems = ({ stepNumber, children }) => {
  return (
    <ul>
      {React.Children.map(children, (child, idx) => {
        const stepTodo = idx >= stepNumber;
        const className =
          stepNumber === idx ? "upNext" : stepNumber > idx ? "done" : "";
        return (
          <li key={idx} className={className}>
            <div className="progressionPath">
              <div className={`stepIndicator ${stepTodo ? "blue" : "green"}`}>
                {stepTodo ? (
                  idx + 1
                ) : (
                  <img src="checkmark.svg" alt="checkmark" />
                )}
              </div>
              {idx < React.Children.count(children) - 1 && (
                <div
                  className={`verticalLine ${stepTodo ? "blue" : "green"}`}
                ></div>
              )}
            </div>
            {child}
          </li>
        );
      })}
    </ul>
  );
};

export const AsyncButton = ({ children, onClick, disabled }) => {
  const [loading, setLoading] = useState(false);

  return (
    <button
      className={disabled ? "disabled" : ""}
      onClick={async () => {
        if (disabled) return;
        setLoading(true);
        await onClick();
        setLoading(false);
      }}
    >
      {loading ? <div className="loadingIndicator" /> : children}
    </button>
  );
};

const App = () => {
  const [step, setStep] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const { initializeGroupAuthWallet, createWallet, receiptTxId, account } =
    useFunDemo();

  return (
    <div className="App">
      <h1>Create FunWallet with social authentication</h1>
      <ChecklistItems stepNumber={step}>
        <div>
          <h3>
            Connect using socials (open in a new tab if using codesandbox)
          </h3>
          <AsyncButton
            onClick={() => {
              setModalOpen(true);
            }}
          >
            <p>Connect</p>
          </AsyncButton>
        </div>
        <div>
          <h3>Initialize FunWallet</h3>
          {account ? (
            <p>Success! FunWallet Address: {account}</p>
          ) : (
            <AsyncButton
              disabled={step < 1}
              onClick={async () => {
                await initializeGroupAuthWallet();
                setStep(2);
              }}
            >
              <p>Initialize</p>
            </AsyncButton>
          )}
        </div>
        <div>
          <h3> Create FunWallet </h3>
          <AsyncButton
            disabled={step < 2}
            onClick={async () => {
              await createWallet();
              setStep(3);
            }}
          >
            <p>Create</p>
          </AsyncButton>
          {receiptTxId && (
            <div style={{ paddingTop: 10, fontSize: 14 }}>
              <a
                href={`https://goerli.etherscan.io/tx/${receiptTxId}`}
                target="_blank"
                rel="noreferrer"
              >
                Transaction submitted!
              </a>{" "}
              View wallet on{" "}
              <a
                href={`https://goerli.etherscan.io/address/${account}`}
                target="_blank"
                rel="noreferrer"
              >
                block explorer.
              </a>
            </div>
          )}
        </div>
      </ChecklistItems>

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => {
          setModalOpen(false);
        }}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <SocialConnectorDisplay index={3} />
      </Modal>
    </div>
  );
};

export default App;
