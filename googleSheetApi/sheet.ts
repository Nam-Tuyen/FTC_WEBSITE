import { QuestionItem } from "@/app/dien-dan/types";

const BASE = "https://script.google.com/macros/s/AKfycbxKMdhgW0iXHcK-xfFy1hYDDhSeEubUfmWrZNX5Gracck1S1jRVG1qjLSWkq69mX8hpUw/exec";

export const createQuestion = async (question: QuestionItem) => {
    try {
        console.log("Question submitted:", question);

        const body = {
            function: 'createQuestion',
            body: question,
        }

        const response = await baseApi(body)
        console.log('Question created successfully:', response)
        return response
    } catch (error) {
        console.error('Create question error:', error);
        throw error; // Re-throw to let the component handle it
    }
}

export const fetchQuestions = async (queries: any): Promise<QuestionItem[]> => {
    try {
        console.log("fetchQuestions -> queries:", queries);

        const body = {
            function: 'fetchQuestions',
            body: queries,
        }

        const response = await baseApi(body)
        
        // Check if response has data property
        if (response && response.data) {
            return response.data as QuestionItem[]
        }
        
        // If no data property, return empty array
        console.log('No data in response:', response)
        return []
    } catch (error) {
        console.error('Fetch questions error:', error);
        // Don't show alert for fetch errors, just return empty array
        return []
    }
}

const baseApi = async (body: any) => {
    try {
        const response = await fetch(BASE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        console.log('Response:', response);
        console.log('Response status:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json();
        console.log('Result:', result);

        return result
    } catch (error) {
        console.error('Base API error:', error);
        throw error;
    }
}