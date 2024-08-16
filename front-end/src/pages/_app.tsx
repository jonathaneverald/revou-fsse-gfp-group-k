import "@/styles/globals.css";
import "@/styles/embla.css";
import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
import { Toaster } from "@/components/ui/sonner";
import { Provider } from "react-redux";
import { store } from "@/store/store";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<Provider store={store}>
			<Layout>
				<Component {...pageProps} />
				<Toaster />
			</Layout>
		</Provider>
	);
}
