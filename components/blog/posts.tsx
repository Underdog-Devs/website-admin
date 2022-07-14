import React from 'react';
import styles from './posts.module.scss';
import Post from './post';

type Props = {
	posts: any;
}

type singlePost = {
	id: string;
}

function Nav(props: Props) {
	const { posts } = props;
	return (
		<div className={styles.container}>
			<h2>Blog Posts</h2>
			{posts?posts.map((post:singlePost) => (
				<Post post={post} />
			)):<div>loading</div>}
		</div>
	);
}

export default Nav;
