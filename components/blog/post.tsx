import Link from 'next/link';
import React from 'react';
import styles from './post.module.scss';

export interface BlogPost {
	id: string,
	title: string,
	text: string,
	date: string,
}

type Props = {
	post: BlogPost
}

function Post(props: Props) {
	const { post } = props;
	return (
		<div className={styles.container}>
			<h3>{post.title}</h3>
			<p>{post.text}</p>
			<div className={styles.nav}>
				<ul>
					<li>
						<Link href={`/blog/edit/${post.id}`}><a>Edit</a></Link>
					</li>
					<li>
						<a href={`https://www.underdogdevs.org/blog/${post.id}`}>
							Read More
						</a>
					</li>
				</ul>
				<p>Date: {post.date}</p>
			</div>
		</div>
	);
}

export default Post;
