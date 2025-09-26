// Test FAQ matching
const { normalize } = require('./chatbot/router.ts');
const { faqMatchOrNull } = require('./chatbot/data/faq.ts');

const testQuestion = "Câu lạc bộ có những hoạt động gì?";
console.log("Testing FAQ matching:");
console.log("Question:", testQuestion);
console.log("Normalized:", normalize(testQuestion));
console.log("Expected key:", "cau lac bo co nhung hoat dong gi");
console.log("Match:", normalize(testQuestion) === "cau lac bo co nhung hoat dong gi");

const result = faqMatchOrNull(testQuestion);
console.log("FAQ Result:", result ? "Found" : "Not found");
if (result) {
  console.log("Content preview:", result.substring(0, 100) + "...");
}
