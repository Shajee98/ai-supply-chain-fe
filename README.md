# AI Supply Chain Management Frontend

A modern, responsive frontend for the AI-Driven Supply Chain Management System built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🚀 Built with Next.js 14 (App Router) and TypeScript
- 🎨 Styled with Tailwind CSS and ShadcnUI components
- 📊 Interactive charts with Recharts
- 🔒 JWT-based authentication with secure HTTP-only cookies
- 🎯 Role-based access control
- 🔄 Real-time updates with WebSocket
- 📱 Fully responsive design
- 🌙 Dark mode support
- 🎭 Form validation with React Hook Form and Zod
- 🔍 State management with Zustand
- 📡 API integration with Axios and React Query

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-supply-chain-fe.git
   cd ai-supply-chain-fe
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   └── (dashboard)/       # Dashboard pages
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   ├── ui/               # UI components
│   └── common/           # Common components
├── lib/                  # Utility functions and configurations
│   ├── api/             # API services
│   ├── hooks/           # Custom hooks
│   ├── store/           # Zustand store
│   └── utils/           # Helper functions
├── types/               # TypeScript type definitions
└── styles/             # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
