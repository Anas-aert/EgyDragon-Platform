import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">About Us</h1>
          <p className="text-lg text-gray-200">
            Welcome to <span className="font-semibold">EgyDrag</span> – We build
            modern solutions to make your digital life easier and smarter.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Image */}
          <div>
            <Image
              src="/Team.png"
              alt="Team working"
              width={600}
              height={400}
              className="rounded-2xl shadow-lg object-cover"
            />
          </div>

          {/* Text */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Who We Are
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We are a passionate team of developers, designers, and creators
              who believe in the power of technology to solve real-world
              problems. Our goal is to deliver high-quality products that
              combine great user experience with strong performance.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Since our launch, we’ve been committed to innovation, teamwork,
              and continuous improvement to better serve our users.
            </p>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-800">
            What Drives Us
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">
                🚀 Mission
              </h3>
              <p className="text-gray-600">
                To create modern, scalable, and user-friendly solutions that
                empower businesses and individuals.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3 text-indigo-600">
                🌍 Vision
              </h3>
              <p className="text-gray-600">
                To be recognized as a leader in innovative technology solutions
                worldwide.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3 text-green-600">
                💡 Values
              </h3>
              <p className="text-gray-600">
                Innovation, teamwork, transparency, and a relentless pursuit of
                excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Join Our Journey</h2>
        <p className="mb-6 text-gray-200">
          We’re always looking for new talents and partners. Let’s build the
          future together.
        </p>
        <a
          href="/contact"
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-100 transition"
        >
          Contact Us
        </a>
      </section>
    </main>
  );
}
