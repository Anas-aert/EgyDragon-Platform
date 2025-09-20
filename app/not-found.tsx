import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        background: "#0f172a",
        color: "white",
      }}
    >
      <h1 style={{ fontSize: "6rem", fontWeight: "bold" }}>404</h1>
      <h2 style={{ fontSize: "1.5rem", marginTop: "1rem" }}>
        Page Not Found
      </h2>
      <p style={{ marginTop: "0.5rem", opacity: 0.7 }}>
        Sorry, we couldn’t find the page you’re looking for.
      </p>
      <Link
        href="/"
        style={{
          marginTop: "2rem",
          padding: "0.75rem 1.5rem",
          borderRadius: "0.5rem",
          background: "#2563eb",
          color: "white",
          fontWeight: "500",
          textDecoration: "none",
        }}
      >
        Back to Home
      </Link>
    </div>
  );
}
