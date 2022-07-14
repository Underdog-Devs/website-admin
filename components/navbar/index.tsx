// import { useSession, signOut } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa';
import styles from './navBar.module.scss';

function NavBar() {
	// const { data: session } = useSession();
	const [showLinks, setShowLinks] = useState(false);
	const linksContainerRef = useRef<HTMLElement | null>(null);
	const toggleLinks = () => {
		setShowLinks(!showLinks);
	};

	useEffect(() => {
		if (showLinks) {
			if (linksContainerRef.current) {
				linksContainerRef.current.style.height = 'auto';
			}
		} else if (linksContainerRef.current) {
			linksContainerRef.current.style.height = '0px';
		}
	}, [showLinks]);

	return (
		<div className={styles.container}>
			<div className={styles.desktopNav}>
				<Link href="/" passHref>
					<img
						className={styles.image}
						src="/images/underdogdevs-01-sm.png"
						height={175}
						width={175}
						alt="Underdog devs"
					/>
				</Link>
				<nav className={styles.navigation}>
					<div className={styles.navigationLinks}>
						{/* {session && (<p>{session.email} | <a onClick={() => signOut()}>Sign Out</a></p>) } */}
					</div>

				</nav>
			</div>
			<div className={styles.mobileNav}>
				<div className={styles.navHeader}>
					<Link href="/" passHref>
						<img
							onClick={() => setShowLinks(false)}
							className={styles.image}
							src="/images/icon-01.png"
							height={75}
							width={75}
							alt="Underdog devs"
						/>
					</Link>
					<button
						aria-label="navigation-menu"
						className={styles.navToggle}
						onClick={toggleLinks}
					>
						{showLinks ? <FaTimes /> : <FaBars />}
					</button>
				</div>
				<nav className={styles.mobileNavigation} ref={linksContainerRef}>
					{/* {session ? (<a onClick={() => signOut()}>Sign Out</a>) : (<>Sign In</>)} */}
				</nav>
			</div>
		</div>
	);
}

export default NavBar;