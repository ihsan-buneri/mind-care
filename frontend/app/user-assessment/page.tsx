"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { submitAssessment, getInitialContext } from "@/lib/api";

// PHQ-9 inspired questions
const assessmentQuestions = [
	{
		id: 1,
		question:
			"Over the last 2 weeks, how often have you been bothered by little interest or pleasure in doing things?",
		options: [
			{ text: "Not at all", score: 0 },
			{ text: "Several days", score: 1 },
			{ text: "More than half the days", score: 2 },
			{ text: "Nearly every day", score: 3 },
		],
	},
	{
		id: 2,
		question:
			"Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?",
		options: [
			{ text: "Not at all", score: 0 },
			{ text: "Several days", score: 1 },
			{ text: "More than half the days", score: 2 },
			{ text: "Nearly every day", score: 3 },
		],
	},
	{
		id: 3,
		question:
			"Over the last 2 weeks, how often have you been bothered by trouble falling or staying asleep, or sleeping too much?",
		options: [
			{ text: "Not at all", score: 0 },
			{ text: "Several days", score: 1 },
			{ text: "More than half the days", score: 2 },
			{ text: "Nearly every day", score: 3 },
		],
	},
	{
		id: 4,
		question:
			"Over the last 2 weeks, how often have you been bothered by feeling tired or having little energy?",
		options: [
			{ text: "Not at all", score: 0 },
			{ text: "Several days", score: 1 },
			{ text: "More than half the days", score: 2 },
			{ text: "Nearly every day", score: 3 },
		],
	},
	{
		id: 5,
		question:
			"Over the last 2 weeks, how often have you been bothered by poor appetite or overeating?",
		options: [
			{ text: "Not at all", score: 0 },
			{ text: "Several days", score: 1 },
			{ text: "More than half the days", score: 2 },
			{ text: "Nearly every day", score: 3 },
		],
	},
];

const Assessment = () => {
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [answers, setAnswers] = useState<Record<number, number>>({});
	const router = useRouter();

	const handleAnswer = (score: number) => {
		setAnswers((prev) => ({
			...prev,
			[assessmentQuestions[currentQuestion].id]: score,
		}));
	};

	const nextQuestion = async () => {
		if (currentQuestion < assessmentQuestions.length - 1) {
			setCurrentQuestion((prev) => prev + 1);
		} else {
			// On last question, prepare data and submit to API
			const score = calculateScore();
			const level = getResultLevel(score);

			// Prepare assessment data for API
			const assessmentData = {
				score: score,
				level: level,
				answers: answers,
				questions: assessmentQuestions.map((q) => ({
					id: q.id,
					question: q.question,
					answer: answers[q.id] || 0,
					answerText:
						q.options.find((opt) => opt.score === (answers[q.id] || 0))?.text ||
						"Not answered",
				})),
			};

			try {
				// Submit assessment to API
				await submitAssessment(assessmentData);

				// Prepare assessment context for initial AI response
				const assessmentContext = `
Assessment Context:
- Score: ${assessmentData.score}/15
- Level: ${assessmentData.level}
- Questions and Answers:
${assessmentData.questions
	.map((q: any) => `  Q${q.id}: ${q.question} - Answer: ${q.answerText}`)
	.join("\n")}
				`.trim();

				// Get initial AI response based on assessment
				const initialResponse = await getInitialContext({
					assessmentContext: assessmentContext,
					timestamp: new Date().toISOString(),
				});

				// Store assessment data and initial response locally
				localStorage.setItem("assessmentData", JSON.stringify(assessmentData));
				localStorage.setItem("initialAIResponse", initialResponse.data);
				localStorage.setItem("showInitialSuggestion", "true");
				router.push("/chat");
			} catch (error) {
				console.error(
					"Error submitting assessment or getting initial response:",
					error
				);
				// Fallback: still store locally and navigate
				localStorage.setItem("assessmentData", JSON.stringify(assessmentData));
				localStorage.setItem("showInitialSuggestion", "true");
				router.push("/chat");
			}
		}
	};

	const prevQuestion = () => {
		if (currentQuestion > 0) {
			setCurrentQuestion((prev) => prev - 1);
		}
	};

	const calculateScore = () => {
		return Object.values(answers).reduce((sum, score) => sum + score, 0);
	};

	const getResultLevel = (score: number) => {
		if (score <= 4) return "Minimal";
		else if (score <= 9) return "Mild";
		else if (score <= 14) return "Moderate";
		else return "Severe";
	};

	const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100;
	const currentAnswer = answers[assessmentQuestions[currentQuestion]?.id];

	return (
		<div className='min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4'>
			<div className='w-full max-w-4xl h-[90vh]'>
				<div className='h-full flex flex-col bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-1000'>
					<div className='p-4 border-b border-gray-100 flex justify-center'>
						<div className='text-center'>
							<Link href='/'>
								<div className='flex items-center space-x-2 justify-center mb-2'>
									<div className='w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center'>
										<Heart className='w-5 h-5 text-white' />
									</div>
									<span className='text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent'>
										MindCare
									</span>
								</div>
							</Link>
							<h2 className='text-lg font-bold text-gray-900 mb-1'>
								Question {currentQuestion + 1} of {assessmentQuestions.length}
							</h2>
							<span className='text-xs text-gray-500 font-medium'>
								{Math.round(progress)}% Complete
							</span>
						</div>
					</div>
					<div className='px-4 pb-4'>
						<div className='w-full bg-gray-200 rounded-full h-2 overflow-hidden'>
							<div
								className='bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500 ease-out'
								style={{ width: `${progress}%` }}
							></div>
						</div>
					</div>

					<div className='flex-1 p-6 space-y-6 overflow-y-auto'>
						<div className='space-y-4'>
							<h3 className='text-lg font-medium leading-relaxed text-gray-800'>
								{assessmentQuestions[currentQuestion].question}
							</h3>

							<div className='space-y-3'>
								{assessmentQuestions[currentQuestion].options.map(
									(option, index) => (
										<Button
											key={index}
											variant={
												currentAnswer === option.score ? "default" : "outline"
											}
											className={`w-full justify-start text-left h-auto py-4 px-4 text-sm transition-all duration-300 ${
												currentAnswer === option.score
													? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
													: "hover:bg-gray-50 border-2 hover:border-green-200"
											}`}
											onClick={() => handleAnswer(option.score)}
										>
											{option.text}
										</Button>
									)
								)}
							</div>
						</div>

						<div className='flex justify-between pt-4'>
							<Button
								variant='outline'
								onClick={prevQuestion}
								disabled={currentQuestion === 0}
								className='flex items-center space-x-2 px-4 py-2 border-2 hover:bg-gray-50 transition-all duration-300 text-sm'
							>
								<ChevronLeft className='h-4 w-4' />
								<span>Previous</span>
							</Button>

							<Button
								onClick={nextQuestion}
								disabled={currentAnswer === undefined}
								className='flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm'
							>
								<span>
									{currentQuestion === assessmentQuestions.length - 1
										? "Start Chatting"
										: "Next"}
								</span>
								<ChevronRight className='h-4 w-4' />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Assessment;
