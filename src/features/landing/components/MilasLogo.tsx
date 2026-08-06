export function MilasLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex flex-col items-start leading-none">
      <span className="font-display text-[1.35rem] italic text-[#2a1e22] md:text-[1.5rem]">
        Milas
      </span>
      {!compact && (
        <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.45em] text-[#867275]">
          Calzados · Lima Perú
        </span>
      )}
    </div>
  );
}
