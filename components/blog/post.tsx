import Link from 'next/link';
import React from 'react';
import styles from './post.module.scss';

function Nav({ post }) {
	console.log(post);
	return (
		<div className={styles.container}>
			<h3>{post.title}</h3>
			<p>{post.text}</p>
			<div className={styles.nav}>
				<ul>
					<li>
						<Link href="/blog/edit/ID"><a>Edit</a></Link>
					</li>
					<li>
						<a href="https://www.underdogdevs.org">
							Read More
						</a>
					</li>
				</ul>
				<p>Author: {post.author} | Date: {post.date}</p>
			</div>
		</div>
	);
}

export default Nav;
