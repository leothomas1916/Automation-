
import React, { useState } from 'react';
import { PostOptions, PostType, MicroLocation } from '../types';
import { Send, Calendar, MapPin, Tag, ShieldCheck, Clock } from 'lucide-react';

interface PostFormProps {
  onGenerate: (options: PostOptions) => void;
  isLoading: boolean;
}

const LOCATIONS: MicroLocation[] = [
  'Indiranagar',
  'Koramangala',
  'HSR Layout',
  'Marathahalli',
  'Whitefield',
  'Electronic City',
  'JP Nagar',
  'Halasuru',
  'Bangalore General'
];

export const PostForm: React.FC<PostFormProps> = ({ onGenerate, isLoading }) => {
  const [type, setType] = useState<PostType>('screen_repair');
  const [location, setLocation] = useState<MicroLocation>('Indiranagar');
  const [month, setMonth] = useState<string>(new Date().toLocaleString('default', { month: 'long' }));
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [offerDetails, setOfferDetails] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      type,
      location,
      month,
      startDate,
      offerDetails
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      
      {/* Post Type Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Post Strategy</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as PostType)}
          className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
          disabled={isLoading}
        >
          <optgroup label="GBP Specific Formats">
            <option value="gbp_offer">Add Offer (Title, Dates, Code)</option>
            <option value="gbp_event">Add Event (Title, Dates)</option>
            <option value="gbp_update">Add Update (What's New)</option>
            <option value="seo_schema">SEO Data & JSON-LD Schema</option>
          </optgroup>
          <optgroup label="Single Focus Posts">
            <option value="screen_repair">Cracked Screen Emergency</option>
            <option value="battery_issue">Battery Draining Fast</option>
            <option value="water_damage">Water Damage Rescue</option>
            <option value="laptop_slow">Slow Laptop / Virus Issue</option>
            <option value="iphone_special">iPhone Special Service</option>
          </optgroup>
          <optgroup label="Engagement & Sales">
            <option value="review_highlight">Customer Review Highlight</option>
            <option value="limited_offer">Limited Time Offer (General)</option>
            <option value="brand_awareness">Brand Awareness / Trust</option>
          </optgroup>
          <optgroup label="Bulk Generation">
            <option value="weekly_plan">Full Weekly Content Plan (7 Posts)</option>
          </optgroup>
        </select>
      </div>

      {/* Date and Location Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
            Location
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value as MicroLocation)}
            className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
            disabled={isLoading}
          >
            {LOCATIONS.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Month/Season */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 flex items-center">
          <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
          Current Context (Month/Event)
        </label>
        <input
          type="text"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          placeholder="e.g. October (Diwali Sale)"
          className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          disabled={isLoading}
        />
      </div>

      {/* Offer Details */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 flex items-center">
          <Tag className="w-4 h-4 mr-1.5 text-gray-400" />
          Active Offer / Event Details
        </label>
        <input
          type="text"
          value={offerDetails}
          onChange={(e) => setOfferDetails(e.target.value)}
          placeholder="e.g. 10% Off or Workshop Details"
          className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-3">
        <button
          type="submit"
          disabled={isLoading}
          className={`
            w-full h-12 flex items-center justify-center rounded-lg text-white font-medium shadow-md transition-all
            ${isLoading 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:transform active:scale-[0.98]'
            }
          `}
        >
          {isLoading ? (
            <>Generating...</>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Generate Content
            </>
          )}
        </button>
        <div className="flex items-center justify-center space-x-1.5 py-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Only Genuine Parts Used for All Repairs</span>
        </div>
      </div>
    </form>
  );
};
