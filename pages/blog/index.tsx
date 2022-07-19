import React from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../lib/prisma';
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
export const getServerSideProps: GetServerSideProps = async (context) => {
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
};

export default BlogPosts;
