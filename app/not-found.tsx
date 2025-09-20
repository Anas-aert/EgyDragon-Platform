import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-center px-4">
      {/* Big 404 number */}
      <h1 className="text-9xl font-extrabold text-white drop-shadow-lg">404</h1>

      {/* Title */}
      <h2 className="mt-4 text-2xl md:text-3xl font-semibold text-gray-300">
        Page Not Found
      </h2>

      {/* Description */}
      <p className="mt-2 text-gray-400">
        {`Sorry, we couldn’t find the page you’re looking for.`}
      </p>

      {/* Back button */}
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition"
      >
        Back to Home
      </Link>
    </div>
  );
}
