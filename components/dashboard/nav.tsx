import Link from 'next/link';
import React from 'react';
import styles from './nav.module.scss';

function Nav() {
	return (
		<ul className={styles.list}>
			<li>
				<Link href="/blog/create"><a>Create Blog Post</a></Link>
			</li>
			<li>
				<Link href="/spotlight/create"><a>Update Spotlight</a></Link>
			</li>
			<li>
				<Link href="/testimonials/create"><a>Update Testimonials</a></Link>
			</li>
		</ul>
	);
}

export default Nav;
