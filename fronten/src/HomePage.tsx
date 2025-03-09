import React from 'react';
import polylogo from "./assets/poly-logo.webp"


const HomePage = () => {
    return (
        <div className="w-screen">
            {/* Fixed Navigation Bar */}
            <header className="bg-white shadow fixed top-0 left-0 w-screen z-40">
                <div className="w-screen px-4 sm:px-6 lg:px-8 flex items-center justify-between py-3">
                    <div className="flex items-center space-x-3">
                        <img src={polylogo} alt="Logo" className="h-15 w-15" />
                        <span className="text-xl font-bold text-purple-600">
              PolyMart
            </span>
                    </div>
                    <div className="flex-1 mx-8 flex items-center">
                        <div className="inline-flex w-full">
                            <input
                                type="text"
                                placeholder="Search for items..."
                                className="flex-grow px-4 py-2 border border-gray-300 text-black rounded-l-full focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />
                            <button
                                className="ml-2 px-4 py-2 bg-purple-600 text-white rounded-l-full hover:bg-purple-700 transition"
                            >
                                Search
                            </button>
                        </div>
                    </div>


                    <nav className="hidden md:flex space-x-4">
                        <a href="#" className="text-gray-700 hover:text-purple-600">Home</a>
                        <a href="#" className="text-gray-700 hover:text-purple-600">My Listings</a>
                        <a href="#" className="text-gray-700 hover:text-purple-600">Messages</a>
                        <a href="#" className="text-gray-700 hover:text-purple-600">Profile</a>
                    </nav>
                </div>
            </header>

            <main className="pt-20">
                {/* Banner Section */}
                <section className="relative">
                    <img
                        src="/assets/banner.jpg"  // Replace with your banner image
                        alt="Banner"
                        className="w-screen h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white">
                            Discover Great Deals
                        </h1>
                    </div>
                </section>

                {/* Categories Section */}
                <section className="py-8 bg-white">
                    <div className="w-screen px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold text-purple-600 mb-4 text-center">
                            Shop by Category
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gray-50 p-4 rounded shadow hover:shadow-lg transition flex flex-col items-center">
                                <img
                                    src="/assets/category-electronics.webp"
                                    alt="Electronics"
                                    className="h-16 w-16 object-contain mb-2"
                                />
                                <span className="text-gray-700 font-medium">Electronics</span>
                            </div>
                            <div className="bg-gray-50 p-4 rounded shadow hover:shadow-lg transition flex flex-col items-center">
                                <img
                                    src="/assets/category-fashion.webp"
                                    alt="Fashion"
                                    className="h-16 w-16 object-contain mb-2"
                                />
                                <span className="text-gray-700 font-medium">Fashion</span>
                            </div>
                            <div className="bg-gray-50 p-4 rounded shadow hover:shadow-lg transition flex flex-col items-center">
                                <img
                                    src="/assets/category-home.webp"
                                    alt="Home & Garden"
                                    className="h-16 w-16 object-contain mb-2"
                                />
                                <span className="text-gray-700 font-medium">Home & Garden</span>
                            </div>
                            <div className="bg-gray-50 p-4 rounded shadow hover:shadow-lg transition flex flex-col items-center">
                                <img
                                    src="/assets/category-sports.webp"
                                    alt="Sports"
                                    className="h-16 w-16 object-contain mb-2"
                                />
                                <span className="text-gray-700 font-medium">Sports</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Recently Viewed Listings Section */}
                <section className="py-8 bg-gray-100">
                    <div className="w-screen px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold text-purple-600 mb-4 text-center">
                            Recently Viewed Listings
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {/* Example Listing Card */}
                            <div className="bg-white rounded-lg shadow hover:shadow-xl transition p-4">
                                <img
                                    src="/assets/item5.webp"
                                    alt="Recently Viewed 1"
                                    className="w-full h-24 object-cover rounded"
                                />
                                <h3 className="mt-2 text-md font-semibold text-gray-800">
                                    Recent Item 1
                                </h3>
                                <p className="text-gray-600 text-sm">$15.99</p>
                            </div>
                            <div className="bg-white rounded-lg shadow hover:shadow-xl transition p-4">
                                <img
                                    src="/assets/item6.webp"
                                    alt="Recently Viewed 2"
                                    className="w-full h-24 object-cover rounded"
                                />
                                <h3 className="mt-2 text-md font-semibold text-gray-800">
                                    Recent Item 2
                                </h3>
                                <p className="text-gray-600 text-sm">$25.99</p>
                            </div>
                            <div className="bg-white rounded-lg shadow hover:shadow-xl transition p-4">
                                <img
                                    src="/assets/item7.webp"
                                    alt="Recently Viewed 3"
                                    className="w-full h-24 object-cover rounded"
                                />
                                <h3 className="mt-2 text-md font-semibold text-gray-800">
                                    Recent Item 3
                                </h3>
                                <p className="text-gray-600 text-sm">$35.99</p>
                            </div>
                            <div className="bg-white rounded-lg shadow hover:shadow-xl transition p-4">
                                <img
                                    src="/assets/item8.webp"
                                    alt="Recently Viewed 4"
                                    className="w-full h-24 object-cover rounded"
                                />
                                <h3 className="mt-2 text-md font-semibold text-gray-800">
                                    Recent Item 4
                                </h3>
                                <p className="text-gray-600 text-sm">$45.99</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Listings Section */}
                <section className="py-8 bg-gray-50">
                    <div className="w-screen px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold text-purple-600 mb-4 text-center">
                            Featured Listings
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-lg shadow hover:shadow-xl transition p-4">
                                <img
                                    src="/assets/item1.webp"
                                    alt="Item 1"
                                    className="w-full h-24 object-cover rounded"
                                />
                                <h3 className="mt-2 text-md font-semibold text-gray-800">
                                    Item Title 1
                                </h3>
                                <p className="text-gray-600 text-sm">$19.99</p>
                            </div>
                            <div className="bg-white rounded-lg shadow hover:shadow-xl transition p-4">
                                <img
                                    src="/assets/item2.webp"
                                    alt="Item 2"
                                    className="w-full h-24 object-cover rounded"
                                />
                                <h3 className="mt-2 text-md font-semibold text-gray-800">
                                    Item Title 2
                                </h3>
                                <p className="text-gray-600 text-sm">$29.99</p>
                            </div>
                            <div className="bg-white rounded-lg shadow hover:shadow-xl transition p-4">
                                <img
                                    src="/assets/item3.webp"
                                    alt="Item 3"
                                    className="w-full h-24 object-cover rounded"
                                />
                                <h3 className="mt-2 text-md font-semibold text-gray-800">
                                    Item Title 3
                                </h3>
                                <p className="text-gray-600 text-sm">$39.99</p>
                            </div>
                            <div className="bg-white rounded-lg shadow hover:shadow-xl transition p-4">
                                <img
                                    src="/assets/item4.webp"
                                    alt="Item 4"
                                    className="w-full h-24 object-cover rounded"
                                />
                                <h3 className="mt-2 text-md font-semibold text-gray-800">
                                    Item Title 4
                                </h3>
                                <p className="text-gray-600 text-sm">$49.99</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer Section */}
            <footer className="bg-gradient-to-r from-purple-700 to-indigo-700 py-6">
                <div className="w-screen px-4 sm:px-6 lg:px-8 text-center text-white">
                    <p className="mb-2">
                        © {new Date().getFullYear()} Florida Polytechnic University MarketPlace. All rights reserved.
                    </p>
                    <p>
                        <a href="mailto:info@fpu.edu" className="underline">info@fpu.edu</a>
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
