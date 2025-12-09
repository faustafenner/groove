import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="mt-auto py-4"
      style={{
        backgroundColor: "#33142F",
        borderTop: "1px solid #4a2045",
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3 mb-md-0">
            <h5 className="text-orange">Groove</h5>
            <p
              className="text-cream"
              style={{ opacity: 0.7, fontSize: "0.9rem" }}
            >
              F*ck the Recording Academy, You&apos;re Rating Albums Now.
            </p>
          </div>
          <div className="col-md-4 mb-3 mb-md-0">
            <h6 className="text-white mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link
                  href="/Home"
                  className="text-cream text-decoration-none"
                  style={{ opacity: 0.7 }}
                >
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="/Search"
                  className="text-cream text-decoration-none"
                  style={{ opacity: 0.7 }}
                >
                  Search
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="/Crates"
                  className="text-cream text-decoration-none"
                  style={{ opacity: 0.7 }}
                >
                  Crates
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-md-4">
            <h6 className="text-white mb-3">About</h6>
            <p
              className="text-cream"
              style={{ opacity: 0.7, fontSize: "0.9rem" }}
            >
              Share your music opinions, create collections, and discover new
              albums.
            </p>
          </div>
        </div>
        <hr style={{ borderColor: "#4a2045", opacity: 0.5 }} />
        <div className="text-center">
          <p
            className="text-cream mb-0"
            style={{ opacity: 0.5, fontSize: "0.85rem" }}
          >
            &copy; {new Date().getFullYear()} Groove. No rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
