import React from 'react';
import { useForm } from 'react-hook-form';
import type { StudioFilterParams } from '../../../types/index';

interface StudioFiltersProps {
  filters: StudioFilterParams;
  onFilterChange: (filters: StudioFilterParams) => void;
}

export const StudioFilters: React.FC<StudioFiltersProps> = ({ filters, onFilterChange }) => {
  const { register, handleSubmit } = useForm<StudioFilterParams>({
    defaultValues: filters,
  });

  const onSubmit = (data: StudioFilterParams) => {
    // Remove empty strings to keep query clean
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== '' && v !== null)
    );
    onFilterChange(cleanData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-lg border p-4 shadow-sm bg-white">
      <div>
        <h3 className="font-semibold mb-4">Filters</h3>
        
        {/* City Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">City</label>
          <select {...register('city')} className="w-full rounded-md border p-2">
            <option value="">All Cities</option>
            <option value="Алматы">Алматы</option>
            <option value="Астана">Астана</option>
          </select>
        </div>

        {/* Room Type Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Room Type</label>
          <select {...register('room_type')} className="w-full rounded-md border p-2">
            <option value="">Any Type</option>
            <option value="Fashion">Fashion</option>
            <option value="Portrait">Portrait</option>
            <option value="Creative">Creative</option>
            <option value="Commercial">Commercial</option>
          </select>
        </div>

        {/* Price Range */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Price Range (KZT)</label>
          <div className="flex gap-2">
            <input 
              type="number" 
              placeholder="Min" 
              {...register('min_price')} 
              className="w-1/2 rounded-md border p-2"
            />
            <input 
              type="number" 
              placeholder="Max" 
              {...register('max_price')} 
              className="w-1/2 rounded-md border p-2"
            />
          </div>
        </div>
      </div>

      <button type="submit" className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700">
        Apply Filters
      </button>
    </form>
  );
};