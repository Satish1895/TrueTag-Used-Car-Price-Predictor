"use client";

import Image from 'next/image';
import CarForm from './CarForm';

export default function Home() {
  return (
    <main className="relative min-h-screen w-full text-white overflow-x-hidden font-sans">
      
      {/* OPTIMIZED STATIC BACKGROUND */}
      <div className="fixed inset-0 -z-10 bg-slate-950">
        <Image 
          src="/bg-car.jpg" 
          alt="T₹ueTag Background" 
          fill 
          priority
          quality={100} 
          className="object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-slate-950/10 pointer-events-none"></div>
      </div>

      {/* FIXED TOP HEADER WITH "VANISH" FADE EFFECT */}
      {/* The gradient goes from solid dark at the very top, fading to transparent at the bottom of the header */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none bg-gradient-to-b from-slate-950 via-slate-950/90 to-transparent pt-6 md:pt-8 pb-12 px-6 md:px-10 flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6">
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 shrink-0 pb-1 md:pb-2">
          T₹ueTag
        </h1>
        
        <div className="hidden md:block h-8 w-px bg-white/20 shrink-0"></div>
        
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-50 font-medium tracking-wide drop-shadow-md leading-snug md:leading-normal max-w-3xl">
          Algorithmic pricing and real-time AI insights specifically tuned for used daily commuter cars.
        </p>
      </div>

      {/* MAIN DASHBOARD CONTAINER */}
      {/* Sits at z-10, so it naturally passes beneath the z-50 header */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-40 md:pt-48 pb-20 pointer-events-none flex items-center min-h-screen">
        <CarForm />
      </div>

    </main>
  );
}