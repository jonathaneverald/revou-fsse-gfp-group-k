import '@/styles/globals.css'
import '@/styles/embla.css'
import type { AppProps } from 'next/app'
import Layout from '@/components/Layout'
import { Toaster } from '@/components/ui/sonner'
import { Provider } from 'react-redux'
import { store } from '@/store/store'
import { useRouter } from 'next/router'

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter()
    const excludeLayout =
        router.pathname === '/login' || router.pathname === '/register'
    return (
        <Provider store={store}>
            {!excludeLayout ? (
                <Layout>
                    <Component {...pageProps} />
                    <Toaster />
                </Layout>
            ) : (
                <>
                    <Component {...pageProps} />
                    <Toaster />
                </>
            )}
        </Provider>
    )
}
