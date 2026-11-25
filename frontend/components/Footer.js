export default function Footer() {
    return (
        <footer className="border-t border-[var(--ds-border)] bg-[var(--ds-surface)] text-sm transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-mono font-black text-sm shadow-md">
                        AI
                    </div>
                    <div>
                        <p translate="no" className="font-semibold text-[var(--ds-text)]">Computing & AI Lab</p>
                        <p className="text-[var(--ds-text-muted)] text-xs mt-0.5">
                            Academic Product & Prototype Showcase Platform
                        </p>
                    </div>
                </div>
                <p className="text-[var(--ds-text-muted)] text-xs">
                    © {new Date().getFullYear()} <span translate="no">Computing & AI Lab</span>. All rights reserved.
                </p>
            </div>
        </footer>
    );
}