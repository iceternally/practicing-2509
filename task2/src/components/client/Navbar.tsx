'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav 
      className="bg-gray-800 p-4" 
      aria-label="Main navigation"
    >
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo/Home Link */}
          <Link 
            href="/" 
            className="text-white text-xl font-bold hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 rounded-md px-2 py-1"
            aria-label="Go to homepage"
          >
            Property Hub
          </Link>

          {/* Main Navigation */}
          <ul className="flex space-x-1">
            <li>
              <Link 
                href="/property-value-estimator" 
                className={`text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 ${
                  pathname === '/property-value-estimator' 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
                aria-current={pathname === '/property-value-estimator' ? 'page' : undefined}
              >
                Property Value Estimator
              </Link>
            </li>
            <li>
              <Link 
                href="/property-market-analysis" 
                className={`text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 ${
                  pathname === '/property-market-analysis' 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
                aria-current={pathname === '/property-market-analysis' ? 'page' : undefined}
              >
                Property Market Analysis
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;