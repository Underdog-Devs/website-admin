import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import styles from './post.module.scss';

function Post(props: any) {
	const { post } = props;
	const [deleteMessage, setDeleteMessage] = useState(false);

	const deletePost = async () => {
		try {
			const res = await axios.post('/api/blog/delete', {
				id: post.id,
			});
			console.log(res);
		} catch (error) {
			console.error(error);
		}
	};

	const toggleDeleteMessage = () => {
		setDeleteMessage(!deleteMessage);
	};

	const dateObj = new Date(post.date);
	const month = dateObj.getUTCMonth() + 1;
	const day = dateObj.getUTCDate();
	const year = dateObj.getUTCFullYear();
	const newdate = `${month}/${day}/${year}`;

	return (
		<div className={styles.container}>
			{post.image
				?(
					<img
						className={styles.img}
						src={post.image}
						alt="Featured"
						loading="lazy"
					/>
				)
				:<Image src="/images/fallback.png" width="313" height="243" />}
			<div>
				<Link href={`/blog/${post.id}`}>
					<h3>{post.title}</h3>
				</Link>
				{post.firstParagraph}
				<div className={styles.nav}>
					<ul>
						{deleteMessage ? (
							<>
								<li onClick={deletePost}>
									<a>Yes</a>
								</li>
								<li onClick={toggleDeleteMessage}>
									<a>No</a>
								</li>
							</>
						) : (
							<li onClick={toggleDeleteMessage}>
								<a>Delete</a>
							</li>
						)}
						<li>
							<Link href={`/blog/edit/${post.id}`}>
								<a>Edit</a>
							</Link>
						</li>
						<li>
							<a href={`https://www.underdogdevs.org/blog/${post.id}`}>
								View Live
							</a>
						</li>
					</ul>
					<p>Date: {newdate}</p>
				</div>
			</div>
		</div>
	);
}

export default Post;
