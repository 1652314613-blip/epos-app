# English Grammar Tutor - Project TODO

## Core Features

- [x] Home screen with large text input for grammar checking
- [x] Real-time grammar error detection using OpenAI API
- [x] Check Result screen with error highlighting and explanations
- [x] Grammar Library organized by PEP textbook grade levels (7-12)
- [ ] Grammar Lesson screen with rules, examples, and practice exercises
- [ ] Practice screen with interactive exercises and instant feedback
- [x] Progress tracking screen with statistics and achievements
- [x] Settings screen with grade level selection and preferences
- [x] Tab bar navigation (Home, Library, Progress, Settings)
- [x] Local data storage for user progress and history
- [x] PEP grammar knowledge base data structure
- [x] Error type categorization (tenses, articles, preposations, etc.)
- [x] Daily grammar tip feature on home screen
- [x] Learning streak tracking
- [x] Recent checks history on home screen
- [x] Custom app logo and branding

## UI/UX Enhancements

- [ ] Error highlighting with red wavy underlines
- [ ] Smooth animations for screen transitions
- [ ] Haptic feedback on button interactions
- [ ] Dark mode support
- [ ] Swipe gestures for list actions

## Future Enhancements (Optional)

- [ ] Voice input for sentence checking
- [ ] Achievement badge system
- [ ] Offline mode for grammar lessons
- [ ] Export learning reports

## New Requirements (User Requested)

- [x] Change all UI text to Chinese (interface language)
- [x] Add wrong question book (错题本) feature
- [x] Store all sentences with errors in wrong question book
- [x] Display wrong question book in a dedicated tab or screen
- [x] AI-generated similar practice exercises based on error types
- [x] Practice mode for wrong questions with AI-generated variants
- [x] Track progress on correcting common mistakes

## Bug Fixes

- [x] Fix grammar check API error (OpenAI 401 error)

## New User Request

- [x] Change AI explanations and suggestions to friendly, easy-to-understand Chinese
- [x] Update grammar check prompt to output Chinese explanations
- [x] Update practice exercise generation prompt to output Chinese explanations

## New Feature Request

- [x] Add Q&A section in check result page for students to ask follow-up questions
- [x] AI suggests related knowledge points students might want to learn
- [x] Display suggested questions as quick-tap buttons
- [x] Real-time AI answers to student questions

## Animation Features

- [x] Button interaction animations (scale, bounce effects)
- [x] Loading animations for grammar check and AI responses
- [x] List item enter/exit animations for history and wrong book
- [x] Result display animations (errors appear one by one)
- [x] Page transition animations
- [x] Success/error feedback animations
- [x] Smooth scroll animations

## Bug Fixes

- [x] Fix recent checks list items not clickable - should navigate to check result details

## Vocabulary Features (New Requirement)

- [x] Dictionary lookup feature with pronunciation, definitions, and examples
- [x] Add words to personal vocabulary book from dictionary or grammar checks
- [x] Vocabulary book management (categorize, tag, delete words)
- [x] Learning mode: flashcard-style word review
- [x] Multiple review modes (recognition, recall, spelling)
- [x] Spaced repetition algorithm (similar to Anki/SuperMemo)
- [ ] Daily learning goals and reminders
- [x] Word mastery levels (new, learning, familiar, mastered)
- [x] Vocabulary statistics and progress visualization
- [ ] Integration with grammar check: auto-collect difficult words
- [x] Example sentences from real context
- [ ] Word pronunciation audio (TTS or API)

## Textbook Vocabulary Database (New Requirement)

