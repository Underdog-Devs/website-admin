import Link from 'next/link';
import React from 'react';
import { FaPen, FaUser, FaCalendarAlt } from 'react-icons/fa';
import styles from './post.module.scss';

function Post({ post }) {
	console.log(post);
	const date = new Date(post.date);
	return (
		<div className={styles.container}>
			<Link href={`/blog/${post.id}`}>
				<h3>{post.title}</h3>
			</Link>
			<p>{post.text}</p>
			<div className={styles.nav}>
				<ul>
					<li>
						<Link href={`/blog/edit/${post.id}`}><a><FaPen />Edit</a></Link>
					</li>
				</ul>
				<p><Link href={`/blog/author/${post.authorId}`}><a><FaUser />{post.author.email}</a></Link></p>
				<p><FaCalendarAlt />{date.toLocaleDateString()}</p>
			</div>
		</div>
	);
}

export default Post;
