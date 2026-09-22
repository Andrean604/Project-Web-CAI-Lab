export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800 text-xs sm:text-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <p className="font-semibold text-slate-200">Computing & AI Lab</p>
                    <p className="text-slate-500 mt-0.5">Academic Product & Prototype Showcase Platform</p>
                </div>
                <p className="text-slate-500">
                    © {new Date().getFullYear()} Computing & AI Lab. All rights reserved.
                </p>
            </div>
        </footer>
    );
}