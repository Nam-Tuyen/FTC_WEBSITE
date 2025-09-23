# FTC Chatbot

Modern AI-powered chatbot for FTC (FinTech Club) with organized architecture and beautiful design.

## 🏗️ Architecture Overview

This chatbot is built with a clean, modular architecture for maintainability and scalability:

```
chatbot/
├── components/              # React components
│   ├── ui/                 # Reusable UI components
│   │   ├── MessageBubble.tsx
│   │   ├── ChatInput.tsx
│   │   └── ModeSelector.tsx
│   ├── layout/             # Layout components
│   │   └── ChatContainer.tsx
│   ├── features/           # Feature-specific components
│   │   ├── SuggestedQuestions.tsx
│   │   └── FeaturesShowcase.tsx
│   └── index.ts           # Centralized exports
├── hooks/                  # Custom React hooks
│   ├── useChat.ts         # Main chat functionality
│   ├── useChatScroll.ts   # Scroll behavior
│   └── index.ts
├── lib/                    # Utilities and helpers
│   └── utils/
│       ├── formatters.ts   # Data formatting
│       ├── dom.ts         # DOM utilities
│       ├── classNames.ts  # CSS class utilities
│       └── index.ts
├── types/                  # TypeScript definitions
│   ├── chat.ts            # Chat-related types
│   ├── jsx.d.ts          # JSX element definitions
│   └── index.ts
├── constants/              # Constants and configurations
│   ├── brand.ts           # Brand color system
│   ├── config.ts          # App configuration
│   └── index.ts
├── page.tsx               # Main page component (current)
├── ChatbotPage.tsx        # New organized page component
└── README.md              # This documentation
```

## 🎨 Brand System

The chatbot uses a sophisticated color system based on:
- **Primary**: `#003663` (Deep Navy Blue)
- **Secondary**: `#0e1117` (Dark Blue-Black)

### Key Features:
- **10 tonal variations** (primary50 → primary900)
- **6 gradient types** for different use cases
- **Organized surfaces** (glass, card, interactive)
- **Consistent shadows** with brand colors
- **Interactive states** (hover, focus, active)

## 🔧 Key Components

### UI Components

#### `MessageBubble`
Displays individual chat messages with:
- User/assistant role styling
- Typing indicators
- Action buttons (like, copy, share)
- Timestamp formatting

#### `ChatInput`
Input component with:
- Send button with loading states
- Keyboard shortcuts (Enter to send)
- Mode-specific placeholders
- Disabled state handling

#### `ModeSelector`
Mode switching component with:
- Visual mode indicators
- Smooth transitions
- Notification feedback

### Layout Components

#### `ChatContainer`
Main chat layout with:
- Responsive height handling
- Glassmorphism design
- Proper scroll behavior

#### `ChatHeader`
Chat header with:
- Bot avatar and title
- Online status indicator
- Professional styling

### Feature Components

#### `SuggestedQuestions`
Interactive question suggestions:
- Expandable list
- Click-to-send functionality
- Smooth animations

#### `FeaturesShowcase`
Feature highlights sidebar:
- Key feature descriptions
- Usage statistics
- Modern card design

## 🪝 Custom Hooks

### `useChat`
Main chat functionality:
```typescript
const {
  messages,
  selectedMode,
  inputValue,
  isSending,
  handleSendMessage,
  handleModeChange,
  clearChat
} = useChat()
```

### `useChatScroll`
Automatic scroll to bottom:
```typescript
const messagesEndRef = useChatScroll(messages)
```

## 🛠️ Utilities

### Formatters
- `formatTime()` - Vietnamese time formatting
- `formatMessageContent()` - HTML conversion
- `generateMessageId()` - Unique ID generation

### DOM Utilities
- `copyToClipboard()` - Clipboard operations
- `debounce()` / `throttle()` - Performance optimization
- `scrollToElement()` - Smooth scrolling

### Class Name Utilities
- `cn()` - Conditional class combination
- `responsive()` - Responsive class generation
- `stateClasses()` - Interactive state classes

## 📝 TypeScript Types

### Core Types
```typescript
type ChatMode = "club" | "industry"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  mode?: ChatMode
  ts?: number
  // ... more properties
}
```

## 🚀 Usage

### Basic Implementation
```tsx
import { ChatbotPage } from './chatbot/ChatbotPage'

export default function Page() {
  return <ChatbotPage />
}
```

### Custom Hook Usage
```tsx
import { useChat } from './chatbot/hooks'
import { MessageBubble, ChatInput } from './chatbot/components'

function CustomChat() {
  const { messages, handleSendMessage } = useChat()
  
  return (
    <div>
      {messages.map(msg => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      <ChatInput onSend={handleSendMessage} />
    </div>
  )
}
```

## 🎯 Configuration

### Environment Variables
```typescript
// Required environment variables
NEXT_PUBLIC_FTC_WEBSITE=https://ftc-website.com
NEXT_PUBLIC_BACKEND_URL=https://api.ftc.com
```

### Chat Modes
- **Club Mode**: FTC-specific Q&A with FAQ priority
- **Industry Mode**: FinTech knowledge with Google search integration

### Suggested Questions
Predefined questions for quick interaction:
- Club activities and participation
- Application requirements
- Organization structure
- Achievements and milestones

## 🔄 Migration Guide

If you're migrating from the old structure:

1. **Replace page.tsx imports**:
   ```tsx
   // Old
   import { SomeComponent } from './_components/some-component'
   
   // New
   import { SomeComponent } from './components'
   ```

2. **Use new hooks**:
   ```tsx
   // Old
   import { useChat } from './_lib/use-chat'
   
   // New
   import { useChat } from './hooks'
   ```

3. **Update constants**:
   ```tsx
   // Old
   const BRAND_COLOR = "#003663"
   
   // New
   import { BRAND } from './constants'
   ```

## 🧹 Cleanup Tasks

The following old files can be safely removed after migration:
- `_components/` directory
- `_hooks/` directory
- `_lib/` directory
- `modern-chatbot.tsx`
- `color-palette-demo.tsx`
- `components.d.ts`

## 🐛 Troubleshooting

### TypeScript Errors
- Ensure `jsx.d.ts` is included in your project
- Check that all exports are properly typed

### Styling Issues
- Verify Tailwind CSS classes are available
- Check that brand constants are imported correctly

### Hook Dependencies
- Ensure React 18+ for proper hook behavior
- Verify all peer dependencies are installed

## 📈 Performance Optimizations

- **Code Splitting**: Components are lazy-loaded where appropriate
- **Memoization**: Expensive calculations are memoized
- **Debounced Inputs**: Input handling is debounced
- **Optimized Renders**: Proper dependency arrays in hooks

## 🤝 Contributing

When adding new features:
1. Follow the established folder structure
2. Create proper TypeScript interfaces
3. Use the brand color system
4. Write clear documentation
5. Add proper error handling

## 📄 License

This project is part of the FTC website and follows the same licensing terms.
