import React from 'react';
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';
import styles from './post.module.scss';
import Posts from '../../../components/blog/posts';
import Nav from '../../../components/dashboard/nav';

function BlogPost(props: any) {
	const { posts } = props;
	return (
		<div className={styles.container}>
			<Posts posts={posts} title="Blog Posts" />
			<Nav />
		</div>
	);
}

export async function getServerSideProps(context: { req: any; }) {
	const session = await getSession({ req: context.req });
	const { params } = context;
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
		where: {
			authorId: params.id,
		},
		include: {
			author: {
				select: {
					email: true,
				},
			},
		},
		orderBy: [
			{
				date: 'desc',
			},
		],
	});
	console.log(posts);
	return {
		props: {
			posts: posts.map((post) => ({
				...post,
				date: post.date.toISOString(),
			})),
		},
	};
}
export default BlogPost;
