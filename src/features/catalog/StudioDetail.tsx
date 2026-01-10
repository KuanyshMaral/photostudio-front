import React from 'react';
import { useParams } from 'react-router-dom';

const StudioDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Studio Details - {id}
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">Studio detail page for studio ID: {id}</p>
          <p className="text-gray-500 mt-2">This page will show detailed information about the selected studio.</p>
        </div>
      </div>
    </div>
  );
};

export default StudioDetail;
