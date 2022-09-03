import React from 'react';
import styles from './posts.module.scss';
import Post, { BlogPost } from './post';

type Props = {
	posts: BlogPost[];
	title: string;
}

function Posts(props: Props) {
	const { posts, title } = props;
	return (
		<div className={styles.container}>
			<h2>{title}</h2>
			{posts?posts.map((post:BlogPost) => (
				<Post post={post} />
			)):<div>loading</div>}
		</div>
	);
}

export default Posts;
