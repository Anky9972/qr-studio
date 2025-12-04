import React, { useState } from 'react';
import { Coffee, X } from 'lucide-react';

const BuyMeCoffeeWidget = ({ variant = 'floating' }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    const coffeeUrl = 'https://buymeacoffee.com/vivekgour';

    if (!isVisible && variant === 'floating') return null;

    // Floating button variant (for Dashboard)
    if (variant === 'floating') {
        return (
            <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
                <div className="relative group">
                    {/* Animated glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 rounded-full blur-lg opacity-70 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>

                    {/* Main button */}
                    <a
                        href={coffeeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className="relative flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 text-white font-semibold rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 overflow-hidden"
                    >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                        {/* Coffee icon with steam animation */}
                        <div className="relative">
                            <Coffee className="w-5 h-5 animate-bounce" />
                            {isHovered && (
                                <>
                                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-white/60 rounded-full animate-steam" style={{ animationDelay: '0ms' }}></div>
                                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-white/40 rounded-full animate-steam" style={{ animationDelay: '200ms' }}></div>
                                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-white/20 rounded-full animate-steam" style={{ animationDelay: '400ms' }}></div>
                                </>
                            )}
                        </div>

                        <span className="relative text-sm whitespace-nowrap">Buy Me a Coffee</span>
                    </a>

                    {/* Close button */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setIsVisible(false);
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-slate-800 hover:bg-slate-700 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        title="Dismiss"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>

                {/* Tooltip */}
                <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                    Support the development! ☕
                    <div className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-slate-800"></div>
                </div>
            </div>
        );
    }

    // Inline banner variant (for Popup)
    if (variant === 'banner') {
        return (
            <a
                href={coffeeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block w-full my-4 p-3 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-xl hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-300 overflow-hidden"
            >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-100/0 via-amber-100/50 to-amber-100/0 dark:from-amber-800/0 dark:via-amber-800/30 dark:to-amber-800/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                <div className="relative flex items-center justify-center gap-2">
                    <div className="relative">
                        <Coffee className="w-5 h-5 text-amber-600 dark:text-amber-400 group-hover:animate-bounce" />
                        {/* Steam particles */}
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                            <div className="w-0.5 h-2 bg-amber-600/60 dark:bg-amber-400/60 rounded-full animate-steam"></div>
                        </div>
                    </div>
                    <span className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                        Buy Me a Coffee
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 rounded-full font-medium">
                        Support
                    </span>
                </div>
            </a>
        );
    }

    // Card variant (alternative for Dashboard)
    if (variant === 'card') {
        return (
            <a
                href={coffeeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block glass-card rounded-2xl p-4 shadow-xl card-hover border-2 border-transparent hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-300 overflow-hidden"
            >
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-orange-500/10 to-amber-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Coffee className="w-6 h-6 text-white group-hover:animate-bounce" />
                    </div>

                    <div className="flex-1">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                            Support Development
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                            Buy me a coffee to keep this project alive! ☕
                        </p>
                    </div>

                    <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center group-hover:bg-amber-200 dark:group-hover:bg-amber-800/50 transition-colors duration-300">
                            <span className="text-lg">→</span>
                        </div>
                    </div>
                </div>
            </a>
        );
    }

    return null;
};

export default BuyMeCoffeeWidget;
