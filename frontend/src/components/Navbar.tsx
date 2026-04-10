'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LayoutDashboard, LogIn, ArrowRight, Zap, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const links = [
    { label: 'Recursos',       href: '#features'     },
    { label: 'Como Funciona',  href: '#how-it-works' },
    { label: 'Preços',         href: '#pricing'      },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[var(--bg-surface)]/90 backdrop-blur-xl border-b border-[var(--border-subtle)] shadow-lg shadow-black/20'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
                <Zap size={15} className="text-white fill-white" />
              </div>
              <span className="font-black text-lg tracking-tight text-white">
                Agenda<span className="gradient-text-blue">Flow</span>
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-white rounded-lg hover:bg-white/5 transition-all"
                >
                  {l.label}
                </a>
              ))}
            </div>

            {/* CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="btn btn-ghost px-4 py-2 text-sm"
              >
                <LogIn size={14} />
                Entrar
              </Link>
              <Link
                href="/register"
                className="btn btn-primary px-5 py-2.5 text-sm rounded-xl"
              >
                Começar Grátis
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden btn btn-ghost p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 glass-strong md:hidden animate-scale-in">
          <div className="flex flex-col items-center justify-center h-full gap-6 p-8">
            <Link
              href="/"
              className="flex items-center gap-2"
              onClick={() => setMobileOpen(false)}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <LayoutDashboard size={20} className="text-white" />
              </div>
              <span className="text-2xl font-black gradient-text">Agenda Flow</span>
            </Link>

            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-xl font-bold text-[var(--text-secondary)] hover:text-white transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </a>
            ))}

            <div className="flex flex-col gap-3 w-full max-w-xs pt-4 border-t border-[var(--border-subtle)]">
              <Link href="/login" className="btn btn-ghost justify-center" onClick={() => setMobileOpen(false)}>
                Entrar
              </Link>
              <Link href="/register" className="btn btn-primary justify-center" onClick={() => setMobileOpen(false)}>
                Começar Grátis <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
