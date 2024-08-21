import Link from 'next/link'

export default function Custom404() {
    return (
        <div className="flex h-screen flex-col items-center justify-center">
            <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
            <p className="mt-4">
                Sorry, the page you're looking for doesn't exist.
            </p>
            <Link href="/" className="mt-6 text-blue-500">
                Go back home
            </Link>
        </div>
    )
}
