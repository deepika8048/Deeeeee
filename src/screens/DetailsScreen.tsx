import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, Calendar, Clock, ArrowUpRight, ArrowDownRight, Info, RefreshCw, Loader2 } from 'lucide-react';
import { MetalData, MetalId } from '../types';
import { fetchMetalPrice } from '../services/metalService';

export const DetailsScreen: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [data, setData] = useState<MetalData | null>(state?.metalData || null);
  const [loading, setLoading] = useState(false);

  const loadLatestData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const result = await fetchMetalPrice(id as MetalId);
      setData(result);
    } catch (err) {
      console.error('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!data && id) {
      loadLatestData();
    }
  }, [id]);

  if (!data) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <Info className="w-12 h-12 text-zinc-200 mb-4" />
        <h2 className="text-xl font-bold text-zinc-900 mb-2">No Data Found</h2>
        <p className="text-zinc-500 text-sm mb-6">We couldn't find the details for this metal.</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-zinc-900 text-white px-6 py-3 rounded-xl font-bold text-sm"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const isPositive = data.change >= 0;

  return (
    <div className="min-h-screen bg-white">
      <nav className="px-4 py-6 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-50 transition-colors"
        >
          <ChevronLeft size={24} className="text-zinc-900" />
        </button>
        <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900">{data.name} Details</h1>
        <button 
          onClick={loadLatestData}
          disabled={loading}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={18} className={`text-zinc-900 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </nav>

      <main className="max-w-md mx-auto px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-center mb-12">
            <span className="text-zinc-400 text-xs font-bold uppercase tracking-[0.2em] mb-2 block">Current Price</span>
            <div className="flex items-center justify-center gap-2 mb-2">
              <motion.h2 
                key={data.price}
                initial={{ opacity: 0.5, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-5xl font-bold text-zinc-900 tracking-tighter"
              >
                ₹{data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </motion.h2>
            </div>
            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {isPositive ? '+' : ''}{data.change.toFixed(2)} ({data.changePercent}%)
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-zinc-50 p-5 rounded-2xl border border-black/[0.02]">
              <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-2 block">Prev Open</span>
              <span className="text-lg font-bold text-zinc-900">₹{data.prevOpen.toLocaleString()}</span>
            </div>
            <div className="bg-zinc-50 p-5 rounded-2xl border border-black/[0.02]">
              <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-2 block">Prev Close</span>
              <span className="text-lg font-bold text-zinc-900">₹{data.prevClose.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border-b border-zinc-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500">
                  <Calendar size={16} />
                </div>
                <span className="text-sm font-medium text-zinc-600">Date</span>
              </div>
              <span className="text-sm font-bold text-zinc-900">{data.date}</span>
            </div>

            <div className="flex items-center justify-between p-4 border-b border-zinc-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500">
                  <Clock size={16} />
                </div>
                <span className="text-sm font-medium text-zinc-600">Time</span>
              </div>
              <span className="text-sm font-bold text-zinc-900">{data.timestamp}</span>
            </div>

            <div className="flex items-center justify-between p-4 border-b border-zinc-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500">
                  <Info size={16} />
                </div>
                <span className="text-sm font-medium text-zinc-600">Symbol</span>
              </div>
              <span className="text-sm font-bold text-zinc-900">{data.symbol}</span>
            </div>
          </div>

          <div className="mt-12 p-6 bg-zinc-900 rounded-3xl text-white">
            <h3 className="text-lg font-bold mb-2">Market Insight</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {data.name} is currently trading at ₹{data.price.toLocaleString()}. 
              The market shows a {isPositive ? 'bullish' : 'bearish'} trend with a 
              {data.changePercent}% change since the last session.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};
