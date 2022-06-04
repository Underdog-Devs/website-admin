import React from 'react';
import { Login } from '../components/auth/login';
import styles from './index.module.scss';

function Home() {
	return (
		<div className={styles.appContainer}>
			<Login />
		</div>
	);
}

export default Home;
