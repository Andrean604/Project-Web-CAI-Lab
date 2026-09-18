import Link from "next/link";

export default function ProductCard({ product }) {
    return (
        <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all duration-300 flex flex-col h-full overflow-hidden hover:-translate-y-1">
            <div className="p-5 pb-0 flex items-center justify-between">
                <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/50">
                    {product.category}
                </span>
                <span className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider">
                    PROTOTYPE
                </span>
            </div>

            <div className="p-5 flex flex-col flex-grow space-y-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-1">
                    {product.name}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 flex-grow">
                    {product.shortDescription}
                </p>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold text-[10px] uppercase">
                            Faculty
                        </span>
                        <span className="truncate">{product.creators.lecturers.join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold text-[10px] uppercase">
                            Student
                        </span>
                        <span className="truncate">{product.creators.students.join(", ")}</span>
                    </div>
                </div>

                <Link
                    href={`/products/${product.id}`}
                    className="mt-2 w-full text-center py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                    <span>View Product</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </Link>
            </div>
        </div>
    );
}