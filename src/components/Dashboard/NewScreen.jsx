"use client";

export default function NewScreen({ onLogout }) {
  return (
    <main className="relative z-10 mt-6 flex-grow w-full max-w-[1600px] mx-auto px-6 sm:px-12 py-4">
      {/* Header aligned with the Terminal View */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-[var(--foreground)] tracking-tight mb-2">
            New Module
          </h1>
          <p className="text-[var(--foreground-muted)] text-sm font-medium">
            Add your custom functionality here
          </p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-sm font-semibold bg-[var(--card-bg)] hover:bg-red-500/10 text-[var(--foreground-muted)] hover:text-red-400 border border-[var(--border-color)] hover:border-red-500/30 px-5 py-3 rounded-xl transition-all shadow-sm"
        >
          Sign Out
        </button>
      </div>

      {/* Blank Canvas Container */}
      <div className="bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--border-color)] rounded-3xl shadow-xl flex flex-col p-10 min-h-[500px] items-center justify-center">
        <div className="w-16 h-16 bg-[var(--background)] border border-[var(--border-color)] rounded-3xl flex items-center justify-center mb-4 shadow-inner">
          <svg
            className="w-8 h-8 text-[var(--primary)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
        <p className="text-[var(--foreground)] font-semibold text-xl">
          Module Canvas
        </p>
        <p className="text-[var(--foreground-muted)] text-sm mt-2 max-w-md text-center">
          This container is wired up and ready for expansion. Connect your
          Apollo.io data streams, n8n webhook tables, or advanced AI auditing
          views here.
        </p>
      </div>
    </main>
  );
}
