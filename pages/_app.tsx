import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import type { AppProps } from 'next/app';
import NavBar from '../components/navbar';
import { Provider } from '../state/RootContext';

// styles
import '../styles/index.scss';

function MyApp({
	Component,
	pageProps,
}: AppProps<{
	session: Session;
}>) {
	return (
		<SessionProvider session={pageProps.session}>
			<Provider>
				<NavBar />
				<Component {...pageProps} />
			</Provider>
		</SessionProvider>
	);
}

export default MyApp;
