import Link from "next/link";

// onEdit dan onDelete opsional: hanya diberikan kepada admin
export default function ProductCard({ product, onEdit, onDelete }) {
    const lecturers = product.creators?.lecturers ?? [];
    const students = product.creators?.students ?? [];

    const iconButton =
        "ds-press w-11 h-11 -my-2 inline-flex items-center justify-center rounded-lg text-[var(--ds-text-muted)] hover:bg-[var(--ds-surface-muted)] transition-colors";

    return (
        <div className="group ds-card rounded-2xl shadow-sm flex flex-col h-full overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[var(--ds-primary)] motion-reduce:hover:translate-y-0">
            <div className="p-5 pb-0 flex items-center justify-between gap-2">
                <span className="truncate text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-[color-mix(in_srgb,var(--ds-accent)_12%,transparent)] text-[var(--ds-accent)] border border-[color-mix(in_srgb,var(--ds-accent)_30%,transparent)]">
                    {product.category}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[10px] font-mono font-medium text-[var(--ds-text-muted)] uppercase tracking-wider">
                        PROTOTYPE
                    </span>
                    {onEdit && (
                        <button
                            type="button"
                            onClick={onEdit}
                            aria-label={`Edit ${product.name}`}
                            className={iconButton}
                        >
                            <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                    )}
                    {onDelete && (
                        <button
                            type="button"
                            onClick={onDelete}
                            aria-label={`Delete ${product.name}`}
                            className={`${iconButton} hover:text-red-600 dark:hover:text-red-400`}
                        >
                            <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow space-y-3">
                <h3 className="text-base font-bold text-[var(--ds-text)] group-hover:text-[var(--ds-accent)] transition-colors line-clamp-1">
                    {product.name}
                </h3>

                <p className="text-sm text-[var(--ds-text-muted)] leading-relaxed line-clamp-2 flex-grow">
                    {product.shortDescription}
                </p>

                <div className="pt-3 border-t border-[var(--ds-border)] text-sm space-y-1.5 text-[var(--ds-text-muted)]">
                    <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-[color-mix(in_srgb,var(--ds-primary)_12%,transparent)] text-[var(--ds-primary)] dark:text-indigo-300 font-semibold text-[10px] uppercase">
                            Faculty
                        </span>
                        <span className="truncate">
                            {lecturers.length > 0 ? lecturers.join(", ") : "Not specified"}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold text-[10px] uppercase">
                            Student
                        </span>
                        <span className="truncate">
                            {students.length > 0 ? students.join(", ") : "Not specified"}
                        </span>
                    </div>
                </div>

                <Link
                    href={`/products/${product.id}`}
                    className="ds-press mt-2 w-full min-h-[44px] flex items-center justify-center gap-1.5 rounded-xl bg-[var(--ds-primary)] hover:brightness-110 text-white font-medium text-sm transition"
                >
                    <span>View Product</span>
                    <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </Link>
            </div>
        </div>
    );
}
