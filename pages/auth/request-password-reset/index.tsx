import axios from 'axios';
import Link from 'next/link';
import React, { useState } from 'react';
import styles from '../../../components/auth/login/login.module.scss';

type Props = {}

export default function RequestPasswordReset(props: Props) {
	const { } = props;
	const [email, setEmail] = useState<string>('');

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setEmail(value);
	};

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		try {
			const res = await axios.post('/api/auth/sendReset', {
				email,
			});
			console.log(res);
		} catch (err) {
			console.error(err);
		}
		setEmail('');
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
				<h4 className={styles.title}>Password Reset</h4>
				<form className={styles.form} onSubmit={handleSubmit}>
					<div className={styles.formField}>
						<input
							className={styles.formInput}
							type="email"
							name="email"
							id="email"
							value={email}
							onChange={handleChange}
						/>
						<label className={styles.formLabel} htmlFor="email">Email</label>
					</div>
					<div className={styles.formActions}>
						<button type="submit" className={styles.formButton}>Submit</button>
						<Link href="/"><a className={styles.passwordResetLink}>Login</a></Link>
					</div>
				</form>
			</div>
		</div>
	);
}
