import type { ReactNode } from 'react';

interface LayoutProps {
    sidebar: ReactNode;
    children: ReactNode;
}

export function Layout({ sidebar, children }: LayoutProps) {
    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            {sidebar}
            <main className="flex-1 ml-64 p-8">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
