# Armor Builder - Deployment Guide

This guide provides step-by-step instructions for deploying the Armor Builder app to Firebase Hosting.

## Prerequisites

1. **Node.js** (v16 or higher)
2. **Firebase CLI** installed globally: `npm install -g firebase-tools`
3. **Google Firebase Account**

## Firebase Project Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `armor-builder` (or your preferred name)
4. Enable Google Analytics (optional but recommended)
5. Click "Create project"

### 2. Enable Required Services

**Authentication:**
1. Go to Authentication → Sign-in method
2. Enable "Google" provider
3. Add your domain to authorized domains (for production)

**Firestore Database:**
1. Go to Firestore Database
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a region close to your users

**Hosting:**
1. Go to Hosting
2. Click "Get started"
3. Follow the setup instructions

### 3. Get Firebase Configuration

1. Go to Project settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" → Web app
4. Register app with name "Armor Builder"
5. Copy the Firebase configuration object

## Local Development Setup

### 1. Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Important:** Never commit the `.env` file to version control. It's already in `.gitignore`.

### 2. Install Dependencies

```bash
npm install
```

### 3. Test Locally

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Firebase Deployment

### 1. Login to Firebase

```bash
firebase login
```

### 2. Initialize Firebase in Project

```bash
firebase init
```

Select:
- ✅ Hosting: Configure files for Firebase Hosting
- ✅ Firestore: Deploy rules and create indexes

Configuration:
- **Firestore Rules file:** `firestore.rules`
- **Firestore indexes file:** `firestore.indexes.json`
- **Public directory:** `dist`
- **Single-page app:** Yes
- **Automatic builds with GitHub:** No (unless you want CI/CD)

### 3. Build the Application

```bash
npm run build
```

### 4. Deploy to Firebase

```bash
firebase deploy
```

Your app will be available at: `https://your-project-id.web.app`

## Firestore Security Rules

Create/update `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Workout sessions are private to each user
    match /users/{userId}/workouts/{workoutId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // User settings are private to each user
    match /users/{userId}/settings/{settingId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Environment-Specific Configurations

### Development
- Use Firebase emulators for local development
- Test mode Firestore rules
- Local authentication testing

### Production
- Secure Firestore rules
- Enable security features
- Configure proper CORS settings
- Set up monitoring and analytics

## Custom Domain (Optional)

1. Go to Hosting → Add custom domain
2. Enter your domain name
3. Verify ownership
4. Wait for SSL certificate provisioning

## Monitoring and Analytics

### Firebase Analytics
- Automatically tracks user engagement
- Custom events can be added for workout completions
- Track user retention and feature usage

### Performance Monitoring
- Enable Performance Monitoring in Firebase console
- Monitor app load times and user experience

## Backup and Recovery

### Data Export
- Users can export their data via the Settings page
- Exports include workout history and preferences
- Data is downloaded as JSON format

### Firestore Backup
- Set up automated Firestore backups in Firebase console
- Consider implementing data archival for long-term storage

## Security Considerations

1. **Authentication**
   - Only Google Sign-In is enabled
   - Users can only access their own data
   - Secure Firestore rules prevent unauthorized access

2. **Data Privacy**
   - No sensitive data is stored
   - User can delete all data via Settings
   - GDPR-compliant data export functionality

3. **Content Security**
   - No user-generated content storage
   - All data is structured and validated
   - No file uploads or external content

## Troubleshooting

### Common Issues

**Build Failures:**
- Check Node.js version (requires v16+)
- Clear `node_modules` and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Verify Firebase configuration in `.env`

**Authentication Issues:**
- Verify Google provider is enabled in Firebase Console
- Check authorized domains include your deployment URL
- Ensure Firebase configuration is correct

**Deployment Failures:**
- Login to Firebase CLI: `firebase login`
- Verify project ID: `firebase projects:list`
- Check build output in `dist` folder

**Firestore Permission Errors:**
- Verify security rules are deployed
- Check user authentication status
- Ensure user UID matches document path

### Support

For technical issues:
1. Check Firebase Console for error logs
2. Review browser developer console
3. Verify network connectivity
4. Check Firebase status page

## Maintenance

### Regular Updates
- Update dependencies monthly: `npm update`
- Monitor Firebase CLI updates: `npm update -g firebase-tools`
- Review and update Firestore security rules as needed

### Performance Optimization
- Monitor bundle size and consider code splitting
- Optimize images and assets
- Review and clean up unused dependencies
- Monitor Core Web Vitals in Firebase Performance

### Feature Updates
- The app is designed to be easily extensible
- New workout types can be added to the schema
- Additional analytics and insights can be integrated
- Social features can be added in future versions