- [x] Research PEP (People's Education Press) textbook vocabulary structure (Grade 7-12)
- [x] Design textbook vocabulary data structure (grade, book, unit, word list)
- [x] Create vocabulary database for each grade and unit
- [x] Add phonetics, definitions, and example sentences for each word
- [x] Implement textbook vocabulary browser interface
- [x] Allow students to select grade level and unit to study
- [x] Integrate textbook vocabulary into vocabulary book learning flow
- [x] Add "Add all unit words to vocabulary book" batch feature
- [ ] Display progress for each unit (how many words learned/mastered)

## Textbook-Integrated Learning System (New Requirement)

- [x] Design textbook-synchronized learning architecture
- [x] Map grammar points to each textbook unit
- [x] Create unit learning page combining vocabulary and grammar
- [x] Add grammar explanations and exercises for each unit
- [x] Integrate vocabulary and grammar learning flow
- [ ] Add unit progress tracking (vocabulary + grammar combined)
- [x] Create unified textbook learning main interface
- [x] Replace separate tabs with integrated textbook learning experience

## Tab Bar Simplification (New Requirement)

- [x] Create Learning Center page integrating textbook, vocabulary, and grammar library
- [x] Create Profile page integrating progress and settings
- [x] Update tab bar layout to 4 core tabs (Home, Learning, Wrong Book, Profile)
- [x] Ensure all existing features remain accessible through new navigation

## Photo Recognition Feature (New Requirement)

- [x] Integrate camera and image picker functionality
- [x] Develop OCR text recognition API using AI vision
- [x] Create photo recognition interface with camera/gallery options
- [x] Extract English text from images
- [x] Integrate grammar check for recognized sentences
- [x] Integrate dictionary lookup for recognized words
- [x] Display recognition results with editing capability
- [x] Allow users to correct OCR errors before processing
- [x] Add photo recognition button to home screen

## New User Requests

- [x] Add grammar practice exercise generation for each grammar point
- [x] Create grammar exercise screen with AI-generated questions
- [x] Redesign photo recognition interface to be more concise and beautiful
- [x] Simplify photo recognition button design

## Data Visualization (New Requirement)

- [x] Design chart data structure and statistics logic
- [x] Integrate chart library (e.g., react-native-chart-kit or Victory Native)
- [x] Create learning trend line chart (daily/weekly grammar checks and vocabulary learning)
- [x] Create vocabulary mastery pie chart (new/learning/familiar/mastered distribution)
- [ ] Add error type distribution bar chart
- [x] Display charts in profile/progress page
- [ ] Add date range selector for trend charts

## Bug Fixes (User Reported - Preview Error)

- [x] Fix preview error reported by user
- [x] Test all chart components render correctly
- [x] Verify no console errors in dev server

## Bug Fixes (User Reported - Font Loading Timeout)

- [x] Fix "6000ms timeout exceeded" error in fontfaceobserver
- [x] Remove or fix font loading configuration
- [ ] Test app startup on mobile device (waiting for user confirmation)
- [ ] Ensure app loads without errors (waiting for user confirmation)

## Feature: Grade 7 Textbook Content Integration (All 7 Units)

### Phase 1: Complete Analysis
- [x] Analyze Unit 1: You and Me (listening/speaking/reading/writing/grammar)
- [x] Analyze Unit 2: We're Family (listening/speaking/reading/writing/grammar)
- [x] Analyze Unit 3: My School (listening/speaking/reading/writing/grammar)
- [x] Analyze Unit 4: My Favourite Subject (listening/speaking/reading/writing/grammar)
- [x] Analyze Unit 5: Fun Clubs (listening/speaking/reading/writing/grammar)
- [x] Analyze Unit 6: A Day in the Life (listening/speaking/reading/writing/grammar)
- [x] Analyze Unit 7: Happy Birthday (listening/speaking/reading/writing/grammar)

### Phase 2: Content Extraction
- [x] Extract all grammar points with rules and examples
- [x] Extract all vocabulary with meanings and usage
- [x] Extract key sentence patterns from each unit
- [x] Document listening/speaking topics and dialogues
- [x] Document reading passages themes
- [x] Document writing tasks and formats

### Phase 3: Implementation
- [x] Create unit selection interface (7 units)
- [x] Implement grammar learning page for each unit
- [x] Implement vocabulary learning page for each unit
- [x] Implement practice exercises for each unit
- [x] Add progress tracking for all units
- [x] Test all learning content

## Feature: Complete Vocabulary List from Textbook

- [x] Extract vocabulary list from textbook appendix
- [x] Identify all Unit 1-7 core vocabulary (221 words total)
- [x] Enhance existing vocabulary data with complete word lists
- [x] Add phonetics and original example sentences for all words
- [x] Update word count for each unit
- [x] Test vocabulary data completeness

## Feature: Vocabulary Quiz/Test (New Requirement)

- [x] Design vocabulary quiz structure (multiple choice, fill-in-blank, matching)
- [x] Implement quiz question generation logic for each unit
- [x] Create quiz interface with question display and answer input
- [x] Add timer and scoring system
- [x] Display quiz results with correct/incorrect answers
- [ ] Save quiz history and track progress
- [x] Add "Start Quiz" button in unit learning page
- [x] Support different difficulty levels (basic/intermediate/advanced)
- [x] Test quiz functionality for all units

## Feature: Quiz History and Progress Tracking (New Requirement)

- [x] Create quiz history storage using AsyncStorage
- [x] Save quiz results after each test completion
- [x] Display quiz history list in profile page
- [x] Create progress chart showing score trends over time
- [x] Add filter by unit/date for history view
- [x] Show statistics (average score, total quizzes, improvement rate)

## Feature: Word Pronunciation (TTS) (New Requirement)

- [x] Integrate expo-speech for TTS functionality
- [x] Add speaker icon button next to each word
- [x] Implement text-to-speech for word pronunciation
- [x] Add TTS for example sentences
- [x] Support pronunciation in vocabulary learning page
- [x] Support pronunciation in quiz results page
- [x] Handle TTS errors gracefully

## Feature: Wrong Words Integration with Vocabulary Book (New Requirement)

- [x] Automatically add wrong quiz words to vocabulary book
- [x] Create "需要复习" (Need Review) category in vocabulary book
- [x] Mark words from quiz mistakes with special tag
- [x] Show quiz mistake count for each word
- [x] Add "Review Wrong Words" quick action in vocabulary book
- [x] Integrate with existing wrong question book system

## Feature: Phone Number SMS Login (New Requirement)

- [x] Design phone number login UI/UX flow
- [x] Create login screen with phone number input
- [x] Add SMS verification code input interface
- [x] Implement backend SMS sending endpoint
- [x] Implement backend SMS verification endpoint
- [x] Integrate with user authentication system
- [x] Store user phone number and profile
- [x] Add logout functionality
- [x] Handle login state persistence
- [x] Test SMS login flow end-to-end

## Feature: Enhanced Grammar Check Feedback UI (User Request)

- [x] Add color-coded error highlighting (red=tense, blue=spelling, purple=preposition)
- [x] Implement hover/tap knowledge card popup explaining errors
- [x] Link error explanations to relevant textbook grammar chapters
- [x] Redesign UI with Duolingo/Notion-inspired style (clean and motivating)
## Feature: Smart Wrong Question Book with Spaced Repetition (User Request)

- [x] Implement Ebbinghaus forgetting curve algorithm
- [x] Auto-schedule review reminders on days 1, 3, 7, 15
- [x] Add status tags: "待复习" (To Review), "已掌握" (Mastered), "高频易错" (High Frequency Error)
- [x] Generate simple "Grammar Mastery Progress Bar" based on practice performance
- [x] Add score improvement prediction feature

## Feature: Score Improvement Tools for Exams (User Request)

- [x] Advanced expression suggestions: Provide 2-3 upgraded vocabulary/phrase alternatives
- [x] Exam relevance tags: Mark suggestions as "中考高频" or "高考加分项"
- [x] One-tap save to "积累本" (Expression Collection Book)
- [x] Integrate with existing vocabulary book system
- [x] Create collection book page for viewing saved expressions
- [x] Add collection book entry in learning center

## Feature: App Store Preparation (User Request)

- [x] Create privacy policy page compliant with App Store requirements
- [x] Deploy privacy policy to /privacy route
- [x] Note: This is an Expo project - use EAS Build (expo build:ios / expo build:android) instead of Capacitor
- [x] OCR camera interface already optimized for mobile devices
- [x] Handwriting recognition using AI vision model (expo-image-picker integrated)

## New Requirements: Deep Integration of Four Major Modules (User Request)

### 1. AI Grammar Private Tutor System (Deep Error Correction)

- [x] Optimize grammar check result page: Add "地道表达 (AI润色)" card
- [x] Provide mother-tongue level improvement suggestions and explain scoring points
- [x] Add TTS functionality: Add speaker icon next to correct sentences
- [x] Use browser speech API for authentic English pronunciation

### 2. Dynamic Exam Tags (Middle/High School Exam Enhancement)

- [x] Integrate tag system in textbook learning and grammar library
- [x] AI automatically tags knowledge points as "中考高频", "高考易错", or "作文加分句式"
- [x] Complete textbook synchronization progress bar
- [x] Display current unit learning completion percentage in real-time

### 3. Data Visualization and Motivation (Profile Page Redesign)

- [x] Introduce "能力雷达图" (Ability Radar Chart)
- [x] Display 5 dimensions in profile page: vocabulary, grammar, authenticity, perseverance, difficulty
- [x] Optimize empty state prompts: Show encouraging messages instead of plain 0%
- [ ] Develop "战报分享" (Battle Report Share) feature (Deferred due to complexity)
- [ ] Generate beautiful share image with weekly progress and exam score data (Canvas implementation) (Deferred)

### 4. Wrong Question Book Algorithm Upgrade (Ebbinghaus Logic)

- [x] Implement automated review flow
- [x] Classify wrong questions based on Ebbinghaus curve
- [x] Add "今日待复习" (Today's Review) red dot reminder on homepage
- [x] Optimize "提分预测" (Score Improvement Prediction) algorithm (Already implemented in previous iteration)
- [x] Dynamically update prediction based on user's recent week error correction weight (Already implemented)


## New Feature: Swipeable Card Vocabulary Learning (User Request)

- [x] Create swipeable card component with Tinder-like interaction
- [x] Implement gesture handling: swipe right (know), swipe left (don't know)
- [x] Add visual feedback: card rotation and color overlay during swipe
- [x] Integrate with vocabulary learning page
- [x] Track learning progress based on swipe actions
- [x] Add haptic feedback for swipe actions
- [x] Add entry in learning center
