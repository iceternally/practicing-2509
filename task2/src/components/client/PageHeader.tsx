'use client';

import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description, 
  className = "" 
}) => {
  return (
    <header className={`mb-6 ${className}`}>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {title}
      </h1>
      {description && (
        <p className="text-lg text-gray-600">
          {description}
        </p>
      )}
    </header>
  );
};

export default PageHeader;