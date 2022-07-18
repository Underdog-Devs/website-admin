import Link from 'next/link';
import React from 'react';
import styles from './post.module.scss';

function Post(props: any) {
	const { post } = props;
	console.log(post.entry.content[0].content[0].text);
	return (
		<div className={styles.container}>
			<h3>{post.title}</h3>
			<div>{post.entry.content[0].content[0].text}</div>
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
