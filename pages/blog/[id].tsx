import React from 'react';
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';
import styles from './index.module.scss';
import Nav from '../../components/dashboard/nav';

function BlogPost(props: any) {
	const { post } = props;
	console.log(post);
	return (
		<div className={styles.container}>
			<div>
				<h2>{post.title}</h2>
				<p>{post.author.email}</p>
				<p>{post.entry.test}</p>
			</div>
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
	const post = await prisma.blog.findUnique({
		where: {
			id: params.id,
		},
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
			post: {
				...post,
				date: post?.date.toISOString(),
			},
		},
	};
}
export default BlogPost;
