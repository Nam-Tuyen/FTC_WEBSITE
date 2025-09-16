// Thin re-export wrapper so app code can import '@/lib/rag-system'
// and reuse the RAG implementation that lives under configuration_chatbot/lib
import { ragSystem } from "../configuration_chatbot/lib/rag-system";

export { ragSystem };

export type { KnowledgeItem, RAGContext } from "../configuration_chatbot/lib/rag-system";
