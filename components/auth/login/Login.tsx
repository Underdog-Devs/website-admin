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
	const [formData, setFormData] = useState<FormData>(initialFormData);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		setFormData(initialFormData);
		console.log('submitting');
		try {
			await signIn('credentials', {
				redirect: false,
				email: formData.email,
				password: formData.password,
				callbackUrl: '/',
			});
		} catch (err) {
			// TODO: instead of logging the error here we should create error handling to show the user that the email and password were not correct
			console.error(err);
		}
	};

	return (
		<div className={styles.container}>
			<img
				className={styles.logoImage}
				src="/images/underdogdevs-01.png"
				alt="Underdog Devs Logo"
				height={300}
				width={300}
				loading="lazy"
			/>
			<div className={styles.formContainer}>
				<h4 className={styles.title}>Login</h4>
				<form className={styles.form} onSubmit={handleSubmit}>
					<div className={styles.formField}>
						<input
							className={styles.formInput}
							type="email"
							name="email"
							id="email"
							value={formData.email}
							onChange={handleChange}
						/>
						<label className={styles.formLabel} htmlFor="email">Email</label>
					</div>
					<div className={styles.formField}>
						<input
							className={styles.formInput}
							type="password"
							name="password"
							id="password"
							value={formData.password}
							onChange={handleChange}
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
