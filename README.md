## Project Overview
MindCare is a mental wellness application that helps users manage stress, anxiety, overthinking, emotional difficulties, and everyday challenges. It provides AI-powered emotional support, mood tracking, guided meditation, journaling, and access to professional therapists.

The application should have a clean, calming interface and work on Android and iOS. Keep the code modular, maintainable, and suitable for a college project or future production development.

## Technology Stack
- Programming language: Dart
- Framework: Flutter
- Backend and database: Firebase or Supabase
- Authentication: Firebase Authentication or Supabase Auth
- AI chat: Integrate an AI model through a secure backend API
- Charts: Flutter-compatible charting package
- Notifications: Firebase Cloud Messaging, if configured
- State management: Provider or Riverpod
- Local storage: SharedPreferences or a suitable secure storage solution

## UI and Design
- Use a calming combination of lavender, light blue, white, and pastel green.
- Use Material Design 3 components, rounded cards, subtle animations, and readable typography.
- Create a mobile-first layout with support for different screen sizes.
- Include dark mode and accessible text sizes.
- Use a welcoming design with the tagline: “Your Mind Matters. We're Here to Listen.”

## Main Features

### 1. Authentication
- Sign up, log in, log out, and password recovery.
- User profile with display name and optional wellness preferences.
- Form validation and clear error messages.
- Secure authentication and protected user-specific data.

### 2. AI Therapy Chat
- Create a real-time-style chat interface with message bubbles.
- Display user and AI messages with timestamps.
- Show a typing indicator while generating responses.
- Add suggested prompts:
  - I'm feeling stressed today.
  - I can't stop overthinking.
  - I need someone to talk to.
  - Help me relax before sleeping.
- Include conversation topics such as stress, confidence, relationships, sleep, and emotional wellness.
- Allow users to start a new conversation and delete their chat history.
- Connect the chat to an AI service through a secure backend rather than exposing API keys in the Flutter app.
- Provide empathetic, non-judgmental responses and practical coping strategies.

### 3. Mood Tracking
- Allow users to select a mood using emojis or a scale from 1 to 10.
- Let users add optional journal notes.
- Store mood entries with dates.
- Display weekly and monthly mood trends using charts.
- Provide general self-care suggestions without diagnosing mental health conditions.

### 4. Therapist Directory
- Display therapist profiles, verified qualifications, specialties, languages, and consultation fees.
- Include search and filtering.
- Allow users to view available appointments and book, cancel, or reschedule consultations.
- Clearly distinguish actual therapist profiles and bookings from demo data.
- Add messaging or video consultations only when the required services are configured.

### 5. Meditation and Self-Care
- Add guided breathing exercises with an animated breathing circle.
- Provide mindfulness sessions, grounding techniques, and relaxation exercises.
- Include a meditation timer and daily self-care checklist.
- Add journaling prompts and sleep relaxation activities.
- Track completed activities.

### 6. Home Dashboard
- Display a personalized greeting.
- Add a daily mood check-in.
- Show recent mood entries and wellness progress.
- Provide quick-access cards for AI chat, meditation, journaling, and therapist appointments.
- Include a bottom navigation bar with Home, Chat, Mood, Wellness, and Profile.

### 7. Emergency Support
- Add a clearly visible “Get Help Now” option.
- If users express possible self-harm or immediate danger, respond calmly and encourage them to contact a trusted person and appropriate professional or emergency services.
- Provide verified local crisis resources, including appropriate resources for users in India.
- Do not claim that the app continuously monitors messages or that the AI can independently handle emergencies.

### 8. Profile and Settings
- Allow users to edit their profile and preferences.
- Add notification settings and theme selection.
- Provide options to review and delete stored personal information.
- Include privacy information, app information, and logout.

## Flutter Project Structure

Organize the Dart code using a clean, feature-based structure similar to this:

lib/
  main.dart
  app.dart
  core/
    theme/
      app_theme.dart
    constants/
      app_constants.dart
    services/
      auth_service.dart
      ai_chat_service.dart
      database_service.dart
  models/
    user_model.dart
    chat_message.dart
    mood_entry.dart
    therapist.dart
  features/
    authentication/
      login_screen.dart
      signup_screen.dart
    home/
      home_screen.dart
    chat/
      chat_screen.dart
      chat_controller.dart
    mood/
      mood_screen.dart
      mood_controller.dart
    wellness/
      meditation_screen.dart
      journal_screen.dart
    therapists/
      therapist_screen.dart
    profile/
      profile_screen.dart
  widgets/
    custom_button.dart
    mood_card.dart
    chat_bubble.dart

## Development Requirements
- Use null-safe Dart.
- Use reusable Flutter widgets and separate UI, business logic, and data services.
- Use Provider or Riverpod consistently for state management.
- Implement navigation with named routes or a suitable routing package.
- Include loading indicators, empty states, error handling, and input validation.
- Write clean, documented code that is easy for a student to understand.
- Use Firebase or Supabase only after the project is configured.
- Include mock data only for clearly labeled demonstration screens.
- Ensure that all buttons and navigation elements perform their intended actions.

## Security and Mental Health Safety
- Never store private API keys in the Flutter client.
- Restrict database access to authenticated, authorized users.
- Obtain appropriate consent before storing sensitive wellness information.
- Do not use AI to diagnose disorders or prescribe medication.
- Explain that AI chat is supportive and is not a replacement for licensed therapy.
- Protect private chat histories and mood records.
- Test emergency guidance and privacy controls before public release.

## Expected Deliverables
1. Complete Flutter project written in Dart.
2. Attractive splash screen and onboarding flow.
3. Login and signup screens.
4. Home dashboard with bottom navigation.
5. Functional AI chat interface.
6. Mood tracker with charts.
7. Meditation, breathing, and journaling screens.
8. Therapist directory and appointment flow.
9. Profile, privacy, and settings screens.
10. Setup instructions in README.md.
11. Dependency list in pubspec.yaml.
12. Instructions for running the app using Android Studio or VS Code.

## Implementation Instructions
Build the application step by step. First create the Flutter project, theme, navigation, authentication screens, dashboard, and chat UI. Then implement mood tracking, wellness tools, therapist features, and backend integrations.

Generate complete Dart source files rather than pseudocode. Ensure imports, dependencies, navigation, and models are consistent across the project. Where credentials or external services are unavailable, provide a clearly labeled demo mode and explain how to enable the real integration.

The final result should be a polished, functional Flutter mental wellness application suitable for Android and expandable to iOS.
