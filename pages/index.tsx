import React from 'react';
import { useSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';
import { Login } from '../components/auth/login';
import styles from './index.module.scss';
import Dashboard from '../components/dashboard';

type Props = {
	posts: any;
}

function Home(props: Props) {
	const { posts } = props;
	const { data: session } = useSession();
	return (
		(session
			? <Dashboard posts={posts} />
			:			(
				<div className={styles.login}>
					<Login />
				</div>
			))

	);
}

export async function getServerSideProps() {
	const prisma = new PrismaClient();
	// Fetch all posted jobs and include related items from Company table
	const posts = await prisma.blog.findMany({
		take: 3,
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

export default Home;
