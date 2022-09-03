import React from 'react';
import { getSession } from 'next-auth/react';
import styles from './dashboard.module.scss';
import Nav from '../components/dashboard/nav';
import Posts from '../components/blog/posts';
import prisma from '../lib/prisma';

type Props = {
	posts: any;
}

function Dashboard(props: Props) {
	const { posts } = props;
	return (
		<div className={styles.container}>
			<div className={styles.main}>
				<div>test</div>
				<Posts posts={posts} title="Latest Posts" />
			</div>
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
	// Fetch all posted jobs and include related items from Company table
	const posts = await prisma.blog.findMany({
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
