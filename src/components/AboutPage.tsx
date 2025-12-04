import Link from "next/link";


export default function AboutPage() {

    // query some data here using axios or fetch?
    // const response = await fetch("/api/something/something")
    const name = 2;



    return (
        <main className="d-flex justify-content-center align-items-center">
            <div className="card" style={{ maxWidth: '500px' }}>
                <div className="card-body text-center">
                    <h3 className="card-title mb-3">About Page</h3>
                    <p className="card-text">
                        Hi professor I'm sorry for everything don't hate me please
                    </p>
                    
                    <br /><br />
                    <p>I swear this is cool i just don't understand stuff sometimes</p>
                    <br />
                    
                    <Link href="/" className="btn btn-primary">
                        Go Home 
                    </Link>
                </div>
            </div>
        </main>
    );
}