import { QuestionItem } from "@/app/dien-dan/types";

const BASE = "https://script.google.com/macros/s/AKfycbxKMdhgW0iXHcK-xfFy1hYDDhSeEubUfmWrZNX5Gracck1S1jRVG1qjLSWkq69mX8hpUw/exec";

export const createQuestion = async (question: QuestionItem) => {
    try {
        console.log("Question submitted:", question);

        const body = {
            function: 'createQuestion',
            body: question,
        }

        return await baseApi(body)
    } catch (error) {
        console.error('Submit error:', error);
        alert("Có lỗi xảy ra khi đăng câu hỏi. Vui lòng thử lại.");
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
        console.log('Response:', response);
        console.log('Response status: 200');
        console.log('Response headers: Headers');
        console.log('Result:', response);
        
        if (response && response.data && Array.isArray(response.data)) {
            console.log('questions Array(' + response.data.length + ')');
            return response.data as QuestionItem[]
        } else {
            console.log('questions Array(0)');
            return []
        }
    } catch (error) {
        console.error('Fetch error:', error);
        console.log('questions Array(0)');
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
        console.log('Response headers:', response.headers);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Result:', result);

        return result
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}