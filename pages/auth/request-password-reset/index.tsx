import axios from 'axios';
import Link from 'next/link';
import React, { useState } from 'react';
import styles from '../../../components/auth/login/login.module.scss';

type Props = {};

function RequestPasswordReset(props: Props) {
	const {} = props;
	const [email, setEmail] = useState<string>('');

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setEmail(value);
	};

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		try {
			await axios.post('/api/auth/sendReset', {
				email,
			});
		} catch (err) {
			// TODO: instead of logging the error here we should create error handling to show the user there was a problem
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
						<label className={styles.formLabel} htmlFor="email">
							Email
						</label>
					</div>
					<div className={styles.formActions}>
						<Link href="/">
							<a className={`${styles.passwordResetLink} ${styles.formButton}`}>
								Back to login
							</a>
						</Link>
						<button type="submit" className={styles.formButton}>
							Submit
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default RequestPasswordReset;
