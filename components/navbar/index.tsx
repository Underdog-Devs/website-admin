import { getSession } from 'next-auth/react';
import React from 'react';
import styles from './navBar.module.scss';


const NavBar = (props: any) => {
	const { session } = props;
	console.log(session)
	return (
		<div className={styles.container}>
			<nav>
				<ul>
					<li>
						{session ? (<>Session</>) : (<>No Session</>)}
					</li>
				</ul>
			</nav>
		</div>
	)
}

export default NavBar;


export async function getServerSideProps(context: any) {
	const session = await getSession({ req: context.req });
	// Redirect if user isn't logged in
	console.log(session)
	if (!session) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	return {
		props: { session },

	};
}