import { useSession, signOut } from 'next-auth/react';
import React from 'react';
import styles from './navBar.module.scss';

function NavBar() {
	const { data: session } = useSession();
	return (
		<div className={styles.container}>
			<nav>
				<ul>
					<li>
						{session ? (<button onClick={() => signOut()}>Sign Out</button>) : (<>Sign In</>)}
					</li>
				</ul>
			</nav>
		</div>
	);
}

export default NavBar;
