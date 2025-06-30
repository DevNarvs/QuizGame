'use client';

import React from 'react';

type QuestionProps = {
  question: string;
  options: string[];
  onSelect: (answer: string) => void;
  currentIndex: number;
  total: number;
};

const QuestionCard: React.FC<QuestionProps> = ({
  question,
  options,
  onSelect,
  currentIndex,
  total,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">
        Question {currentIndex + 1} of {total}
      </h2>
      <p className="text-lg mb-6">{question}</p>

      <div className="space-y-3">
        {options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(option)}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
