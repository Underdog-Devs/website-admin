import React from 'react';
import { getSession } from 'next-auth/react';
import { Login } from '../components/auth/login';
import styles from './index.module.scss';
import Dashboard from '../components/dashboard';

function Home() {
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
