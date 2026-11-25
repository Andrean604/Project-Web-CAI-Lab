export default function VideoPlaceholder({ videoUrl, title }) {
    return (
        <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-md relative flex items-center justify-center">
            {videoUrl ? (
                <iframe
                    src={videoUrl}
                    title={title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            ) : (
                <div className="text-center p-6 text-slate-400 space-y-2">
                    <svg className="w-12 h-12 mx-auto text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="font-mono text-xs">Product Demo Video Not Available</p>
                </div>
            )}
        </div>
    );
}