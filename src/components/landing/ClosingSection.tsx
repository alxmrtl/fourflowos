'use client';

import Link from 'next/link';
import ParticleBackground from './ParticleBackground';
import { STEEL, SAGE, GRADIENTS } from '@/styles/brand-colors';

interface DoorProps {
  href: string;
  label: string;
  sub: string;
  color: string;
}

function Door({ href, label, sub, color }: DoorProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-6 no-underline transition-transform duration-500 hover:-translate-y-1.5"
      style={{ color }}
    >
      <div className="relative w-44 h-44 md:w-52 md:h-52 rounded-full flex items-center justify-center border border-white/10 group-hover:border-white/30 transition-colors duration-500">
        <div
          className="absolute -inset-8 rounded-full blur-3xl opacity-20 group-hover:opacity-50 transition-opacity duration-500"
          style={{ background: `radial-gradient(circle, ${color}, transparent 60%)` }}
        />
        <div
          className="relative w-20 h-20 md:w-24 md:h-24 rounded-full opacity-85 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${color}, rgba(0,0,0,0.5) 80%)`,
            boxShadow: `0 0 30px ${color}`,
          }}
        />
      </div>
      <div className="font-display italic text-xl md:text-2xl text-white">{label}</div>
      <div className="text-[11px] tracking-[0.18em] uppercase text-white/45 group-hover:text-white inline-flex items-center gap-2 transition-colors duration-300">
        {sub}
        <span className="inline-block group-hover:translate-x-1 transition-transform duration-300">→</span>
      </div>
    </Link>
  );
}

export default function ClosingSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505] py-16 md:py-20">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="absolute inset-0 opacity-[0.35] pointer-events-none">
        <ParticleBackground />
      </div>

      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        <h2 className="font-display text-3xl md:text-5xl font-normal text-white leading-[1.15] mb-16 md:mb-20">
          Find it{' '}
          <span
            className="italic bg-clip-text text-transparent"
            style={{ backgroundImage: GRADIENTS.textWide }}
          >
            where you are
          </span>
          .
        </h2>

        <div className="flex flex-wrap justify-center items-start gap-12 md:gap-24">
          <Door href="/apps" label="Start your practice" sub="on your own" color={STEEL} />
          <Door href="/together" label="Work together" sub="with a guide" color={SAGE} />
        </div>

        <p className="font-display italic text-white/35 text-sm md:text-base mt-20 md:mt-24 max-w-md mx-auto leading-relaxed">
          Two doors. Either one is right, if it&apos;s the one you&apos;ll walk through.
        </p>
      </div>
    </section>
  );
}
