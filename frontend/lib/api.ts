// API configuration for MindCare frontend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface ChatRequest {
	message: string;
	conversationHistory: Array<{
		role: "user" | "assistant";
		content: string;
	}>;
	assessmentContext?: string;
	timestamp?: string;
}

export interface ChatResponse {
	status: string;
	data: string;
}

export interface AssessmentData {
	score: number;
	level: string;
	answers: Record<string, number>;
	questions: Array<{
		id: number;
		question: string;
		answer: number;
		answerText: string;
	}>;
}

export interface AssessmentResponse {
	status: string;
	data: AssessmentData;
}

export interface InitialContextRequest {
	assessmentContext: string;
	timestamp?: string;
}

// Chat API
export const sendChatMessage = async (
	request: ChatRequest
): Promise<ChatResponse> => {
	const response = await fetch(`${API_BASE_URL}/chat/`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify(request),
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return response.json();
};

// Initial context API - get AI response based on assessment
export const getInitialContext = async (
	request: InitialContextRequest
): Promise<ChatResponse> => {
	const response = await fetch(`${API_BASE_URL}/chat/initial-context/`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify(request),
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return response.json();
};

// Assessment API
export const submitAssessment = async (
	assessmentData: AssessmentData
): Promise<AssessmentResponse> => {
	const response = await fetch(`${API_BASE_URL}/assessment/`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify(assessmentData),
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return response.json();
};

// Health check API
export const checkApiHealth = async (): Promise<boolean> => {
	try {
		const response = await fetch(`${API_BASE_URL}/`);
		return response.ok;
	} catch (error) {
		console.error("API health check failed:", error);
		return false;
	}
};
