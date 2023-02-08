import React from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../lib/prisma';
import styles from './index.module.scss';
import Posts from '../../components/blog/posts';
import Nav from '../../components/dashboard/nav';
import { useInfiniteScroll } from '../../lib/useInfiniteScroll';

export interface UseInfiniteScroll {
	isLoading: boolean;
	//! MUST FIX THIS
	// eslint-disable-next-line no-unused-vars
	loadMoreCallback: (el: HTMLDivElement) => void;
	hasDynamicPosts: boolean;
	dynamicPosts: BlogPost[];
	isLastPage: boolean;
}

interface BlogPost {
	id: string;
	image: string;
	title: string;
	name: string;
	text: string;
	firstParagraph:string;
	author: string;
	date: string;
	entry: any;
}

function BlogPosts(props: any) {
	const { posts } = props;
	const {
		isLoading,
		loadMoreCallback,
		hasDynamicPosts,
		dynamicPosts,
		isLastPage,
	} = useInfiniteScroll(posts);
	return (
		<div className={styles.container}>
			<div>
				<Posts
					posts={hasDynamicPosts ? dynamicPosts : posts}
					isLoading={isLoading}
					loadMoreCallback={loadMoreCallback}
					isLastPage={isLastPage}
				/>
			</div>
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

	// Fetch all posted blogs and include related items author table
	const posts = await prisma.blog.findMany({
		take: 6,
		orderBy: [
			{
				date: 'desc',
			},
		],
		// include: {
		// 	author: {
		// 		select: {
		// 			email: true,
		// 		},
		// 	},
		// },
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
