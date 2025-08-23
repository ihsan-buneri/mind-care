"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Bot, User } from "lucide-react";

interface Message {
	id: string;
	text: string;
	sender: "user" | "assistant";
	timestamp: Date;
}

const getInitialSuggestion = (level: string, score: number) => {
	if (level === "Minimal") {
		return "Great to see you here! Based on your assessment, you're showing minimal signs of depression. I'm here to help you maintain your mental wellness. Would you like to discuss any stress management techniques or general wellness tips?";
	} else if (level === "Mild") {
		return `Your assessment indicates mild depression symptoms (score: ${score}/15). This is a positive step in taking care of your mental health. I can help you with coping strategies, mood tracking techniques, or just be here to listen. What would be most helpful for you right now?`;
	} else if (level === "Moderate") {
		return `Thank you for taking the assessment. Your results show moderate depression symptoms (score: ${score}/15). While I can provide support and coping strategies, I also encourage you to consider speaking with a mental health professional. How can I best support you today?`;
	} else {
		return `I appreciate you taking the assessment. Your results indicate severe symptoms (score: ${score}/15). Please know that you're not alone, and reaching out for professional help is important. While I'm here to provide immediate support, please consider contacting a mental health professional. How are you feeling right now?`;
	}
};

const Chat = () => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		// Check if we have assessment data from localStorage
		const assessmentScore = localStorage.getItem("assessmentScore");
		const assessmentLevel = localStorage.getItem("assessmentLevel");
		const showInitialSuggestion = localStorage.getItem("showInitialSuggestion");

		if (
			showInitialSuggestion === "true" &&
			assessmentLevel &&
			assessmentScore
		) {
			const initialMessage = {
				id: "1",
				text: getInitialSuggestion(assessmentLevel, parseInt(assessmentScore)),
				sender: "assistant" as const,
				timestamp: new Date(),
			};
			setMessages([initialMessage]);
			// Clear the flag so it doesn't show again on refresh
			localStorage.removeItem("showInitialSuggestion");
		} else {
			setMessages([
				{
					id: "1",
					text: "Hello! I'm your AI mental health assistant. I'm here to provide support, guidance, and a safe space to talk about how you're feeling. How can I help you today?",
					sender: "assistant" as const,
					timestamp: new Date(),
				},
			]);
		}
	}, []);

	const handleSend = async () => {
		if (!input.trim()) return;

		const userMessage: Message = {
			id: Date.now().toString(),
			text: input,
			sender: "user",
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setIsLoading(true);

		// Simulate AI response (replace with actual AI integration)
		setTimeout(() => {
			const responses = [
				"I understand how you're feeling. It's completely normal to experience these emotions, and I'm here to support you through this.",
				"Thank you for sharing that with me. Your feelings are valid, and it takes courage to talk about what you're going through.",
				"That sounds challenging. Remember that seeking help is a sign of strength, not weakness. Have you considered speaking with a mental health professional?",
				"I hear you. It's important to take things one day at a time. What's one small thing that brings you comfort or joy?",
				"Your mental health matters, and you deserve support. Would you like to talk about some coping strategies that might help?",
			];

			const assistantMessage: Message = {
				id: (Date.now() + 1).toString(),
				text: responses[Math.floor(Math.random() * responses.length)],
				sender: "assistant",
				timestamp: new Date(),
			};

			setMessages((prev) => [...prev, assistantMessage]);
			setIsLoading(false);
		}, 1000);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	return (
		<div className='min-h-screen bg-background'>
			<div className='container mx-auto px-4 py-8 h-[calc(100vh-80px)]'>
				<div className='h-full flex flex-col bg-white rounded-lg shadow-lg border'>
					<div className='flex-1 flex flex-col p-0'>
						<div className='bg-blue-50 border-b border-gray-200 p-4'>
							<h2 className='text-xl font-semibold text-gray-900'>
								AI Mental Health Assistant
							</h2>
							<p className='text-sm text-gray-600'>
								A supportive space for your mental health journey
							</p>
						</div>

						<div className='flex-1 p-4 overflow-y-auto'>
							<div className='space-y-4'>
								{messages.map((message) => (
									<div
										key={message.id}
										className={`flex ${
											message.sender === "user"
												? "justify-end"
												: "justify-start"
										}`}
									>
										<div
											className={`flex max-w-[80%] ${
												message.sender === "user"
													? "flex-row-reverse"
													: "flex-row"
											} space-x-2`}
										>
											<div
												className={`w-8 h-8 rounded-full flex items-center justify-center ${
													message.sender === "user"
														? "bg-blue-600 text-white ml-2"
														: "bg-green-600 text-white mr-2"
												}`}
											>
												{message.sender === "user" ? (
													<User className='h-4 w-4' />
												) : (
													<Bot className='h-4 w-4' />
												)}
											</div>
											<div
												className={`rounded-lg px-4 py-3 ${
													message.sender === "user"
														? "bg-blue-600 text-white"
														: "bg-gray-100 text-gray-900"
												}`}
											>
												<p className='text-sm leading-relaxed'>
													{message.text}
												</p>
												<p className='text-xs opacity-70 mt-1'>
													{message.timestamp.toLocaleTimeString([], {
														hour: "2-digit",
														minute: "2-digit",
													})}
												</p>
											</div>
										</div>
									</div>
								))}

								{isLoading && (
									<div className='flex justify-start'>
										<div className='flex space-x-2'>
											<div className='w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center'>
												<Bot className='h-4 w-4' />
											</div>
											<div className='bg-gray-100 rounded-lg px-4 py-3'>
												<div className='flex space-x-1'>
													<div className='w-2 h-2 bg-gray-600 rounded-full animate-bounce'></div>
													<div
														className='w-2 h-2 bg-gray-600 rounded-full animate-bounce'
														style={{ animationDelay: "0.1s" }}
													></div>
													<div
														className='w-2 h-2 bg-gray-600 rounded-full animate-bounce'
														style={{ animationDelay: "0.2s" }}
													></div>
												</div>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>

						<div className='border-t border-gray-200 p-4'>
							<div className='flex space-x-2'>
								<input
									type='text'
									placeholder='Type your message here...'
									value={input}
									onChange={(e) => setInput(e.target.value)}
									onKeyDown={handleKeyDown}
									disabled={isLoading}
									className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								/>
								<Button
									onClick={handleSend}
									disabled={!input.trim() || isLoading}
									size='icon'
								>
									<Send className='h-4 w-4' />
								</Button>
							</div>
							<p className='text-xs text-gray-500 mt-2 text-center'>
								This AI assistant provides support but is not a replacement for
								professional mental health care.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Chat;
