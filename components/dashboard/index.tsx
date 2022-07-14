import React from 'react';
import styles from './dashboard.module.scss';
import Nav from './nav';
import Posts from '../blog/posts';

function Dashboard() {
	const posts = [{ title: 'Blog Title',
		text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin auctor enim nec purus fermentum sodales. Donec sed varius arcu, volutpat pretium metus.',
		author: 'username',
		date: '07/12/2022' },
	{ title: 'Blog Title2',
		text: 'Lorem2 ipsum dolor sit amet, consectetur adipiscing elit. Proin auctor enim nec purus fermentum sodales. Donec sed varius arcu, volutpat pretium metus.',
		author: 'username2',
		date: '07/13/2022' },
	{ title: 'Blog Title3',
		text: 'Lorem3 ipsum dolor sit amet, consectetur adipiscing elit. Proin auctor enim nec purus fermentum sodales. Donec sed varius arcu, volutpat pretium metus.',
		author: 'username3',
		date: '07/14/2022' }];
	return (
		<div className={styles.container}>
			<div className={styles.main}>
				<Posts posts={posts} />
				<Posts posts={posts} />
			</div>
			<div>
				<Nav />
			</div>
		</div>
	);
}

export default Dashboard;
