import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Clock, AlertCircle, Loader2, ChevronRight } from 'lucide-react';
import { MetalData, MetalId } from '../types';
import { fetchMetalPrice } from '../services/metalService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MetalCardProps {
  metalId: MetalId;
}

export const MetalCard: React.FC<MetalCardProps> = ({ metalId }) => {
  const [data, setData] = useState<MetalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchMetalPrice(metalId);
      setData(result);
    } catch (err) {
      setError('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [metalId]);

  if (loading && !data) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/5 flex flex-col items-center justify-center min-h-[160px] animate-pulse">
        <Loader2 className="w-6 h-6 text-zinc-400 animate-spin mb-2" />
        <span className="text-zinc-400 text-sm font-medium">Loading {metalId}...</span>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-100 flex flex-col items-center justify-center min-h-[160px]">
        <AlertCircle className="w-6 h-6 text-red-500 mb-2" />
        <span className="text-red-500 text-sm font-medium mb-3">{error}</span>
        <button 
          onClick={loadData}
          className="text-xs font-semibold uppercase tracking-wider text-zinc-600 hover:text-black transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  const isPositive = data.change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/details/${data.id}`, { state: { metalData: data } })}
      className="bg-white rounded-2xl p-6 shadow-sm border border-black/5 cursor-pointer group transition-all hover:shadow-md relative overflow-hidden"
    >
      {loading && (
        <div className="absolute top-0 left-0 w-full h-1 bg-zinc-100 overflow-hidden">
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-1/2 h-full bg-zinc-900"
          />
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">{data.symbol}</h3>
          <h2 className="text-xl font-bold text-zinc-900">{data.name}</h2>
        </div>
        <div className={cn(
          "px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold",
          isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
        )}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {isPositive ? '+' : ''}{data.changePercent}%
        </div>
      </div>

      <div className="flex items-baseline gap-1 mb-4">
        <motion.span 
          key={data.price}
          initial={{ opacity: 0.5, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-2xl font-bold text-zinc-900"
        >
          ₹{data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </motion.span>
        <span className="text-zinc-400 text-xs font-medium">/ gram</span>
      </div>

      <div className="flex items-center justify-between border-t border-zinc-50 pt-4">
        <div className="flex items-center gap-1.5 text-zinc-400">
          <Clock size={12} />
          <span className="text-[10px] font-bold uppercase tracking-wider">{data.timestamp}</span>
        </div>
        <ChevronRight size={16} className="text-zinc-300 group-hover:text-zinc-900 transition-colors" />
      </div>
    </motion.div>
  );
};
