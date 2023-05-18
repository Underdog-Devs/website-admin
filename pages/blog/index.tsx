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
	const { count, posts, authorId } = props;

	const {
		isLoading,
		loadMoreCallback,
		hasDynamicPosts,
		dynamicPosts,
		isLastPage,
	} = useInfiniteScroll(posts, authorId);
	return (
		<div className={styles.container}>
			<div>
				<Nav />
			</div>
			<div>
				<Posts
					posts={hasDynamicPosts ? dynamicPosts : posts}
					isLoading={isLoading}
					loadMoreCallback={loadMoreCallback}
					isLastPage={isLastPage}
					count={count}
				/>
			</div>
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
	const response = await prisma.$transaction([
		prisma.blog.count({
			where: {
				authorId: session.id,
			},
		}),
		prisma.blog.findMany({
			where: {
				authorId: session.id,
			},
			take: 6,
			orderBy: [
				{
					date: 'desc',
				},
			],
		}),
	]);

	return {
		props: {
			count: response[0],
			posts: response[1].map((post) => ({
				...post,
				date: post.date.toISOString(),
			})),
			authorId: session.id,
		},
	};
};

export default BlogPosts;
