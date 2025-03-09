import polylogo from "./assets/poly-logo.webp"

const LandingPage = () => {

    const handleLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/azure-dev"
    }
    return (
        // Outer container is full width with horizontal overflow prevented.
        <div className="flex flex-col font-sans min-h-screen w-full overflow-x-hidden">
            {/* Fixed Navbar */}
            <header className="fixed top-0 left-0 w-full z-30 bg-white bg-opacity-90 backdrop-blur shadow">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-3">
                            {/* Replace with your logo image if available */}
                            <img src={polylogo} className="h-15 w-15"  alt="logo"/>
                            <span className="text-xl font-bold text-purple-600">
                PolyMart
              </span>
                        </div>
                        <nav className="hidden md:flex space-x-8">
                            <a href="#features" className="text-gray-700 hover:text-purple-600 transition">
                                Features
                            </a>
                            <a href="#about" className="text-gray-700 hover:text-purple-600 transition">
                                About
                            </a>
                            <a href="#contact" className="text-gray-700 hover:text-purple-600 transition">
                                Contact
                            </a>
                        </nav>
                        <div className="md:hidden">
                            <button className="text-gray-700 focus:outline-none">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-16 flex-grow bg-gradient-to-r from-purple-600 to-indigo-600 w-full">
                <div className="w-full px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center h-[80vh] text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white">
                        Elevate Your Campus Experience
                    </h1>
                    <p className="mt-4 max-w-xl text-lg md:text-2xl text-gray-100">
                        A cutting-edge marketplace exclusively for Florida Polytechnic University students. Discover, connect, and thrive.
                    </p>
                    <a
                        onClick={handleLogin}
                        className="mt-8 inline-block px-8 py-3 bg-white text-purple-600 font-semibold rounded-full hover:bg-gray-100 transition"
                    >
                        Get Started
                    </a>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 bg-gray-50 w-full">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-purple-600">Key Features</h2>
                        <p className="mt-2 text-gray-600">
                            Our platform offers an intuitive, secure, and efficient way to connect campus members.
                        </p>
                    </div>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-lg shadow p-6 hover:shadow-xl transition">
                            <div className="flex justify-center">
                                <svg className="h-10 w-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 8c-2.21 0-4 1.79-4 4v2H4v2h4v2c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-2h4v-2h-4v-2c0-2.21-1.79-4-4-4z"
                                    />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-xl font-semibold text-center text-purple-600">
                                Seamless Listings
                            </h3>
                            <p className="mt-2 text-gray-600 text-center">
                                Post and manage items effortlessly with our user-friendly interface.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6 hover:shadow-xl transition">
                            <div className="flex justify-center">
                                <svg className="h-10 w-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M17 9V7a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 4v2a2 2 0 01-2 2H9a2 2 0 01-2-2v-2m10-4H7"
                                    />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-xl font-semibold text-center text-purple-600">
                                Robust Security
                            </h3>
                            <p className="mt-2 text-gray-600 text-center">
                                Your transactions are safeguarded with state-of-the-art security protocols.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6 hover:shadow-xl transition">
                            <div className="flex justify-center">
                                <svg className="h-10 w-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m-7-8h8a2 2 0 012 2v6a2 2 0 01-2 2h-8a2 2 0 01-2-2V10a2 2 0 012-2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-xl font-semibold text-center text-purple-600">
                                Trusted Community
                            </h3>
                            <p className="mt-2 text-gray-600 text-center">
                                Join a verified network exclusively for Florida Polytechnic University students.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-16 w-full bg-gradient-to-r from-purple-100 to-indigo-100">
                <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-purple-700">About Our Platform</h2>
                    <p className="mt-4 text-gray-700 max-w-2xl mx-auto">
                        Our marketplace is designed to bring the campus community together with a seamless and secure experience.
                        We focus on innovation, ease of use, and a modern aesthetic to meet high business standards.
                    </p>
                </div>
            </section>

            {/* Footer Section */}
            <footer id="contact" className="bg-gradient-to-r from-purple-700 to-indigo-700 w-full">
                <div className="w-full px-4 sm:px-6 lg:px-8 py-8 text-center text-white">
                    <p className="mb-2">
                        Contact Us: <a href="mailto:info@fpu.edu" className="underline text-white">info@fpu.edu</a>
                    </p>
                    <p className="text-sm">
                        &copy; {new Date().getFullYear()} Florida Polytechnic University. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
