import React from 'react';
import { getSession, useSession } from 'next-auth/react';
import { Login } from '../components/auth/login';
import styles from './index.module.scss';

function Home() {
	const { data: session } = useSession();
	return (
		<div className={styles.login}>
			<Login />
		</div>
	);
}
export async function getServerSideProps(context: { req: any; }) {
	const session = await getSession({ req: context.req });
	// Redirect if user isn't logged in
	if (session) {
		return {
			redirect: {
				destination: '/dashboard',
				permanent: false,
			},
		};
	}

	return {
		props: { session },
	};
}

export default Home;
