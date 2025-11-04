// components/StatsCards.js
import { Users, Clock, Download, MessageCircle } from 'lucide-react';

const StatsCards = () => {
  return (
    <div className="flex space-x-4 p-4">
      <div className="bg-white shadow-lg rounded-xl flex items-center p-6 w-1/4 border border-indigo-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
        <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
          <Users className="text-indigo-600" size={28} />
        </div>
        <div className="ml-4">
          <div className="text-slate-800 text-2xl font-bold">2500</div>
          <div className="text-slate-500 text-sm">Welcome</div>
        </div>
      </div>
      <div className="bg-white shadow-lg rounded-xl flex items-center p-6 w-1/4 border border-blue-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
        <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg">
          <Clock className="text-blue-600" size={28} />
        </div>
        <div className="ml-4">
          <div className="text-slate-800 text-2xl font-bold">123.50</div>
          <div className="text-slate-500 text-sm">Average Time</div>
        </div>
      </div>
      <div className="bg-white shadow-lg rounded-xl flex items-center p-6 w-1/4 border border-teal-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
        <div className="p-3 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-lg">
          <Download className="text-teal-600" size={28} />
        </div>
        <div className="ml-4">
          <div className="text-slate-800 text-2xl font-bold">1,805</div>
          <div className="text-slate-500 text-sm">Collections</div>
        </div>
      </div>
      <div className="bg-white shadow-lg rounded-xl flex items-center p-6 w-1/4 border border-purple-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
        <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
          <MessageCircle className="text-purple-600" size={28} />
        </div>
        <div className="ml-4">
          <div className="text-slate-800 text-2xl font-bold">54</div>
          <div className="text-slate-500 text-sm">Comments</div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;