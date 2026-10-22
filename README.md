# 🌸 MindCare – Mental Health & Therapy Chat App

> **"Your Mind Matters. We're Here to Listen."**

MindCare is a modern, responsive mental wellness and therapy application built using **Dart & Flutter** for the mobile frontend and backed by a secure **Node.js/Express & Google Gemini AI API** for empathetic therapy conversations, mood tracking, guided meditation, therapist directory, and 24/7 crisis support.

App is live on https://mind-care-app.ai.studio

## 📱 Features

1. **AI Therapy Chat (`/lib/features/chat/`)**
   - Empathetic, non-judgmental conversational support powered by Google Gemini.
   - Evidence-based coping tools (CBT reframing, Box breathing, Grounding).
   - Real-time typing indicators, quick prompt chips, topic filters (Stress, Sleep, Relationships, Overthinking).
   - Crisis keyword safety protocols with verified emergency helplines.

2. **Mood Tracking & Trend Analytics (`/lib/features/mood/`)**
   - Emoji & 1-10 intensity mood logging with contextual tags and journal notes.
   - Interactive weekly and monthly mood trends using `fl_chart`.
   - Gentle, non-diagnostic self-care suggestions based on emotional trends.

3. **Guided Meditation & Self-Care (`/lib/features/wellness/`)**
   - Interactive guided breathing circle (Box Breathing 4-4-4-4, 4-7-8 relaxing breath, Deep Calm).
   - 5-4-3-2-1 Sensory Grounding interactive exercise.
   - Daily wellness checklist and mindful journaling prompts.

4. **Therapist Directory & Consultations (`/lib/features/therapists/`)**
   - Verified licensed psychologists, psychiatrists, and counselors.
   - Filter by specialty, spoken language, and fee range.
   - Appointment booking system (video, clinic, audio) with reschedule/cancel management.

5. **24/7 Emergency Crisis Support (`/lib/core/services/`)**
   - Immediate "Get Help Now" action accessible from anywhere.
   - Verified crisis helplines for India (Tele-MANAS `14416`, KIRAN `1800-599-0019`, AASRA, Vandrevala Foundation), US/Canada (`988`), UK (`111`), and International.

6. **Authentication & Profile Management (`/lib/features/authentication/`)**
   - Secure login, signup, and password recovery.
   - Mental wellness preferences and privacy controls (export data, delete history).

---

## 📁 Flutter Project Architecture

```
lib/
├── main.dart                       # App entry point & Provider registration
├── app.dart                        # MaterialApp configuration & routing
├── core/
│   ├── theme/
│   │   └── app_theme.dart          # Calming Lavender/Mint Material 3 Theme
│   ├── constants/
│   │   └── app_constants.dart      # Colors, typography, crisis helplines
│   └── services/
│       ├── auth_service.dart       # User authentication & session state
│       ├── ai_chat_service.dart    # Secure backend chat API integration
│       └── database_service.dart   # Local persistence via SharedPreferences
├── models/
│   ├── user_model.dart             # User profile & wellness preferences
│   ├── chat_message.dart           # Chat message schema
│   ├── mood_entry.dart             # Mood log entry with tags & notes
│   └── therapist.dart              # Therapist profile & appointment slots
├── features/
│   ├── authentication/
│   │   ├── login_screen.dart       # Sign in with validation
│   │   └── signup_screen.dart      # Registration screen
│   ├── home/
│   │   └── home_screen.dart        # Dashboard with daily check-in & quick cards
│   ├── chat/
│   │   ├── chat_screen.dart        # Chat UI with prompt chips & topics
│   │   └── chat_controller.dart    # Provider state for chat history
│   ├── mood/
│   │   ├── mood_screen.dart        # Mood logging and fl_chart trend graphs
│   │   └── mood_controller.dart    # Mood state provider
│   ├── wellness/
│   │   ├── meditation_screen.dart  # Guided breathing circle & grounding tools
│   │   └── journal_screen.dart     # Reflection prompts & daily checklist
│   ├── therapists/
│   │   └── therapist_screen.dart   # Therapist directory & booking flow
│   └── profile/
│       └── profile_screen.dart     # User settings, dark mode & privacy controls
└── widgets/
    ├── custom_button.dart          # Material 3 styled rounded buttons
    ├── mood_card.dart              # Interactive mood rating card
    └── chat_bubble.dart            # Empathetic speech bubble with copy/share
```

---

## 🚀 How to Run the Flutter Application

### Prerequisites
- Flutter SDK `>= 3.19.0`
- Dart SDK `>= 3.0.0`
- Android Studio or VS Code with Flutter extension
- An Android Emulator, iOS Simulator, or physical device

### Step 1: Clone and Get Dependencies
```bash
git clone https://github.com/your-username/mindcare.git
cd mindcare
flutter pub get
```

### Step 2: Configure Backend API
The Flutter client communicates with the MindCare Node.js backend. In `/lib/core/constants/app_constants.dart`, update the backend endpoint:
```dart
// For Android Emulator:
static const String apiBaseUrl = 'http://10.0.2.2:3000';

// For iOS Simulator:
static const String apiBaseUrl = 'http://localhost:3000';

// For Production Cloud Run or Server:
static const String apiBaseUrl = 'https://your-cloud-run-url.app';
```

### Step 3: Run the App
- In **VS Code**: Press `F5` or select `Run Without Debugging`.
- In **Android Studio**: Select target device from the dropdown and click the green `Play` button.
- In **Terminal**:
```bash
flutter run
```

---

## 🛡️ Mental Health Safety & Ethics Notice
MindCare AI is designed strictly as an emotional support and wellness companion. It is **not** a healthcare provider, does not diagnose clinical psychiatric conditions, and does not prescribe medication. Users in crisis are prompted with 24/7 emergency hotline contacts.
