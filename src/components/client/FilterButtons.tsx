"use client";

interface FilterButtonsProps {
  onFilter: () => void;
  onReset: () => void;
  isFilterDisabled: boolean;
}

export const FilterButtons: React.FC<FilterButtonsProps> = ({ onFilter, onReset, isFilterDisabled }) => (
  <div className="flex gap-4 mb-4">
    <button
      className="bg-red-400 hover:bg-red-500 text-white px-8 py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
      onClick={onFilter}
      disabled={isFilterDisabled}
    >
      Apply Filters
    </button>
    <button
      className="bg-gray-300 hover:bg-gray-400 text-black px-8 py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
      onClick={onReset}
      disabled={isFilterDisabled}
    >
      Reset
    </button>
  </div>
);
