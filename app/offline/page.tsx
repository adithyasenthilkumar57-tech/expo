"use client";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center p-6">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/30">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">You&apos;re offline</h1>
        <p className="text-slate-400 mb-6 max-w-xs mx-auto">
          OpsAgent needs a connection to fetch your latest data. Please check your network and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary px-6 py-3 text-sm"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
