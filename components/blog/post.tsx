import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Details from './details';
import styles from './post.module.scss';

function Post(props: any) {
	const { post } = props;

	return (
		<div className={styles.container}>
			<div>
				{post.image ? (
					<img
						className={styles.img}
						src={post.image}
						alt="Featured"
						loading="lazy"
					/>
				) : (
					<Image src="/images/fallback.png" width="64px" height="80px" />
				)}
			</div>
			<div>
				<Link href={`/blog/${post.title.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\s-]/g, '')}/${post.id}`}>
					<h3>{post.title}</h3>
				</Link>
				{post.firstParagraph}
				<Details id={post.id} date={post.date} />
			</div>
		</div>
	);
}

export default Post;
