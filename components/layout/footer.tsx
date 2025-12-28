interface FooterProps {
  isCollapsed?: boolean
}

export function Footer({ isCollapsed = false }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={`border-t border-white/[0.05] bg-[#030712]/95 backdrop-blur-sm mt-12 transition-[margin] duration-500 ease-in-out ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
      <div className="px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="text-center sm:text-left">
            <p className="text-sm text-slate-300">
              © {currentYear}{" "}
              <a 
                href="https://linktr.ee/asamarsal" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors duration-200 hover:underline"
              >
                Asa Marsal
              </a>
              . All rights reserved.
            </p>
          </div>

          {/* Additional Info */}
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>Built with Next.js</span>
            <span className="">|</span>
            <span className="flex items-center gap-1">
              Powered by Injective x Ninja Labs
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="inline-block"
              >
                {/* Ninja head */}
                <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2"/>
                {/* Ninja mask */}
                <path d="M4 12 Q4 8, 8 8 L16 8 Q20 8, 20 12 L20 14 Q20 16, 18 16 L6 16 Q4 16, 4 14 Z" fill="currentColor"/>
                {/* Eyes */}
                <circle cx="9" cy="11" r="1.5" fill="#0f172a"/>
                <circle cx="15" cy="11" r="1.5" fill="#0f172a"/>
                {/* Headband */}
                <rect x="4" y="6" width="16" height="2" fill="#f60000ff" opacity="0.8"/>
              </svg>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
