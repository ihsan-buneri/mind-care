"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Hero() {
	return (
		<section className='py-20 px-4'>
			<div className='container mx-auto max-w-6xl text-center'>
				<div className='mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000'>
					<div className='inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6'>
						<Sparkles className='w-4 h-4' />
						<span>Start Your Mental Health Journey</span>
					</div>
					<h1 className='text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight'>
						Your Mental Health
						<span className='bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent block'>
							Matters
						</span>
					</h1>
					<p className='text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed'>
						Take the first step towards better mental health with our
						confidential assessment and AI-powered support assistant designed
						specifically for depression care.
					</p>
				</div>

				<div className='flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300'>
					<Link href='/user-assessment'>
						<Button
							size='lg'
							className='bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105'
						>
							Get Started
							<ArrowRight className='w-5 h-5 ml-2' />
						</Button>
					</Link>
				</div>
			</div>
		</section>
	);
}
