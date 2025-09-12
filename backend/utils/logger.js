const winston = require('winston');

// Tạo logger cho Vercel environment
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    process.env.NODE_ENV === 'production' 
      ? winston.format.json()
      : winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
  ),
  defaultMeta: { 
    service: 'rag-chatbot-backend',
    environment: process.env.NODE_ENV || 'development',
    vercel: !!process.env.VERCEL
  },
  transports: [
    new winston.transports.Console()
  ]
});

// Trong Vercel, console logs sẽ được tự động capture
// Không cần file transports vì Vercel functions là stateless

module.exports = { logger };