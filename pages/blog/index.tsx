import React from 'react';
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';
import styles from './index.module.scss';
import Posts from '../../components/blog/posts';
import Nav from '../../components/dashboard/nav';

function BlogPosts(props: any) {
	const { posts } = props;
	console.log(posts);
	return (
		<div className={styles.container}>
			<Posts posts={posts} title="Blog Posts" />
			<Nav />
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

	const prisma = new PrismaClient();
	// Fetch all posted jobs and include related items from Company table
	const posts = await prisma.blog.findMany({
		orderBy: [
			{
				date: 'desc',
			},
		],
		include: {
			author: {
				select: {
					email: true,
				},
			},
		},
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
export default BlogPosts;
