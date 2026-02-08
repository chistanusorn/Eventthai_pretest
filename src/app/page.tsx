'use client';

import Link from 'next/link';
import { Sparkles, Music, Star, ArrowRight, Heart } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-6 min-h-[90vh] transition-colors duration-500 relative overflow-hidden">

      <div className="animate-fade-in-up w-full max-w-5xl mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white/50 mb-12 select-none shadow-sm backdrop-blur-sm">
          <Sparkles className="w-5 h-5 text-black fill-black dark:text-yellow-500 dark:fill-yellow-500" />
          <span className="font-bold tracking-wide">User Management System</span>
          <Sparkles className="w-5 h-5 text-black fill-black dark:text-yellow-500 dark:fill-yellow-500" />
        </div>

        <div className="mb-14 select-none flex flex-col items-center">
          <div className="relative">
            {/* Thai Text: อีเว้นท์ไทย */}
            <h1 className="text-7xl md:text-9xl font-black tracking-tight leading-none text-black dark:text-white flex items-center drop-shadow-sm dark:drop-shadow-none">
              อีเว้นท์
              <span className="relative flex items-center mx-[0.05em] h-[1em]">
                {/* The Stylized 'ไ' */}
                <span className="relative h-full w-[0.6em] flex items-center justify-center">
                  {/* Top Green Accent (Like 'A') - Behind Text */}
                  <span className="absolute top-[3%] -right-[0%] w-[50%] h-[10%] bg-[#00A651] rotate-[-5deg] z-0 shadow-sm"></span>

                  {/* Center Text with Gradient - On Top */}
                  <span className="absolute inset-0 bg-gradient-to-b from-[#0072BC] via-[#0072BC] to-[#ED1C24] bg-clip-text text-transparent select-none z-10 font-bold">
                    ไ
                  </span>

                  {/* Bottom Red Accent (Like 'A') - Behind Text */}
                  <span className="absolute bottom-[10%] -right-[5%] w-[50%] h-[15%] bg-[#ED1C24] z-0 shadow-sm"></span>
                </span>
              </span>
              ทย
            </h1>

            {/* English Text: EVENTTHAI */}
            <div className="absolute -bottom-4 md:-bottom-12 right-0 flex items-center justify-end w-full">
              <span className="text-xl md:text-4xl font-black tracking-[0.2em] text-black dark:text-white flex items-center drop-shadow-sm dark:drop-shadow-none">
                EVENTTH
                <span className="relative inline-flex items-center justify-center mx-[0.01em]">
                  <span className="relative">A</span>
                  {/* Stylized 'A' accents */}
                  <span className="absolute bottom-[10%] right-0 w-[40%] h-[15%] bg-[#ED1C24]"></span>
                  <span className="absolute top-[10%] left-[20%] w-[60%] h-[15%] bg-[#00A651] rotate-[15deg] opacity-90"></span>
                </span>
                I
              </span>
            </div>
          </div>
        </div>

        <p className="text-xl md:text-2xl text-black/70 dark:text-white/60 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
          Welcome to the <span className="text-black dark:text-white font-bold">Eventthai Management System</span>.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link
            href="/register"
            className="group relative px-10 py-5 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              Start<ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link
            href="/login"
            className="px-10 py-5 bg-white/60 dark:bg-white/10 backdrop-blur-md border border-slate-200 dark:border-white/20 text-slate-900 dark:text-white rounded-full font-bold text-xl hover:bg-slate-50 dark:hover:bg-white/20 transition-all hover:-translate-y-1 shadow-sm hover:shadow-md"
          >
            Member Login
          </Link>
        </div>
      </div>


      {/* Footer / Quote */}
      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 w-full max-w-4xl text-slate-400 relative z-10">


        <blockquote className="text-2xl md:text-3xl font-serif italic text-indigo-900/70 relative inline-block px-8">
          <span className="text-6xl text-blue-400/30 absolute -top-6 -left-2 font-sans select-none">"</span>
          Every line is a responsibility, every work is an honor
          <span className="text-6xl text-blue-400/30 absolute -bottom-12 -right-2 font-sans select-none">"</span>
        </blockquote>
      </div>

    </div>
  );
}
