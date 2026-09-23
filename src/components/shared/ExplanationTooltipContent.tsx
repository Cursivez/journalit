

import React from 'react';

interface ExplanationTooltipContentProps {
  title: string;
  description: string;
  formula: string;
  calculations: readonly string[];
}

export const ExplanationTooltipContent: React.FC<
  ExplanationTooltipContentProps
> = ({ title, description, formula, calculations }) => (
  <div className="journalit-explanation">
    <strong>{title}</strong>
    <p>{description}</p>
    <div className="journalit-explanation-formula">{formula}</div>
    <div className="journalit-explanation-calculations">
      {calculations.map((calculation, index) => (
        <span key={`${index}:${calculation}`}>{calculation}</span>
      ))}
    </div>
  </div>
);
