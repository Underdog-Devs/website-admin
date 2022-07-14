import React from 'react';
import styles from './posts.module.scss';
import Post from './post';

type Props = {
	posts: any;
	title: string;
}

type singlePost = {
	id: string;
}

function Posts(props: Props) {
	const { posts, title } = props;
	return (
		<div className={styles.container}>
			<h2>{title}</h2>
			{posts?posts.map((post:singlePost) => (
				<Post post={post} />
			)):<div>loading</div>}
		</div>
	);
}

export default Posts;
