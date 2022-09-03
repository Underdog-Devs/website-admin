import { signIn } from 'next-auth/react';
import Link from 'next/link';
import React, { useState } from 'react';
import styles from './login.module.scss';

type Props = {}

type FormData = {
	email: string;
	password: string;
}

const initialFormData = {
	email: '',
	password: '',
};

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
		try {
			await signIn('credentials', {
				redirect: true,
				email: credentials.email,
				password: credentials.password,
				callbackUrl: '/dashboard',
			});
		} catch (err) {
			// TODO: instead of logging the error here we should create error handling to show the user that the email and password were not correct
			console.error(err);
		}
		setCredentials(initialFormData);
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
						<Link href="/auth/request-password-reset"><a className={`${styles.passwordResetLink} ${styles.formButton}`}>Forgot Password?</a></Link>
						<button type="submit" className={styles.formButton}>Submit</button>
					</div>
				</form>
			</div>
		</div>
	);
}
