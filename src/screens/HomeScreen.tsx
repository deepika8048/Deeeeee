import React from 'react';
import { MetalCard } from '../components/MetalCard';
import { motion } from 'motion/react';
import { Wallet } from 'lucide-react';

export const HomeScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8 md:px-8">
      <header className="max-w-md mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center">
            <Wallet className="text-white w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">Metal Prices</h1>
        </div>
        <p className="text-zinc-500 text-sm">Live market updates for precious metals</p>
      </header>

      <main className="max-w-md mx-auto grid grid-cols-1 gap-4">
        <MetalCard metalId="gold" />
        <MetalCard metalId="silver" />
        <MetalCard metalId="platinum" />
        <MetalCard metalId="palladium" />
      </main>

      <footer className="max-w-md mx-auto mt-12 text-center">
        <p className="text-zinc-400 text-[10px] uppercase tracking-[0.2em] font-bold">
          Data updated every minute • Powered by MetalAPI
        </p>
      </footer>
    </div>
  );
};
