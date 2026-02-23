import { AccountView } from '@neondatabase/auth/react';
import { accountViewPaths } from '@neondatabase/auth/react/ui/server';

export const dynamicParams = false;

export function generateStaticParams() {
    return Object.values(accountViewPaths).map((path) => ({ path }));
}

export default async function AccountPage({ params }: { params: Promise<{ path: string }> }) {
    const { path } = await params;

    return (
        <main className="mx-auto min-h-screen w-full max-w-6xl p-4 md:p-6">
            <div className="window-shell rounded-xl p-5 sm:p-6">
                <AccountView path={path} />
            </div>
        </main>
    );
}
