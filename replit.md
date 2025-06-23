# Dating Classmate Application

## Overview

This is a Japanese-style dating simulation web application where users can interact with AI-powered virtual characters through chat interfaces. The application features character selection, conversation management, affection tracking, and game state persistence.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API with JSON responses
- **Middleware**: Express middleware for logging, JSON parsing, and error handling

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (configured via Neon serverless)
- **Migrations**: Drizzle Kit for schema management
- **Schema**: Defined in shared directory for type safety across frontend/backend

## Key Components

### Database Schema
- **Characters Table**: Stores character profiles, personalities, images, affection levels, traits, and predefined responses
- **Conversations Table**: Manages chat history between users and characters with message arrays
- **Game States Table**: Handles save/load functionality for user progress

### Storage Layer
- **Interface**: IStorage interface defining CRUD operations
- **Implementation**: MemStorage class for in-memory development storage
- **Operations**: Character management, conversation handling, game state persistence

### Frontend Pages
- **Character Selection**: Grid layout displaying available characters with affection levels
- **Chat Interface**: Real-time messaging interface with character-specific responses
- **Settings/Save-Load**: Modal-based game configuration and state management

### UI Components
- **Character Cards**: Display character information, personality traits, and affection hearts
- **Chat Messages**: Styled message bubbles with timestamps and character avatars
- **Modals**: Settings configuration and save/load game state functionality

## Data Flow

1. **Character Selection**: User selects character → navigates to chat interface
2. **Message Flow**: User sends message → categorized by content → character generates response → affection updated → conversation saved
3. **Response Generation**: Based on character personality, message category, and current affection level
4. **State Persistence**: Game progress automatically saved and can be manually managed through save/load system

## External Dependencies

### Core Framework Dependencies
- React ecosystem (React, React DOM, React Query)
- Express.js for server framework
- Drizzle ORM with Neon PostgreSQL adapter

### UI/UX Dependencies
- Radix UI primitives for accessible components
- Tailwind CSS for styling
- Lucide React for icons
- shadcn/ui component library

### Development Dependencies
- Vite for build tooling and development server
- TypeScript for type safety
- ESBuild for server-side bundling

## Deployment Strategy

### Development Environment
- **Command**: `npm run dev`
- **Server**: Express server with Vite middleware for HMR
- **Database**: Development PostgreSQL instance
- **Port**: 5000 (configured in .replit)

### Production Build
- **Build Process**: 
  1. Vite builds frontend to `dist/public`
  2. ESBuild bundles server to `dist/index.js`
- **Deployment**: Replit autoscale deployment target
- **Environment**: NODE_ENV=production with optimized builds

### Database Management
- **Push Schema**: `npm run db:push` applies schema changes
- **Migrations**: Stored in `/migrations` directory
- **Configuration**: Drizzle config points to shared schema file

## Changelog

```
Changelog:
- June 20, 2025. Initial setup
- June 20, 2025. Updated all character affection levels to maximum (100)
- June 20, 2025. Enhanced character responses to express maximum love for player
- June 20, 2025. Changed "コンパニオン" to "クラスメイト" throughout application
- June 20, 2025. Added heart symbols (❤) to all character responses for intense passion
- June 20, 2025. Added 4 new band member characters (はるか, まり, りん, みれい)
- June 20, 2025. Removed "完全オフライン対応" text from main screen
- June 20, 2025. Updated main page descriptions to use "クラスメイト" instead of "コンパニオン"
- June 20, 2025. Added group chat feature where all 10 characters respond individually
- June 20, 2025. Expanded message variations to 8 categories with 15+ messages each (112 total messages)
- June 20, 2025. Fixed 404 navigation error from group chat to main page
- June 20, 2025. Implemented sequential message display with 200ms intervals for realistic chat experience
- June 20, 2025. Added 12 new characters (22 total): あかり, ひより, みお, かえで, ちさと, なな, りさ, あおい, まゆ, ゆい, さき, のぞみ
- June 20, 2025. Expanded group chat dialogue to 12 categories with 300+ total message variations
- June 20, 2025. Added new dialogue categories: 嫉妬・束縛系, プライベート・親密系, 将来・結婚系
- June 20, 2025. Enhanced individual character response system with diverse personality types
- June 20, 2025. Repositioned group chat button above "特別な機能" section per user request
- June 20, 2025. Fixed character image mapping for all 22 characters in group chat
- June 20, 2025. Implemented comprehensive jealousy dialogue system with 75+ jealousy expressions
- June 20, 2025. Added "激しい嫉妬・ヤンデレ系" category with possessive and obsessive dialogue
- June 20, 2025. Enhanced message categorization to detect jealousy triggers and keywords
- June 20, 2025. Added jealousy category to affection calculation system (highest increase value)
- June 23, 2025. Created comprehensive 3-hour novel mode with 6 chapters and 300+ story scenes
- June 23, 2025. Implemented branching dialogue system with character affection tracking
- June 23, 2025. Added progression system with chapter unlocking and save/load functionality
- June 23, 2025. Integrated all 22 characters into seasonal story arcs with emotional depth
- June 23, 2025. Built visual novel interface with character portraits and choice consequences
- June 23, 2025. Dramatically expanded novel content to 13+ hours with 800+ scenes and multiple story branches
- June 23, 2025. Added comprehensive summer festival arc with detailed activities, performances, and romance paths
- June 23, 2025. Implemented parallel story branches for maximum replayability and character depth
- June 23, 2025. Massively increased novel volume to 20+ hours with expanded chapter times (200-350 minutes each)
- June 23, 2025. Added extensive character development arcs with 1000+ total scenes across all chapters
- June 23, 2025. Implemented comprehensive seasonal storylines with multiple activity branches and choices
- June 23, 2025. Removed descriptive text "感動的な恋愛ストーリー" and "(3時間の物語)" from main page per user request
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```