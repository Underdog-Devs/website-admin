import React, { useRef, useState } from 'react';

import { useRouter } from 'next/router';

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

	const toggleMessage = (type: string, msg: string) => {
		setMessage({ type, message: msg });
		setTimeout(() => {
			setMessage(null);
		}, 10000);
	};

	return (
		<form className="container" onSubmit={submitHandler}>
			<h3>Enter a new password</h3>
			{message?.message && (
				<span style={{ color: message.type }}>{message.message}</span>
			)}
			<div className="form-row">
				<div>
					<label htmlFor="new-password">New Password</label>
					<input type="password" id="new-password" ref={newPasswordRef} />
				</div>
				<div>
					<label htmlFor="confirm-password">Confirm Password</label>
					<input
						type="password"
						id="confirm-password"
						ref={confirmPasswordRef}
					/>
				</div>
			</div>
			<div>
				<button>Submit New Password</button>
			</div>
		</form>
	);
}

export default PasswordForm;
