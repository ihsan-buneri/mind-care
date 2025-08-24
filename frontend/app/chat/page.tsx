"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, Heart } from "lucide-react";
import Link from "next/link";
import { sendChatMessage } from "@/lib/api";

interface Message {
	id: string;
	text: string;
	sender: "user" | "assistant";
	timestamp: Date;
}

const Chat = () => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		// Check if we have assessment data and initial AI response from localStorage
		const assessmentDataString = localStorage.getItem("assessmentData");
		const showInitialSuggestion = localStorage.getItem("showInitialSuggestion");
		const initialAIResponse = localStorage.getItem("initialAIResponse");

		if (showInitialSuggestion === "true" && assessmentDataString) {
			try {
				const assessmentData = JSON.parse(assessmentDataString);

				// Use the AI-generated initial response if available, otherwise fallback to default
				let initialMessage =
					"Hello! I'm your AI mental health assistant. I'm here to provide support, guidance, and a safe space to talk about how you're feeling. How can I help you today?";

				if (initialAIResponse) {
					initialMessage = initialAIResponse;
					// Clear the initial AI response so it doesn't show again on refresh
					localStorage.removeItem("initialAIResponse");
				}

				const contextMessage = {
					id: "1",
					text: initialMessage,
					sender: "assistant" as const,
					timestamp: new Date(),
				};

				setMessages([contextMessage]);
				// Clear the flag so it doesn't show again on refresh
				localStorage.removeItem("showInitialSuggestion");
			} catch (error) {
				console.error("Error parsing assessment data:", error);
				setMessages([
					{
						id: "1",
						text: "Hello! I'm your AI mental health assistant. I'm here to provide support, guidance, and a safe space to talk about how you're feeling. How can I help you today?",
						sender: "assistant" as const,
						timestamp: new Date(),
					},
				]);
			}
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

		try {
			// Get assessment data for context
			const assessmentDataString = localStorage.getItem("assessmentData");
			let assessmentContext = "";

			if (assessmentDataString) {
				try {
					const assessmentData = JSON.parse(assessmentDataString);
					assessmentContext = `
Assessment Context:
- Score: ${assessmentData.score}/15
- Level: ${assessmentData.level}
- Questions and Answers:
${assessmentData.questions
	.map((q: any) => `  Q${q.id}: ${q.question} - Answer: ${q.answerText}`)
	.join("\n")}
					`.trim();
				} catch (error) {
					console.error("Error parsing assessment data:", error);
				}
			}

			// Prepare payload for chat API
			const payload = {
				message: input,
				conversationHistory: messages.map((msg) => ({
					role:
						msg.sender === "user" ? ("user" as const) : ("assistant" as const),
					content: msg.text,
				})),
				assessmentContext: assessmentContext,
				timestamp: new Date().toISOString(),
			};

			console.log("Chat API Payload:", payload);

			// Call the actual API using the centralized API function
			const data = await sendChatMessage(payload);
			console.log("API Response:", data);

			const assistantMessage: Message = {
				id: (Date.now() + 1).toString(),
				text: data.data,
				sender: "assistant",
				timestamp: new Date(),
			};

			setMessages((prev) => [...prev, assistantMessage]);
		} catch (error) {
			console.error("Error sending message:", error);

			// Fallback response in case of API error
			const fallbackMessage: Message = {
				id: (Date.now() + 1).toString(),
				text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment, or if you're in crisis, please contact a mental health professional or crisis hotline immediately.",
				sender: "assistant",
				timestamp: new Date(),
			};

			setMessages((prev) => [...prev, fallbackMessage]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4'>
			<div className='w-full max-w-4xl h-[90vh]'>
				<div className='h-full flex flex-col bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-1000'>
					<div className='flex-1 flex flex-col p-0'>
						<div className='bg-gradient-to-r from-green-100 to-emerald-100 border-b border-green-200 p-4 flex justify-center'>
							<Link href='/'>
								<div className='flex items-center space-x-2'>
									<div className='w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center'>
										<Heart className='w-5 h-5 text-white' />
									</div>
									<span className='text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent'>
										MindCare
									</span>
								</div>
							</Link>
						</div>

						<div className='flex-1 p-4 overflow-y-auto bg-gradient-to-b from-white/50 to-green-50/30'>
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
												className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
													message.sender === "user"
														? "bg-gradient-to-r from-green-600 to-emerald-600 text-white ml-2"
														: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white mr-2"
												}`}
											>
												{message.sender === "user" ? (
													<User className='h-4 w-4' />
												) : (
													<Bot className='h-4 w-4' />
												)}
											</div>
											<div
												className={`rounded-xl px-4 py-3 shadow-lg ${
													message.sender === "user"
														? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
														: "bg-white/90 backdrop-blur-sm text-gray-900 border border-white/20"
												}`}
											>
												<p className='text-xs leading-relaxed'>
													{message.text}
												</p>
												<p
													className={`text-[10px] mt-1 ${
														message.sender === "user"
															? "text-green-100"
															: "text-gray-500"
													}`}
												>
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
											<div className='w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex items-center justify-center shadow-lg'>
												<Bot className='h-4 w-4' />
											</div>
											<div className='bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20 shadow-lg'>
												<div className='flex space-x-1'>
													<div className='w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-bounce'></div>
													<div
														className='w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-bounce'
														style={{ animationDelay: "0.1s" }}
													></div>
													<div
														className='w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-bounce'
														style={{ animationDelay: "0.2s" }}
													></div>
												</div>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>

						<div className='border-t border-green-200 p-4 bg-white/80 backdrop-blur-sm'>
							<div className='flex space-x-2'>
								<input
									type='text'
									placeholder='Type your message here...'
									value={input}
									onChange={(e) => setInput(e.target.value)}
									onKeyDown={handleKeyDown}
									disabled={isLoading}
									className='flex-1 px-3 py-2 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80 backdrop-blur-sm placeholder-gray-500 text-gray-900 transition-all duration-300 hover:border-green-300 text-sm'
								/>
								<Button
									onClick={handleSend}
									disabled={!input.trim() || isLoading}
									size='icon'
									className='w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-lg'
								>
									<Send className='h-4 w-4' />
								</Button>
							</div>
							<div className='mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200'>
								<p className='text-[10px] text-gray-600 text-center leading-relaxed'>
									<strong>Important:</strong> This AI assistant provides support
									but is not a replacement for professional mental health care.
									Please consult with a healthcare professional for proper
									evaluation and treatment.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Chat;
