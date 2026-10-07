import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[82vh] bg-[#f7f1eb] text-[#1e2617] flex flex-col items-center justify-center relative overflow-hidden px-6 py-20 text-center">
      {/* Soft Decorative Ambient Arch Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] sm:w-[600px] aspect-square rounded-full bg-[#dfcca5]/25 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
        {/* Cursive Subtitle */}
        <span className="font-script text-4xl sm:text-5xl md:text-6xl text-[#c2a878] tracking-wide mb-2 select-none">
          Oops... Page Not Found
        </span>

        {/* Big 404 Headline */}
        <h1 className="font-belleza text-7xl sm:text-9xl font-light tracking-[0.15em] text-[#1e2617] mb-2 select-none">
          404
        </h1>

        {/* Decorative Divider */}
        <div className="w-20 h-[1px] bg-[#c2a878] mb-6" />

        {/* Descriptive Text */}
        <p className="font-poppins text-sm sm:text-base font-light text-[#1e2617]/80 leading-relaxed max-w-lg mb-10">
          The page you are looking for might have been relocated or does not exist. Let us guide you back to our bespoke services and studio experience.
        </p>

        {/* Navigation Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <Link
            href="/"
            className="font-belleza px-8 py-3.5 bg-[#1e2617] text-[#f7f1eb] hover:bg-[#c2a878] hover:text-[#1e2617] text-xs sm:text-sm uppercase tracking-[0.2em] font-medium transition-all duration-300 shadow-md"
          >
            RETURN HOME
          </Link>

          <Link
            href="/#services"
            className="font-belleza px-8 py-3.5 border border-[#1e2617] text-[#1e2617] hover:bg-[#1e2617] hover:text-[#f7f1eb] text-xs sm:text-sm uppercase tracking-[0.2em] font-medium transition-all duration-300"
          >
            OUR SERVICES
          </Link>

          <Link
            href="/contact"
            className="font-belleza px-8 py-3.5 border border-[#c2a878] text-[#1e2617] hover:bg-[#c2a878] hover:text-[#1e2617] text-xs sm:text-sm uppercase tracking-[0.2em] font-medium transition-all duration-300"
          >
            CONTACT US
          </Link>
        </div>
      </div>
    </div>
  );
}
