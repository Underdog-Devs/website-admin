import React from 'react';
import { GetServerSideProps } from 'next';
import styles from './dashboard.module.scss';
import Nav from '../components/dashboard/nav';
import Posts from '../components/blog/posts';
import { prisma } from '../lib/prisma';

type Props = {
	posts: any;
}

function Dashboard(props: Props) {
	const { posts } = props;
	// const posts = [{ title: 'Blog Title',
	// 	text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin auctor enim nec purus fermentum sodales. Donec sed varius arcu, volutpat pretium metus.',
	// 	author: 'username',
	// 	date: '07/12/2022' },
	// { title: 'Blog Title2',
	// 	text: 'Lorem2 ipsum dolor sit amet, consectetur adipiscing elit. Proin auctor enim nec purus fermentum sodales. Donec sed varius arcu, volutpat pretium metus.',
	// 	author: 'username2',
	// 	date: '07/13/2022' },
	// { title: 'Blog Title3',
	// 	text: 'Lorem3 ipsum dolor sit amet, consectetur adipiscing elit. Proin auctor enim nec purus fermentum sodales. Donec sed varius arcu, volutpat pretium metus.',
	// 	author: 'username3',
	// 	date: '07/14/2022' }];
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

export const getServerSideProps: GetServerSideProps = async () => {
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
};

export default Dashboard;
