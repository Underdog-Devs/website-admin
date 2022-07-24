import axios from 'axios';
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
	return (
		<div className={styles.container}>
			<Link href={`/blog/${post.id}`}><h3>{post.title}</h3></Link>
			{post.entry.content[0].content.map((singleContent: { text: any; }, idx: number) => {
				return (
					<React.Fragment key={idx}>{singleContent.text}</React.Fragment>
				);
			})}
			<div className={styles.nav}>
				<ul>
					{deleteMessage ? (
						<><li onClick={deletePost}><a>Yes</a></li>
							<li onClick={toggleDeleteMessage}><a>No</a></li>
						</>
					)
						: (
							<li onClick={toggleDeleteMessage}>
								<a>Delete</a>
							</li>
						)}
					<li>
						<Link href={`/blog/edit/${post.id}`}><a>Edit</a></Link>
					</li>
					<li>
						<a href={`https://www.underdogdevs.org/blog/${post.id}`}>
							View Live
						</a>
					</li>
				</ul>
				<p>Date: {post.date}</p>
			</div>
		</div>
	);
}

export default Post;
