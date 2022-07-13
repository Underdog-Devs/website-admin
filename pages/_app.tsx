import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';

// styles
import '../styles/index.scss';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	return (
		<SessionProvider session={session}>
			<Component {...pageProps} />
		</SessionProvider>
	);
}

export default MyApp;
