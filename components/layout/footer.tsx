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
            <span>Powered by Injective x Ninja Labs</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
