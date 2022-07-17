import Link from 'next/link';
import React, { useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { getSession, useSession } from 'next-auth/react';
import axios from 'axios';
import Nav from '../../components/dashboard/nav';
import { Input } from '../../components/input';
import styles from './create.module.scss';

type FormData = {
	title: string;
	entry: string;
}

function CreatePost() {
	const [post, setPost] = useState<FormData>({
		title: '',
		entry: '',
	});

	const { data: session } = useSession();
	const handleChanges = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setPost({ ...post, [name]: value });
	};

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		try {
			const res = await axios.post('/api/blog/create', {
				title: post.title,
				entry: post.entry,
				authorId: session?.id,
			});
			if (res) {
				setPost({
					title: '',
					entry: '',
				});
			}
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className={styles.container}>
			<section className={styles.leftCol}>
				<p className={styles.instruction}>Instructions to upload mentee spotlight information.</p>
			</section>
			<section className={styles.rightCol}>
				<div className={styles.back}>
					<Link href="/dashboard" passHref>
						<button className={styles.backButton}>
							<FaChevronLeft /> Back{' '}
						</button>
					</Link>
				</div>
				<form className={styles.topInput} onSubmit={handleSubmit}>
					<Input labelFor="title" labelText="Title">
						<input
							id="title"
							name="title"
							type="text"
							value={post.title}
							onChange={handleChanges}
						/>
					</Input>

					<Input labelFor="entry" labelText="Entry">
						<textarea
							className={styles.entryText}
							name="entry"
							rows={6}
							id="entry"
							value={post.entry}
							onChange={handleChanges}
						/>
					</Input>
				</form>
				<div className={styles.sendButton}>
					<input className={styles.button} type="submit" value="Send" />
				</div>
			</section>
			<div>
				<Nav />
			</div>
		</div>
	);
}

export async function getServerSideProps(context: { req: any; }) {
	const session = await getSession({ req: context.req });
	// Redirect if user isn't logged in
	if (!session) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	return {
		props: { session },
	};
}

export default CreatePost;
