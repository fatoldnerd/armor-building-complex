## 🏋️ About the Armor Building Complex

The Armor Building Complex is a minimalist yet highly effective strength training program developed by renowned strength coach Dan John. The program consists of a simple but powerful sequence:

- **2 Kettlebell Cleans**
- **1 Military Press** 
- **3 Front Squats**

This simple sequence, performed for multiple rounds, builds functional strength, endurance, and mental toughness — hence the name "Armor Building." It's designed to build the kind of muscle that protects, supports, and endures.

## ✨ Features

- **🎨 Modern Glass-Morphism UI** - Beautiful, responsive design with backdrop blur effects
- **🔐 Google Authentication** - Secure login with Firebase Auth
- **📊 Progress Tracking** - Visual analytics with charts and statistics  
- **⏱️ Session Management** - Plan and log complete workout sessions
- **📈 Workout History** - Review past performance and track improvements
- **📱 Responsive Design** - Optimized for both desktop and mobile devices
- **⏰ Real-Time Timer** - Built-in workout timer with round tracking
- **📲 Progressive Web App** - Install on your device for native app experience

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Firebase project with Authentication and Hosting enabled

### Installation

1. **Clone and install**
   ```bash
   git clone <repository-url>
   cd armor-builder
   npm install
   ```

2. **Configure Firebase**
   Create a `.env` file with your Firebase config:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. **Start developing**
   ```bash
   npm run dev
   ```

> 📚 For detailed setup and deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🎯 How It Works

### The Workout Flow
1. **🔑 Sign In** - Use Google authentication to create your account
2. **📋 Plan Session** - Set your target rounds (typically 3-10) and rest periods
3. **💪 Execute Complex** - Follow the guided sequence with built-in timer
4. **📊 Track Progress** - View performance analytics and workout history

### App Navigation
- **🏠 Dashboard** - Overview of recent workouts and statistics
- **⚙️ Session Setup** - Plan your next workout session  
- **🏋️ Workout** - Active workout interface with timer
- **📜 History** - Review past sessions and track progress
- **⚙️ Settings** - Account management and preferences

## 🛠️ Tech Stack

- **Frontend**: React 19.1.0 with React Router DOM 7.6.3
- **Build Tool**: Vite 7.0.0 for lightning-fast development
- **Authentication**: Firebase 11.10.0 with Google Auth
- **Charts**: Recharts 3.0.2 for data visualization
- **Styling**: Modern CSS with CSS Variables and Glass-morphism effects
- **Typography**: Inter font family for clean, modern text
- **Storage**: Browser localStorage for workout persistence

## 📁 Project Structure

```
armor-builder/
├── public/
│   ├── kettlebell.svg          # Custom app icon
│   └── manifest.json           # PWA configuration
├── src/
│   ├── components/
│   │   └── Layout.jsx          # Main app layout with navigation
│   ├── contexts/
│   │   └── AuthContext.jsx     # Firebase authentication context
│   ├── pages/
│   │   ├── Dashboard.jsx       # Main dashboard with analytics
│   │   ├── LandingPage.jsx     # Landing page with authentication
│   │   ├── SessionHistory.jsx  # Workout history and statistics
│   │   ├── SessionSetup.jsx    # Workout planning interface
│   │   ├── Settings.jsx        # User settings and preferences
│   │   └── WorkoutLogging.jsx  # Active workout interface
│   ├── services/
│   │   └── firebase.js         # Firebase configuration
│   └── styles/
│       └── App.css            # Main stylesheet with design system
├── DEPLOYMENT.md              # Detailed deployment guide
└── README.md                  # This file
```

## 🎨 Design System

The app features a modern glass-morphism design with:

- **🎨 Color Palette**: Deep slate background with indigo/purple gradients
- **✍️ Typography**: Inter font family with consistent scale
- **🌟 Glass Effects**: Backdrop blur with translucent backgrounds  
- **🌊 Shadows**: Multi-layered shadow system for depth
- **⚡ Animations**: Smooth cubic-bezier transitions
- **📱 Responsive**: Mobile-first approach with desktop enhancements

## 🔧 Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production  
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Code Style
- Modern functional React components with hooks
- CSS Variables for consistent theming
- Mobile-first responsive design
- Semantic HTML and accessibility considerations

## 🚀 Deployment

The app is configured for Firebase Hosting with automatic builds. See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions including:

- Firebase project setup
- Environment configuration
- Security rules
- Custom domain setup
- Monitoring and analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📚 Learn More

- **[Dan John University](https://danjohnuniversity.com/)** - Learn about Dan John's training philosophy
- **[Firebase Documentation](https://firebase.google.com/docs)** - Backend services and deployment
- **[React Documentation](https://react.dev)** - Frontend framework
- **[Vite Documentation](https://vitejs.dev)** - Build tool and development server

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Dan John** - Creator of the Armor Building Complex methodology
- **Firebase** - Authentication and hosting platform  
- **React Team** - Amazing frontend framework
- **Vite** - Lightning-fast build tool

---

**Start building your armor today! 💪🛡️**
