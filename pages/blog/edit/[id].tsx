import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';
import Nav from '../../../components/dashboard/nav';
import { Input } from '../../../components/input';
import styles from './edit.module.scss';

type FormData = {
	title: string;
	entry: string;
}

function EditPost(props: any) {
	const { post } = props;

	const [postEdit, setPostEdit] = useState<FormData>({
		title: '',
		entry: '',
	});

	useEffect(() => {
		setPostEdit({
			title: post.title,
			entry: post.entry.test,
		});
	}, []);

	const handleChanges = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setPostEdit({ ...postEdit, [name]: value });
	};

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		try {
			const res = await axios.post('/api/blog/edit', {
				title: postEdit.title,
				entry: postEdit.entry,
			});
			if (res) {
				setPostEdit({
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
							value={postEdit.title}
							onChange={handleChanges}
						/>
					</Input>

					<Input labelFor="entry" labelText="Entry">
						<textarea
							className={styles.entry}
							name="entry"
							rows={6}
							id="entry"
							value={postEdit.entry}
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
	const { params } = context;
	const prisma = new PrismaClient();
	// Redirect if user isn't logged in
	if (!session) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}
	const post = await prisma.blog.findUnique({
		where: {
			id: params.id,
		},
	});

	return {
		props: {
			post: {
				...post,
				date: post?.date.toISOString(),
			},
		},
	};
}

export default EditPost;
