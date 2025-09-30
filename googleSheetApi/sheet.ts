import { QuestionItem } from "@/app/dien-dan/types";

const BASE = "https://script.google.com/macros/s/AKfycbyCfakaiFBnEQT0DYiyfjTJYxSO0_yZa0MzrsqjbodAI7Ay9i3OtF2zYpXdWibIX6P_Yw/exec";

// Category mapping từ frontend sang AppScript
const CATEGORY_MAPPING = {
  'CLUB': 'Hỏi về câu lạc bộ',
  'MAJOR': 'Hỏi về ngành học', 
  'DISCUSSION': 'Thảo luận'
} as const;

export const createQuestion = async (question: QuestionItem) => {
    try {
        console.log("Question submitted:", question);

        // Map category to AppScript format
        const mappedCategory = CATEGORY_MAPPING[question.category as keyof typeof CATEGORY_MAPPING] || 'Thảo luận';
        
        const payload = {
            title: question.title,
            category: mappedCategory,
            user: question.studentId || 'K000000000', // Default MSSV if not provided
            content: question.content,
            anonymous: !question.studentId // Anonymous if no studentId
        };

        const body = {
            function: 'createQuestion',
            body: payload,
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
        
        // Check if response has data property with items
        if (response && response.data && response.data.items) {
            // Map AppScript response to frontend format
            const mappedQuestions = response.data.items.map((item: any) => ({
                id: item.id,
                title: item.title,
                content: item.content,
                category: mapCategoryFromAppScript(item.category),
                studentId: item.user === 'anonymous' ? undefined : item.user,
                userId: item.user === 'anonymous' ? 'anonymous' : item.user,
                createdAt: new Date(item.createdAt).getTime(),
                likes: item.like_count || 0,
                replies: item.responses || [],
                repliesCount: item.responses ? item.responses.length : 0
            }));
            
            return mappedQuestions;
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

// Helper function to map AppScript categories back to frontend
function mapCategoryFromAppScript(appScriptCategory: string): string {
    const reverseMapping: { [key: string]: string } = {
        'Hỏi về câu lạc bộ': 'CLUB',
        'Hỏi về ngành học': 'MAJOR',
        'Thảo luận': 'DISCUSSION'
    };
    return reverseMapping[appScriptCategory] || 'DISCUSSION';
}

// Toggle like for a question
export const toggleLike = async (questionId: string, mssv: string, like: boolean) => {
    try {
        console.log("Toggle like:", { questionId, mssv, like });

        const payload = {
            questionId: questionId,
            mssv: mssv,
            like: like ? 1 : 0
        };

        const body = {
            function: 'toggleLike',
            body: payload,
        }

        const response = await baseApi(body)
        console.log('Toggle like successfully:', response)
        return response
    } catch (error) {
        console.error('Toggle like error:', error);
        throw error;
    }
}

// Create response to a question
export const createResponse = async (questionId: string, content: string, mssv: string, anonymous: boolean = false) => {
    try {
        console.log("Create response:", { questionId, content, mssv, anonymous });

        const payload = {
            user: mssv,
            anonymous: anonymous,
            content: content,
            questionId: questionId
        };

        const body = {
            function: 'createResponse',
            body: payload,
        }

        const response = await baseApi(body)
        console.log('Create response successfully:', response)
        return response
    } catch (error) {
        console.error('Create response error:', error);
        throw error;
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