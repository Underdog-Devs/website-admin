import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import NavBar from '../components/navbar';

// styles
import '../styles/index.scss';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	return (
		<SessionProvider session={session}>
			<NavBar />
			<Component {...pageProps} />
		</SessionProvider>
	);
}

export default MyApp;
