import React from 'react';
import ScorecardList from '../components/ScorecardList';

const LibraryScreen = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Public Library</h1>
        <ScorecardList />
      </div>
    </div>
  );
};

export default LibraryScreen; 