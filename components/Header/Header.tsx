import React, { useState } from 'react';
import Link from 'next/link';
import { auth } from '../../firebase/Config/firebase';
import styles from './Header.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCompass, faPlusSquare, faUser, faSignOutAlt, faBars } from '@fortawesome/free-solid-svg-icons';

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            console.log("Logged out successfully");
        } catch (error) {
            console.error('Error logging out:', (error as Error).message);
        }
    };

    return (
        <header className={styles.header}>
            {/* Sidebar Navigation for big screens */}
            <nav className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                <div className={styles.logo}>
                    <Link href="/">
                        <img src="assets/logo.png" alt="Logo" />
                    </Link>
                </div>
                <ul>
                    <li>
                        <Link href="/">
                            <FontAwesomeIcon icon={faHome} /> Home
                        </Link>
                    </li>
                    <li>
                        <Link href="/loops">
                            <FontAwesomeIcon icon={faCompass} /> Loops
                        </Link>
                    </li>
                    <li>
                        <Link href="/explore">
                            <FontAwesomeIcon icon={faCompass} /> Explore
                        </Link>
                    </li>
                    <li>
                        <Link href="/create">
                            <FontAwesomeIcon icon={faPlusSquare} /> Create
                        </Link>
                    </li>
                    <li>
                        <Link href="/profile">
                            <FontAwesomeIcon icon={faUser} /> Profile
                        </Link>
                    </li>
                    <li>
                        <a href="#" onClick={handleLogout}><FontAwesomeIcon icon={faSignOutAlt} /> Logout</a>
                    </li>
                </ul>
            </nav>

            {/* Top Navbar for small screens */}
            <nav className={styles.topNavbar}>
                <div className={styles.logo}>
                    <Link href="/">
                        <img src="assets/logo.png" alt="Logo" />
                    </Link>
                </div>
            </nav>

            {/* Bottom Navbar for small screens */}
            <nav className={styles.bottomNavbar}>
                <ul>
                    <li>
                        <Link href="/">
                            <FontAwesomeIcon icon={faHome} /> 
                        </Link>
                    </li>
                    <li>
                        <Link href="/loops">
                            <FontAwesomeIcon icon={faCompass} /> 
                        </Link>
                    </li>
                    <li>
                        <Link href="/explore">
                            <FontAwesomeIcon icon={faCompass} /> 
                        </Link>
                    </li>
                    <li>
                        <Link href="/create">
                            <FontAwesomeIcon icon={faPlusSquare} /> 
                        </Link>
                    </li>
                    <li>
                        <Link href="/profile">
                            <FontAwesomeIcon icon={faUser} /> 
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* Hamburger Menu for small screens */}
            <div className={styles.hamburger} onClick={toggleSidebar}>
                <FontAwesomeIcon icon={faBars} className={styles.line} />
            </div>
        </header>
    );
};

export default Header;
