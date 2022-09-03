import axios from 'axios';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import React, { useState } from 'react';

function Auth() {
	const [credentials, setCredentials] = useState({
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
				redirect: false,
				email: credentials.email,
				password: credentials.password,
				callbackUrl: '/',
			});
		} catch (err) {
			// TODO: add error handling for the user
			console.error(err);
		}
	};

	const resetPassword = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		try {
			await axios.post('/api/auth/sendReset', {
				email: credentials.email,
			});
		} catch (err) {
			// TODO: add error handling for the user
			console.error(err);
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<input
					onChange={handleChanges}
					type="text"
					name="email"
					value={credentials.email}
					placeholder="Email"
				/>
				<input
					onChange={handleChanges}
					type="password"
					name="password"
					value={credentials.password}
					placeholder="Password"
				/>
				<button type="submit">Sign In</button>
				<button onClick={resetPassword}>Reset Password</button>
				<Link href="/">Home</Link>
			</form>
		</div>
	);
}

export default Auth;
