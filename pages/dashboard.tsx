import React from 'react';
import { getSession } from 'next-auth/react';
import styles from './dashboard.module.scss';
import Nav from '../components/dashboard/nav';
import prisma from '../lib/prisma';
import PreviewPosts from '../components/blog/previewPosts';

type Props = {
	posts: any;
}

function Dashboard(props: Props) {
	const { posts } = props;
	return (
		<div className={styles.container}>
			<div>
				<Nav />
			</div>
			<PreviewPosts
				posts={posts}
			/>
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
	// Fetch all posted jobs and include related items from Company table
	const posts = await prisma.blog.findMany({
		where: {
			authorId: session.id,
		},
		take: 3,
		orderBy: [
			{
				date: 'desc',
			},
		],
	});
	return {
		props: {
			posts: posts.map((post) => ({
				...post,
				date: post.date.toISOString(),
			})),
		},
	};
}

export default Dashboard;
