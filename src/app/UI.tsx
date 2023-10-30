import Image from "next/image";
import React, { useState } from "react";

export const ChecklistItems = ({ stepNumber, children }: {stepNumber: number; children: React.ReactNode}) => {
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
                  <Image src="checkmark.svg" alt="checkmark" width={16} height={16}/>
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

export const AsyncButton = ({ children, onClick, disabled }: {children: React.ReactNode, onClick: () => Promise<void>; disabled: boolean}) => {
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
