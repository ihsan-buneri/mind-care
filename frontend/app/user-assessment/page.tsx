"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

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
	const [showResults, setShowResults] = useState(false);
	const router = useRouter();

	const handleAnswer = (score: number) => {
		setAnswers((prev) => ({
			...prev,
			[assessmentQuestions[currentQuestion].id]: score,
		}));
	};

	const nextQuestion = () => {
		if (currentQuestion < assessmentQuestions.length - 1) {
			setCurrentQuestion((prev) => prev + 1);
		} else {
			setShowResults(true);
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

	const getResultMessage = (score: number) => {
		if (score <= 4) {
			return {
				level: "Minimal",
				message:
					"You're showing minimal signs of depression. Keep taking care of your mental health!",
				color: "text-green-600",
			};
		} else if (score <= 9) {
			return {
				level: "Mild",
				message:
					"You may be experiencing mild depression symptoms. Consider speaking with a healthcare professional.",
				color: "text-yellow-600",
			};
		} else if (score <= 14) {
			return {
				level: "Moderate",
				message:
					"You may be experiencing moderate depression symptoms. We recommend consulting with a mental health professional.",
				color: "text-orange-600",
			};
		} else {
			return {
				level: "Severe",
				message:
					"You may be experiencing severe depression symptoms. Please reach out to a mental health professional as soon as possible.",
				color: "text-red-600",
			};
		}
	};

	const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100;
	const currentAnswer = answers[assessmentQuestions[currentQuestion]?.id];

	if (showResults) {
		const score = calculateScore();
		const result = getResultMessage(score);

		return (
			<div className='min-h-screen bg-background'>
				<div className='container mx-auto px-4 py-8'>
					<div className='max-w-2xl mx-auto bg-white rounded-lg shadow-lg border'>
						<div className='p-6 text-center border-b'>
							<h2 className='text-2xl font-bold'>Assessment Results</h2>
						</div>
						<div className='p-6 text-center space-y-6'>
							<div className='bg-gray-50 rounded-lg p-6'>
								<div className='text-4xl font-bold text-blue-600 mb-2'>
									{score}/15
								</div>
								<div className={`text-xl font-semibold ${result.color} mb-2`}>
									{result.level} Depression Symptoms
								</div>
								<p className='text-gray-600'>{result.message}</p>
							</div>

							<div className='flex flex-col sm:flex-row gap-4 justify-center'>
								<Button
									onClick={() => {
										// Store assessment data in localStorage for the chat page
										localStorage.setItem("assessmentScore", score.toString());
										localStorage.setItem("assessmentLevel", result.level);
										localStorage.setItem("showInitialSuggestion", "true");
										router.push("/chat");
									}}
									className='flex items-center space-x-2'
								>
									<span>Continue to AI Assistant</span>
								</Button>
								<Button
									variant='outline'
									onClick={() => {
										setCurrentQuestion(0);
										setAnswers({});
										setShowResults(false);
									}}
								>
									Retake Assessment
								</Button>
							</div>

							<p className='text-sm text-gray-500'>
								This assessment is not a diagnosis. Please consult with a
								healthcare professional for proper evaluation and treatment.
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-background'>
			<div className='container mx-auto px-4 py-8'>
				<div className='max-w-2xl mx-auto bg-white rounded-lg shadow-lg border'>
					<div className='p-6 border-b'>
						<div className='flex items-center justify-between mb-4'>
							<h2 className='text-lg font-bold'>Mental Health Assessment</h2>
							<span className='text-sm text-gray-500'>
								{currentQuestion + 1} of {assessmentQuestions.length}
							</span>
						</div>
						<div className='w-full bg-gray-200 rounded-full h-2'>
							<div
								className='bg-blue-600 h-2 rounded-full transition-all duration-300'
								style={{ width: `${progress}%` }}
							></div>
						</div>
					</div>

					<div className='p-6 space-y-6'>
						<div className='space-y-4'>
							<h3 className='text-lg font-medium leading-relaxed'>
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
											className='w-full justify-start text-left h-auto py-4 px-6'
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
								className='flex items-center space-x-2'
							>
								<ChevronLeft className='h-4 w-4' />
								<span>Previous</span>
							</Button>

							<Button
								onClick={nextQuestion}
								disabled={currentAnswer === undefined}
								className='flex items-center space-x-2'
							>
								<span>
									{currentQuestion === assessmentQuestions.length - 1
										? "View Results"
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
