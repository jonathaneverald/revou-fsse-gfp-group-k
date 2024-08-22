import { cn } from '@/lib/utils'
import React from 'react'
import Header from './layouts/Header'
import Footer from './layouts/Footer'
import Head from 'next/head'

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Head>
                <title>
                    Ecomus - Connecting Local Producers with Nearby Consumers
                </title>
                <meta
                    name="description"
                    content="Ecomus is a platform that bridges the gap between local producers and nearby consumers, fostering sustainable trade and eco-friendly practices."
                />
                <meta
                    name="keywords"
                    content="Ecomus, local trade, sustainable consumption, local producers, eco-friendly, carbon emissions, local economy"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <meta name="robots" content="index, follow" />
                <meta name="author" content="Ecomus Team" />
                <link
                    rel="icon"
                    href="https://themesflat.co/html/ecomus/images/logo/favicon.png"
                    type="image/png"
                />
                <meta
                    property="og:title"
                    content="Ecomus - Connecting Local Producers with Nearby Consumers"
                />
                <meta
                    property="og:description"
                    content="Join Ecomus to support local economies and reduce carbon emissions through sustainable, local trade."
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://ecomus.com" />
                <meta
                    property="og:image"
                    content="https://themesflat.co/html/ecomus/images/logo/logo.svg"
                />
                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:title"
                    content="Ecomus - Connecting Local Producers with Nearby Consumers"
                />
                <meta
                    name="twitter:description"
                    content="Join Ecomus to support local economies and reduce carbon emissions through sustainable, local trade."
                />
                <meta
                    name="twitter:image"
                    content="https://themesflat.co/html/ecomus/images/logo/logo.svg"
                />
            </Head>
            <div
                className={cn(
                    'min-h-screen bg-background bg-gray-100 font-sans antialiased'
                )}
            >
                <Header />

                <main>{children}</main>

                <Footer />
            </div>
        </>
    )
}

export default Layout
