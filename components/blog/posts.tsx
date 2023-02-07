import React from 'react';
import styles from './posts.module.scss';
import Post from './post';
import { UseInfiniteScroll } from '../../lib/useInfiniteScroll';
import { Loader } from './Loader';

type Props = Pick<
UseInfiniteScroll,
'isLoading' | 'loadMoreCallback' | 'isLastPage'
> & {
posts: BlogPost[];
};

interface BlogPost{
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

type singlePost = {
	id: string;
}

function Posts({
	posts,
	isLoading,
	loadMoreCallback,
	isLastPage,
} : Props) {
	console.log(posts);
	return (
		<div className={styles.container}>
			{posts ? posts.map((post: singlePost, idx: number) => (
				<Post post={post} key={idx} />
			)) : <div>loading</div>}
			<Loader
				isLoading={isLoading}
				isLastPage={isLastPage}
				loadMoreCallback={loadMoreCallback}
			/>
		</div>
	);
}

export default Posts;
