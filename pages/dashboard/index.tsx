import Link from 'next/link';
import React from 'react';
import { getSession } from 'next-auth/react';
import styles from './dashboard.module.scss';

function Dashboard() {
	return (
		<div className={styles.container}>
			<ul className={styles.list}>
				<li>
					<Link href="/create-blog-post"><a>Create Blog Post</a></Link>
				</li>
				<li>
					<Link href="/update-spotlight"><a>Update Spotlight</a></Link>
				</li>
				<li>
					<Link href="/update-testimonials"><a>Update Testimonials</a></Link>
				</li>
			</ul>
		</div>
	);
}

export default Dashboard;

export async function getServerSideProps(context: any) {
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
