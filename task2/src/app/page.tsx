import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <main className="text-center">
        <h1 className="text-4xl font-bold mb-4">Real Estate Analytics Hub</h1>
        <p className="text-lg text-gray-600 mb-8">Your one-stop solution for property valuation and market analysis.</p>
        <div className="flex justify-center gap-4">
          <Link href="/property-value-estimator" className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors">
            Property Value Estimator
          </Link>
          <Link href="/property-market-analysis" className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors">
            Property Market Analysis
          </Link>
        </div>
      </main>
    </div>
  );
}
