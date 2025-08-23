"use client";

import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";

export default function LandingPage() {
	return (
		<div className='min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50'>
			{/* Navigation */}
			<Navbar />
			{/* Hero Section */}
			<Hero />
		</div>
	);
}
