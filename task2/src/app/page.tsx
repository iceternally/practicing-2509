import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      <main className="w-full max-w-3xl text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Real Estate Analytics Hub</h1>
        <p className="text-base sm:text-lg text-gray-600 mb-8">Your one-stop solution for property valuation and market analysis.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 w-full">
          <Link href="/property-value-estimator" className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors text-center">
            Property Value Estimator
          </Link>
          <Link href="/property-market-analysis" className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors text-center">
            Property Market Analysis
          </Link>
        </div>
      </main>
    </div>
  );
}
