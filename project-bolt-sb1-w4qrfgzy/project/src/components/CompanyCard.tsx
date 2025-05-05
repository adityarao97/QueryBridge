import React from 'react';
import { Company } from '../types';

interface CompanyCardProps {
  company: Company;
  isSelected: boolean;
  onClick: () => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, isSelected, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        relative rounded-lg overflow-hidden shadow-md transition-all duration-300 cursor-pointer
        ${isSelected 
          ? 'ring-2 ring-blue-500 transform scale-105 opacity-100' 
          : 'hover:shadow-lg hover:transform hover:scale-102 opacity-70 hover:opacity-100'
        }
      `}
    >
      <div className="h-32 bg-gray-200 overflow-hidden">
        <img 
          src={company.logo} 
          alt={`${company.name} logo`} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="text-lg font-bold">{company.name}</h3>
      </div>
      
      <div className="p-4 bg-white">
        <p className="text-sm text-gray-600 line-clamp-2">{company.searchDescription}</p>
      </div>
      
      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default CompanyCard;