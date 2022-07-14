import { signIn } from 'next-auth/react';
import Link from 'next/link';
import React, { useState } from 'react';
import styles from './login.module.scss';

type Props = {}

type FormData = {
	email: string;
	password: string;
}

// const initialFormData = {
// 	email: '',
// 	password: '',
// };

export function Login(props: Props) {
	const { } = props;
	const [credentials, setCredentials] = useState<FormData>({
		email: '',
		password: '',
	});

	const handleChanges = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setCredentials({ ...credentials, [name]: value });
	};

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		const res = await signIn('credentials', {
			redirect: true,
			email: credentials.email,
			password: credentials.password,
			callbackUrl: '/dashboard',
		});
		if (res) {
			setCredentials({
				email: '',
				password: '',
			});
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.formContainer}>
				<h4 className={styles.title}>Login</h4>
				<form className={styles.form} onSubmit={handleSubmit}>
					<div className={styles.formField}>
						<input
							className={styles.formInput}
							type="email"
							name="email"
							id="email"
							value={credentials.email}
							onChange={handleChanges}
						/>
						<label className={styles.formLabel} htmlFor="email">Email</label>
					</div>
					<div className={styles.formField}>
						<input
							className={styles.formInput}
							type="password"
							name="password"
							id="password"
							value={credentials.password}
							onChange={handleChanges}
						/>
						<label className={styles.formLabel} htmlFor="password">Password</label>
					</div>
					<div className={styles.formActions}>
						<button type="submit" className={styles.formButton}>Login</button>
						<Link href="/auth/request-password-reset"><a className={styles.passwordResetLink}>Forgot Password?</a></Link>
					</div>
				</form>
			</div>
		</div>
	);
}
