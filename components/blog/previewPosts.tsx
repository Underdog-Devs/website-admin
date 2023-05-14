import React from 'react';
import styles from './posts.module.scss';
import Post from './post';

type Props = {
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

function PreviewPosts({
	posts,
} : Props) {
	return (
		<div className={styles.container}>
			{posts ? posts.map((post: singlePost, idx: number) => (
				<Post post={post} key={idx} />
			)) : <div>loading</div>}
		</div>
	);
}

export default PreviewPosts;
