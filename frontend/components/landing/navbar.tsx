"use client";

import { Button } from "@/components/ui/button";
import { Heart, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
	return (
		<nav className='bg-white/80 backdrop-blur-md border-b border-green-100 sticky top-0 z-50'>
			<div className='container mx-auto px-4 py-4'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center space-x-2'>
						<div className='w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center'>
							<Heart className='w-6 h-6 text-white' />
						</div>
						<span className='text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent'>
							MindCare
						</span>
					</div>
					<Link href='/user-assessment'>
						<Button className='bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300'>
							Get Started
							<ArrowRight className='w-4 h-4 ml-2' />
						</Button>
					</Link>
				</div>
			</div>
		</nav>
	);
}
