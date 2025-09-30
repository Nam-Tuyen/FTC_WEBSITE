import { QuestionItem } from "@/app/dien-dan/types";

const BASE = "https://script.google.com/macros/s/AKfycbyCfakaiFBnEQT0DYiyfjTJYxSO0_yZa0MzrsqjbodAI7Ay9i3OtF2zYpXdWibIX6P_Yw/exec";

// Map categories to match Apps Script format
const mapCategoryToAppScript = (category: string) => {
  const categoryMap: { [key: string]: string } = {
    'CLUB': 'Hỏi về câu lạc bộ',
    'MAJOR': 'Hỏi về ngành học', 
    'DISCUSSION': 'Thảo luận'
  };
  return categoryMap[category] || 'Thảo luận';
};

// Map categories from Apps Script to local format
const mapCategoryFromAppScript = (category: string) => {
  const categoryMap: { [key: string]: string } = {
    'Hỏi về câu lạc bộ': 'CLUB',
    'Hỏi về ngành học': 'MAJOR',
    'Thảo luận': 'DISCUSSION'
  };
  return categoryMap[category] || 'DISCUSSION';
};

export const createQuestion = async (question: QuestionItem) => {
    try {
        console.log("Question submitted:", question);

        // Transform data to match Apps Script format
        const appScriptData = {
            title: question.title,
            category: mapCategoryToAppScript(question.category),
            user: question.studentId || 'K000000000', // Default MSSV if not provided
            content: question.content,
            anonymous: !question.studentId // Anonymous if no studentId
        };

        const body = {
            function: 'createQuestion',
            body: appScriptData,
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

        // Transform queries to match Apps Script format
        const appScriptQueries = {
            take: queries.take || null,
            category: queries.category ? mapCategoryToAppScript(queries.category) : '',
            search: queries.search || '',
            includeDeleted: false
        };

        const body = {
            function: 'fetchQuestions',
            body: appScriptQueries,
        }

        const response = await baseApi(body)
        
        // Check if response has data property with items
        if (response && response.data && response.data.items) {
            // Transform data back to local format
            const transformedQuestions = response.data.items.map((item: any) => ({
                id: item.id,
                title: item.title,
                content: item.content,
                category: mapCategoryFromAppScript(item.category),
                studentId: item.user === 'anonymous' ? undefined : item.user,
                createdAt: new Date(item.createdAt).getTime(),
                likes: item.like_count || 0,
                replies: item.responses || [],
                repliesCount: (item.responses || []).length
            }));
            
            return transformedQuestions;
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

export const createResponse = async (responseData: {
    questionId: string;
    content: string;
    studentId?: string;
    anonymous?: boolean;
}) => {
    try {
        console.log("Response submitted:", responseData);

        const appScriptData = {
            user: responseData.studentId || 'K000000000',
            anonymous: responseData.anonymous || !responseData.studentId,
            content: responseData.content,
            questionId: responseData.questionId
        };

        const body = {
            function: 'createResponse',
            body: appScriptData,
        }

        const response = await baseApi(body)
        console.log('Response created successfully:', response)
        return response
    } catch (error) {
        console.error('Create response error:', error);
        throw error;
    }
}

export const toggleLike = async (questionId: string, studentId: string, like: boolean) => {
    try {
        console.log("Toggle like:", { questionId, studentId, like });

        const appScriptData = {
            questionId: questionId,
            mssv: studentId || 'K000000000',
            like: like ? 1 : 0
        };

        const body = {
            function: 'toggleLike',
            body: appScriptData,
        }

        const response = await baseApi(body)
        console.log('Like toggled successfully:', response)
        return response
    } catch (error) {
        console.error('Toggle like error:', error);
        throw error;
    }
}

export const deleteQuestion = async (questionId: string, studentId: string) => {
    try {
        console.log("Delete question:", { questionId, studentId });

        const appScriptData = {
            questionId: questionId,
            mssv: studentId
        };

        const body = {
            function: 'deleteQuestion',
            body: appScriptData,
        }

        const response = await baseApi(body)
        console.log('Question deleted successfully:', response)
        return response
    } catch (error) {
        console.error('Delete question error:', error);
        throw error;
    }
}

export const deleteResponse = async (responseId: string, studentId: string) => {
    try {
        console.log("Delete response:", { responseId, studentId });

        const appScriptData = {
            responseId: responseId,
            mssv: studentId
        };

        const body = {
            function: 'deleteResponse',
            body: appScriptData,
        }

        const response = await baseApi(body)
        console.log('Response deleted successfully:', response)
        return response
    } catch (error) {
        console.error('Delete response error:', error);
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