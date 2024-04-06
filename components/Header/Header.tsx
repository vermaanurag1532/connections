import React, { useState } from 'react';
import Link from 'next/link';
import { auth } from '../../firebase/Config/firebase'; // Import Firebase authentication
import styles from './Header.module.css';

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = async () => {
        try {
            await auth.signOut(); // Sign out the user using Firebase authentication
            // You can add additional logic here such as clearing local storage, redirecting, etc.
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
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link href="/loops">
                            Loops
                        </Link>
                    </li>
                    <li>
                        <Link href="/explore">
                            Explore
                        </Link>
                    </li>
                    <li>
                        <Link href="/create">
                            Create
                        </Link>
                    </li>
                    <li>
                        <Link href="/profile">
                            Profile
                        </Link>
                    </li>
                    <li>
                        <a href="#" onClick={handleLogout}>Logout</a>
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
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link href="/loops">
                            Loops
                        </Link>
                    </li>
                    <li>
                        <Link href="/explore">
                            Explore
                        </Link>
                    </li>
                    <li>
                        <Link href="/create">
                            Create
                        </Link>
                    </li>
                    <li>
                        <Link href="/profile">
                            Profile
                        </Link>
                    </li>
                    <li>
                        <a href="#" onClick={handleLogout}>Logout</a>
                    </li>
                </ul>
            </nav>

            {/* Hamburger Menu for small screens */}
            <div className={styles.hamburger} onClick={toggleSidebar}>
                <div className={styles.line}></div>
                <div className={styles.line}></div>
                <div className={styles.line}></div>
            </div>
        </header>
    );
};

export default Header;
