"use client";

interface FilterButtonsProps {
  onFilter: () => void;
  onReset: () => void;
  isApplyDisabled: boolean;
  isResetDisabled?: boolean;
}

export const FilterButtons: React.FC<FilterButtonsProps> = ({
  onFilter,
  onReset,
  isApplyDisabled,
  isResetDisabled = false,
}) => (
  <div className="flex gap-4 mb-4">
    <button
      type="button"
      className="bg-red-400 hover:bg-red-500 text-white px-8 py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
      onClick={onFilter}
      disabled={isApplyDisabled}
    >
      Apply Filters
    </button>
    <button
      type="button"
      className="bg-gray-300 hover:bg-gray-400 text-black px-8 py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
      onClick={onReset}
      disabled={isResetDisabled}
    >
      Reset
    </button>
  </div>
);
