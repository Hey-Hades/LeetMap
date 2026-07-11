export default function Hero() {
  return (
    <div className="flex flex-col items-center text-center pt-20 pb-12 w-full">
      <span className="border border-border text-text-dim text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-wider bg-surface-2">
        2024 Update Live
      </span>
      <h1 className="text-4xl md:text-6xl font-serif font-medium mb-4 text-text leading-tight">
        Targeted prep for <br/>
        <span className="text-gold">top tier</span> offers.
      </h1>
      <p className="text-text-dim max-w-lg text-lg">
        Stop grinding blindly. Focus on the exact problems your target companies actually ask.
      </p>
    </div>
  );
}