interface ScoreInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  ariaLabel: string;
}

export function ScoreInput({ value, onChange, ariaLabel }: ScoreInputProps) {
  return (
    <input
      className="score-input"
      type="number"
      inputMode="numeric"
      aria-label={ariaLabel}
      value={value ?? ''}
      placeholder="–"
      onChange={(e) => {
        if (e.target.value === '') {
          onChange(null);
          return;
        }
        const n = Number(e.target.value);
        onChange(Number.isFinite(n) ? n : null);
      }}
    />
  );
}

export function RoundHeader({
  index,
  label,
  onDelete,
}: {
  index: number;
  label?: string;
  onDelete?: () => void;
}) {
  return (
    <th className="round-col">
      <span className="round-label">{label ?? `R${index}`}</span>
      {onDelete && (
        <button
          className="round-delete"
          title={`Delete round ${index}`}
          aria-label={`Delete round ${index}`}
          onClick={onDelete}
        >
          ✕
        </button>
      )}
    </th>
  );
}
