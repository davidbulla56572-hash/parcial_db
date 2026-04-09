function GroupFilter({ options, selectedValue, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={[
            "btn-base min-h-10 px-4 text-sm",
            selectedValue === option.value
              ? "bg-slate-950 text-white shadow-[0_14px_30px_-18px_rgba(15,23,42,0.75)]"
              : "border border-slate-200 bg-white/80 text-slate-600 hover:border-slate-300 hover:text-slate-950",
          ].join(" ")}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default GroupFilter;
