import React from 'react';
import { useSession } from 'next-auth/react';
import { Login } from '../components/auth/login';
import styles from './index.module.scss';
import Dashboard from '../components/dashboard';

function Home() {
	const { data: session } = useSession();
	return (
		(session
			? <Dashboard />
			:			(
				<div className={styles.login}>
					<Login />
				</div>
			))

	);
}

export default Home;
