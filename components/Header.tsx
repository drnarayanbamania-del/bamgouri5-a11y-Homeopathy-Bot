import React from 'react';

interface HeaderProps {
  onReset: () => void;
}

const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <header className="bg-white p-4 flex items-center justify-center gap-3 shadow-sm border-b border-gray-100 sticky top-0 z-10 relative">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img 
            src="https://bamgouri5-a11y.github.io/Homeopathy-Bot/doctor.jpg" 
            alt="Dr. Bhavna" 
            className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
          />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <div>
          <h1 className="text-lg font-bold text-blue-800 leading-tight">
            Dr. Bhavna
          </h1>
          <p className="text-xs text-blue-500 font-medium">
            Homeopathy Consultant
          </p>
        </div>
      </div>

      <button 
        onClick={onReset}
        className="absolute right-4 p-2 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-full transition-all"
        title="Clear Conversation"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
        </svg>
      </button>
    </header>
  );
};

export default Header;