import React from 'react';
import { User, Briefcase } from 'lucide-react';

interface UserTypeSelectorProps {
  selectedType: 'user' | 'admin' | null;
  onSelect: (type: 'user' | 'admin') => void;
}

const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({ selectedType, onSelect }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <button
        type="button"
        onClick={() => onSelect('user')}
        className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
          selectedType === 'user'
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
        }`}
      >
        <User className={`h-8 w-8 mb-2 ${selectedType === 'user' ? 'text-blue-500' : 'text-gray-400'}`} />
        <span className={`font-medium ${selectedType === 'user' ? 'text-blue-700' : 'text-gray-600'}`}>
          Regular User
        </span>
        <span className="text-xs text-gray-500 mt-1">Search across platforms</span>
      </button>

      <button
        type="button"
        onClick={() => onSelect('admin')}
        className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
          selectedType === 'admin'
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
        }`}
      >
        <Briefcase className={`h-8 w-8 mb-2 ${selectedType === 'admin' ? 'text-blue-500' : 'text-gray-400'}`} />
        <span className={`font-medium ${selectedType === 'admin' ? 'text-blue-700' : 'text-gray-600'}`}>
          Admin
        </span>
        <span className="text-xs text-gray-500 mt-1">Manage company search</span>
      </button>
    </div>
  );
};

export default UserTypeSelector;