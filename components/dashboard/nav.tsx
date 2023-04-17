import Link from 'next/link';
import React from 'react';
import { FaEye, FaPen } from 'react-icons/fa';
import styles from './nav.module.scss';

function Nav() {
	return (
		<ul className={styles.list}>
			<div>
				<h4>Blog</h4>
				<li>
					<Link href="/blog/create"><a><FaPen />Create</a></Link>
				</li>
				<li>
					<Link href="/blog/"><a><FaEye />View All</a></Link>
				</li>
			</div>
			{/*<div>
				<h4>Spotlight</h4>
				<li>
					<Link href="/spotlight/create"><a><FaPen />Create</a></Link>
				</li>
				<li>
					<Link href="/spotlight/"><a><FaEye />View All</a></Link>
				</li>
			</div>
			<div>
				<h4>Testimonials</h4>
				<li>
					<Link href="/testimonials/create"><a><FaPen />Create</a></Link>
				</li>
				<li>
					<Link href="/testimonials/"><a><FaEye />View All</a></Link>
				</li>
			</div>*/}
		</ul>
	);
}

export default Nav;
