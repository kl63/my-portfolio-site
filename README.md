# Kevin Lin's Portfolio Website

![Site Status](https://img.shields.io/badge/Site%20Status-Online-brightgreen?style=flat&logo=github)
![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0-38B2AC?style=flat&logo=tailwind-css)

A modern, responsive portfolio website showcasing my skills, projects, and professional experience. Built with Next.js, TypeScript, and Tailwind CSS, featuring an interactive AI playground and comprehensive analytics dashboard.

## 🚀 Features

### Core Portfolio
- **Responsive Design**: Mobile-first approach with beautiful animations
- **Skills & Experience**: Interactive timeline with skill proficiency indicators
- **Project Showcase**: Detailed project cards with live demos and source code links
- **Contact Form**: Integrated contact form with Zapier automation
- **Site Status Badge**: Real-time GitHub Actions deployment status

### AI Playground
- **Chat Interface**: Interactive AI chat with conversation history
- **Image Generation**: DALL-E 3 powered image creation
- **Meme Generator**: AI-powered meme creation with templates
- **Text Tools**: Summarization, explanation, and language tutoring
- **Voice Features**: Text-to-speech and voice-to-text capabilities
- **Specialized Tools**: Resume generator, story creator, math solver, and more

### Analytics Dashboard
- **Google Analytics Integration**: Real-time website analytics
- **Device Breakdown**: Visitor device and browser statistics
- **Performance Metrics**: Page views, sessions, and user engagement
- **JWT Authentication**: Secure access to analytics data

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.3.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend & APIs
- **API Routes**: Next.js API routes
- **AI Integration**: OpenAI GPT-4 & DALL-E 3
- **Analytics**: Google Analytics 4 API
- **Authentication**: JWT tokens
- **Image Processing**: Server-side proxy for CORS handling

### Development & Deployment
- **Package Manager**: npm
- **Linting**: ESLint with Next.js config
- **Type Checking**: TypeScript strict mode
- **Deployment**: GitHub Actions CI/CD
- **Hosting**: Self-hosted with PM2 and Nginx

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ 
- npm or yarn
- OpenAI API key (for AI features)
- Google Analytics service account (for analytics)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kl63/my-portfolio-site.git
   cd my-portfolio-site
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables:
   ```env
   # OpenAI API Configuration
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Google Analytics Configuration
   GOOGLE_ANALYTICS_PROPERTY_ID=your_ga4_property_id
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
   GOOGLE_PRIVATE_KEY=your_service_account_private_key
   
   # JWT Secret for Analytics Authentication
   JWT_SECRET=your_jwt_secret_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── analytics/     # Google Analytics endpoints
│   │   └── playground/    # AI playground endpoints
│   ├── contact/           # Contact page
│   ├── playground/        # AI playground pages
│   ├── projects/          # Projects showcase
│   └── skills/            # Skills & experience
├── components/            # Reusable components
│   ├── playground/        # AI playground components
│   └── ui/               # UI components
└── lib/                  # Utility functions and configurations
```

## 🎨 Key Components

### Navigation
- **Colorful Navbar**: Animated navigation with site status badge
- **Mobile-Responsive**: Collapsible mobile menu with smooth animations

### AI Playground
- **Modular Architecture**: Each AI tool is a separate component
- **Error Handling**: Comprehensive error states and fallbacks
- **Download Functionality**: Save generated content (images, text)

### Analytics Dashboard
- **Real-time Data**: Live Google Analytics integration
- **Interactive Charts**: Visual data representation
- **Device Breakdown**: Detailed visitor analytics

## 🚀 Deployment

The site uses GitHub Actions for automated deployment:

1. **Push to main branch** triggers the deployment workflow
2. **Build process** runs type checking and linting
3. **Deployment** to self-hosted server via PM2
4. **Status badge** updates automatically

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🔧 Configuration

### Google Analytics Setup
1. Create a Google Cloud service account
2. Enable Google Analytics Admin API
3. Add service account to GA4 property
4. Configure environment variables

### OpenAI Integration
1. Get API key from OpenAI platform
2. Add to environment variables
3. Configure rate limits and error handling

## 📱 Mobile Responsiveness

- **Breakpoints**: Mobile-first responsive design
- **Touch Optimization**: Proper touch targets and gestures
- **Performance**: Optimized images and lazy loading
- **Accessibility**: ARIA labels and keyboard navigation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Email**: lin.kevin.1923@gmail.com
- **LinkedIn**: [linkedin.com/in/linkevin19](https://linkedin.com/in/linkevin19)
- **GitHub**: [github.com/kl63](https://github.com/kl63)
- **Location**: Newark, NJ

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Vercel** for deployment platform
- **OpenAI** for AI capabilities
- **shadcn/ui** for beautiful components
- **Tailwind CSS** for styling system
