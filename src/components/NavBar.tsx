'use client';

import Link from "next/link";
import { useEffect } from "react";
import { useSession } from "next-auth/react";


export default function NavBar() {
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === "admin";
    const isLoggedIn = !!session?.user;

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" href="/">
                <img src="favicon.ico" width="40" height="30" className="d-inline-block align-top" alt="Music App Logo" />
            </Link>

            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav">
                    {isAdmin && (<Link href="/new" className="nav-item nav-link">
                        New Album
                    </Link>)}
                    {!isLoggedIn && (<Link href="/api/auth/signin" className="nav-item nav-link">
                        Sign In
                    </Link>)}

                    {isLoggedIn && (<Link href="/api/auth/signout" className="nav-item nav-link">
                        Sign Out
                    </Link>)}

                </div>
            </div>
        </nav>
    );

}