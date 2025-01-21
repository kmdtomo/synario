import Link from "next/link";

export default function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden">
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-xl font-bold text-gray-800">
            Synario
          </div>
          <Link 
            href="/" 
            className="text-sm text-black hover:text-purple-800 flex items-center"
          >
            <svg 
              className="w-4 h-4 mr-1" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            ホームへ戻る
          </Link>
        </div>
      </header>
      <main className="pt-16 h-full">
        {children}
      </main>
    </div>
  );
} 