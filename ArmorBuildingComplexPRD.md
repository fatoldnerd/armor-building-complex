Product Requirements Document (PRD)
Product Name
Armor Builder: Kettlebell Complex Tracker

Purpose
The Armor Builder app is a web-based fitness tracking tool specifically designed to help athletes and kettlebell enthusiasts track their progress through Dan John’s Armor Building Complex (ABC). The app will allow users to log each workout, track progress over time, visualize trends, and stay motivated with training streaks and personal bests.

Target Audience
	• Kettlebell practitioners of all levels
	• Fitness enthusiasts looking for structured kettlebell progress tracking
	• Athletes focused on functional strength and durability
	• Users of Dan John’s Armor Building Complex program

Key Features
	1. Workout Logging
		○ Log each set of the Armor Building Complex: 2 Kettlebell Cleans, 1 Kettlebell Press, 3 Kettlebell Front Squats (performed with two kettlebells)
		○ Input kettlebell weight(s) used for each session
		○ Track number of rounds per session
		○ Optional: Add session notes or perceived effort
	2. Progress Tracking
		○ Visualize rounds completed over time (daily, weekly, monthly views)
		○ Track total rounds, total weight lifted, and personal bests
		○ Highlight personal records (heaviest weight, most rounds, longest streak)
	3. Session History
		○ Display a historical log of past workouts
		○ Allow filtering by date, weight, or number of rounds
	4. Training Targets
		○ Set daily, weekly, or monthly goals for rounds completed
		○ Receive reminders to train and log sessions
	5. User Accounts
		○ Enable user authentication using Google Authentication via Firebase from initial release
		○ Save progress across devices
	6. Mobile-Friendly Design
		○ Fully responsive design for gym and home use

Non-Functional Requirements
	• Simple, intuitive interface with minimal friction
	• Fast load times
	• Data persistence using Firebase (Firestore) from initial release

Tech Stack
	• Front-End: React with Vite for fast build times and modern tooling
	• Back-End: No dedicated backend server for MVP
	• Authentication: Google Authentication via Firebase
	• Database: Firebase Firestore for cloud storage and cross-device syncing
	• Hosting: Google Firebase Web App Hosting

Success Metrics
	• Daily active users (DAU)
	• Number of workouts logged per user per week
	• User retention after 4 weeks
	• Achievement of training targets

Assumptions
	• Users are familiar with kettlebell training basics
	• Users understand Dan John’s Armor Building Complex flow, including the use of two kettlebells
	• MVP will focus on core tracking; social or competitive features may be considered later

Constraints
	• Initial version will be a web app only
	• Must be compatible with Firebase Hosting, Google Authentication, and Firebase Firestore
	• No third-party integrations required for MVP
