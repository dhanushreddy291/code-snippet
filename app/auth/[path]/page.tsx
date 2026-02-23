import { AuthView } from '@neondatabase/auth/react';

export const dynamicParams = false;

export default async function AuthPage({ params }: { params: Promise<{ path: string }> }) {
    const { path } = await params;

    return (
        <main className="mx-auto flex min-h-screen w-full max-w-6xl grow items-center justify-center p-4 md:p-6">
            <div className="window-shell w-full max-w-md rounded-xl p-5 sm:p-6">
                <AuthView path={path} />
            </div>
        </main>
    );
}
