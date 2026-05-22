interface ScanButtonProps {
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
}

export default function ScanButton({ onClick, loading, disabled }: ScanButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="scan-btn w-full bg-brand-green text-white font-sans font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none text-base"
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white spinner-dark border-t-transparent rounded-full animate-spin"></div>
          <span>Menganalisis...</span>
        </>
      ) : (
        <>
          <span>Analisis Sekarang</span>
          <span className="text-lg">→</span>
        </>
      )}
    </button>
  );
}
