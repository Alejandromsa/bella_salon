"use client";

import { useEffect } from 'react';

export default function DevToolsBlocker() {
    useEffect(() => {
        // 1. Disable Right Click
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        // 2. Disable Specific Keyboard Shortcuts
        const handleKeyDown = (e: KeyboardEvent) => {
            // F12
            if (e.key === 'F12') {
                e.preventDefault();
            }
            // Ctrl+Shift+I (Inspect)
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault();
            }
            // Ctrl+Shift+J (Console)
            if (e.ctrlKey && e.shiftKey && e.key === 'J') {
                e.preventDefault();
            }
            // Ctrl+U (View Source)
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
            }
            // Ctrl+Shift+C (Inspect Element)
            if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                e.preventDefault();
            }
        };

        // 3. Clear console and show warning
        const blockConsole = () => {
            if (typeof window !== 'undefined') {
                setInterval(() => {
                    // console.clear();
                }, 1000);

                console.log('%c¡ALTO!', 'color: red; font-size: 50px; font-weight: bold; -webkit-text-stroke: 1px black;');
                console.log('%cEsta zona es para desarrolladores. Si alguien te pidió copiar algo aquí, es un ataque de phishing.', 'font-size: 20px;');
            }
        };

        window.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('keydown', handleKeyDown);
        blockConsole();

        return () => {
            window.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return null; // This component doesn't render anything
}
