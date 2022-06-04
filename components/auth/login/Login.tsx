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

	const handleSubmit = (e: React.SyntheticEvent) => {
		e.preventDefault();
		console.log(formData);
		setFormData(initialFormData);
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
						<button type="submit" className={styles.formButton}>Login</button>
						<Link href="/auth/request-password-reset"><a className={styles.passwordResetLink}>Forgot Password?</a></Link>
					</div>
				</form>
			</div>
		</div>
	);
}
