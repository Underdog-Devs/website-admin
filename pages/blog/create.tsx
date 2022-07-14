import Link from 'next/link';
import React from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { getSession } from 'next-auth/react';
import Nav from '../../components/dashboard/nav';
import { Input } from '../../components/input';
import styles from './create.module.scss';

function CreatePost() {
	return (
		<div className={styles.container}>
			<section className={styles.leftCol}>
				<p className={styles.instruction}>Instructions to upload mentee spotlight information.</p>
			</section>
			<section className={styles.rightCol}>
				<div className={styles.back}>
					<Link href="/" passHref>
						<button className={styles.backButton}>
							<FaChevronLeft /> Back{' '}
						</button>
					</Link>
				</div>
				<div className={styles.topInput}>
					<Input labelFor="title" labelText="Title">
						<input id="title" type="text" />
					</Input>

					<Input labelFor="titleText" labelText="Text">
						<textarea
							className={styles.titleText}
							name="titleText"
							rows={6}
							id="titleText"
						/>
					</Input>
				</div>
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
