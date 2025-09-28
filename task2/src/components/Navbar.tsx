import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between">
        <div className="flex space-x-4">
          <Link href="/property-value-estimator" className="text-white">
            Property Value Estimator
          </Link>
          <Link href="/property-market-analysis" className="text-white">
            Property Market Analysis
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;