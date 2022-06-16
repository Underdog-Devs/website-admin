import React, { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './password-reset.module.scss';

type Props = {
	token: string;
	email: string;
};

interface PasswordData {
	password: string;
	token: string;
	email: string;
}

interface Message {
	type: string;
	message: string;
}

function PasswordForm(props: Props) {
	const { token, email } = props;
	const [message, setMessage] = useState<Message | null>(null);
	const newPasswordRef = useRef<any>();
	const confirmPasswordRef = useRef<any>();
	const router = useRouter();

	const changePasswordHandler = async (passwordData: PasswordData) => {
		try {
			const response = await fetch('/api/auth/reset', {
				method: 'PATCH',
				body: JSON.stringify(passwordData),
				headers: {
					'Content-Type': 'application/json',
				},
			});
			await response
				.json()
				.then(() => response.status === 201 && router.replace('/'));
		} catch (err) {
			console.error(err);
		}
	};

	const submitHandler = (event: React.SyntheticEvent) => {
		event.preventDefault();

		const enteredNewPassword = newPasswordRef.current.value;
		const enteredCofirmPassword = confirmPasswordRef.current.value;

		if (enteredCofirmPassword === enteredNewPassword) {
			changePasswordHandler({
				password: enteredNewPassword,
				token,
				email,
			});
		} else {
			toggleMessage('red', 'Passwords do not match');
		}
	};

	const toggleMessage = (type: string, msg: string | null) => {
		setMessage({ type, msg });
		setTimeout(() => {
			setMessage(null);
		}, 10000);
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
				<h4 className={styles.title}>Enter a New Password</h4>

				<form className={styles.form} onSubmit={submitHandler}>
					{message?.message && (
						<span style={{ color: message.type }}>{message.message}</span>
					)}
					<div className={styles.formField}>
						<input className={styles.formInput} type="password" id="new-password" ref={newPasswordRef} />
						<label className={styles.formLabel} htmlFor="new-password">New Password</label>
					</div>
					<div className={styles.formField}>
						<input
							className={styles.formInput}
							type="password"
							id="confirm-password"
							ref={confirmPasswordRef}
						/>
						<label className={styles.formLabel} htmlFor="confirm-password">Confirm Password</label>
					</div>

					<div className={styles.formActions}>
						<button className={styles.formButton}>Submit New Password</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default PasswordForm;
