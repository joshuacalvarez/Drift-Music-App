"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function NavBar() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  return (
    <nav
      className="d-flex flex-column bg-dark text-white p-3 position-fixed top-0 start-0 vh-100"
      style={{ width: "220px" }}
    >
      <Link href="/" className="text-center mb-4">
        <img
          src="/favicon.ico"
          width={100}
          height={100}
          className="img-fluid"
          alt="Logo"
        />
      </Link>

      <Link href="/albums" className="text-center text-white mb-3 nav-link" style={{ fontSize: "24px", margin: "10px" }}>
        Albums
      </Link>
      <Link href="/quotes" className="text-center text-white mb-3 nav-link" style={{ fontSize: "24px", margin: "10px" }}>
        Quotes
      </Link>
      {!isLoggedIn && (<Link href="/api/auth/signin" className="nav-item nav-link text-center mt-auto" style={{ marginBottom: "10px", fontSize: "28px" }}>
        Sign In
      </Link>)}
      {session?.user?.image && (
        <div className="text-center mt-auto">
          <Link href="/profile" >
            <img
              src={session.user.image}
              alt="Profile"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: "10px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.transition = "transform 0.2s";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.transition = "transform 0.2s";
              }}
              onClick={(e) => {
                e.currentTarget.style.transform = "scale(.95)";
              }}
            />
          </Link>
          <div style={{ fontSize: "14px", opacity: 0.8 }}>
            {session.user.name}
          </div>
          {isLoggedIn && (<Link href="/api/auth/signout" className="nav-item nav-link">
            Sign Out
          </Link>)}
        </div>
      )}

    </nav>

  );
}
