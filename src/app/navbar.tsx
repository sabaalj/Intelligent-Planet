'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { LiquidGlassCard } from '@/components/ui/liquid-glass';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { label: 'Home', href: '/' },
        { label: 'Conference', href: '/conference' },
        { label: 'Hackathon', href: '/hackathon' },
        { label: 'FAQ', href: '/faq' },
    ];

    return (
        <>
            {/* Desktop Navigation Bar */}
            <nav className="hidden md:flex z-50 w-screen justify-center items-center">
                <LiquidGlassCard shadowIntensity='xs' glowIntensity='none' draggable={false}>
                    <div className="relative w-fit flex justify-between items-center py-1 px-1">
                        {navItems.map((item) => (
                            <a
                            key={item.href}
                            href={item.href}
                            className="z-50 block px-4 py-2 text-lg hover:backdrop-blur-md hover:bg-white/20 hover:border-r rounded-3xl"
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>
                </LiquidGlassCard>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden w-100 flex justify-end z-50">
                <LiquidGlassCard shadowIntensity='xs' glowIntensity='none'>                    
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="relative z-50 p-2"
                        >
                        {isOpen ? <X size={30} /> : <Menu size={30} />}
                    </button>
                </LiquidGlassCard>
            </div>

            {/* Mobile Navigation Sidebar */}
            {isOpen && (
                <div className="md:hidden fixed inset-0 top-16 z-40">
                    <LiquidGlassCard shadowIntensity='xs' glowIntensity='none' className='w-screen h-full'>
                        <div className="h-full w-64 p-6 flex flex-col gap-6">
                            {navItems.map((item) => (
                                <a
                                key={item.href}
                                href={item.href}
                                className="block py-2 px-4 rounded hover:bg-white/20 transition text-3xl z-40"
                                onClick={() => setIsOpen(false)}
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </LiquidGlassCard>
                </div>
            )}
        </>
    );
}