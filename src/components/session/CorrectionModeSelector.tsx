'use client';

interface Props {
  value: 'LIGHT' | 'STRICT' | 'FLUENCY';
  onChange: (value: 'LIGHT' | 'STRICT' | 'FLUENCY') => void;
  disabled?: boolean;
}

const modes = [
  { value: 'LIGHT' as const, label: 'Light', desc: 'Major errors only' },
  { value: 'STRICT' as const, label: 'Strict', desc: 'All errors' },
  { value: 'FLUENCY' as const, label: 'Fluency', desc: 'No interruption' },
];

export function CorrectionModeSelector({ value, onChange, disabled }: Props) {
  return (
    <div className="flex items-center gap-1 bg-surface-100 p-1 rounded-xl">
      {modes.map((mode) => (
        <button
          key={mode.value}
          onClick={() => onChange(mode.value)}
          disabled={disabled}
          title={mode.desc}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
            value === mode.value
              ? 'bg-white text-surface-900 shadow-sm'
              : 'text-surface-500 hover:text-surface-700 disabled:cursor-not-allowed'
          }`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
