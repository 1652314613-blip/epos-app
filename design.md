# English Grammar Tutor - Mobile App Design

## Design Philosophy
- **Mobile-first**: Optimized for portrait orientation (9:16) and one-handed usage
- **iOS HIG Compliant**: Follows Apple Human Interface Guidelines for mainstream iOS app feel
- **Educational Focus**: Clear, distraction-free interface that prioritizes learning content
- **Instant Feedback**: Real-time grammar checking with visual error highlighting

## Color Scheme
- **Primary**: `#0a7ea4` (Teal Blue) - Trust, learning, intelligence
- **Success**: `#22C55E` (Green) - Correct grammar, achievements
- **Error**: `#EF4444` (Red) - Grammar mistakes, errors
- **Warning**: `#F59E0B` (Amber) - Suggestions, tips
- **Background**: `#ffffff` (Light) / `#151718` (Dark)
- **Surface**: `#f5f5f5` (Light) / `#1e2022` (Dark) - Cards, input areas

## Screen List

### 1. Home Screen (Main Entry)
**Primary Content:**
- Large text input area for sentence checking
- Quick access to recent checks
- Daily grammar tip card
- Progress overview (streak, points)

**Key Functionality:**
- Real-time grammar checking as user types
- Submit button for full analysis
- Voice input option (future)

**Layout:**
- Top: Welcome header with user progress badge
- Middle: Large rounded text input box (placeholder: "Type your English sentence here...")
- Below input: Submit button (prominent, primary color)
- Bottom section: Recent checks list (3-5 items, scrollable)

### 2. Check Result Screen
**Primary Content:**
- Original sentence with highlighted errors
- Error explanations with grammar rule references
- Corrected sentence
- Related grammar points from PEP textbooks

**Key Functionality:**
- Tap error to see detailed explanation
- "Learn More" button links to grammar lesson
- Save to review list
- Try again with new sentence

**Layout:**
- Top: Original sentence with red underlines on errors
- Middle: Scrollable error cards (each shows: error type, explanation, PEP reference)
- Bottom: Corrected sentence in green box
- Action buttons: "Save", "New Check", "Learn Rule"

### 3. Grammar Library Screen
**Primary Content:**
- Organized by PEP textbook grade levels (Grade 7-12)
- Grammar topics grouped by category (Tenses, Articles, Prepositions, etc.)
- Each topic shows: title, difficulty level, completion status

**Key Functionality:**
- Filter by grade level
- Search grammar topics
- Mark topics as learned
- Quick access to practice exercises

**Layout:**
- Top: Grade level tabs (7, 8, 9, 10, 11, 12)
- Search bar below tabs
- List of grammar categories (expandable)
- Each category contains topic cards with progress indicators

### 4. Grammar Lesson Screen
**Primary Content:**
- Grammar rule explanation (simplified from PEP textbooks)
- Example sentences with annotations
- Common mistakes section
- Practice exercises (3-5 questions)

**Key Functionality:**
- Read explanation
- View examples
- Complete practice exercises
- Check answers with explanations

**Layout:**
- Scrollable content area
- Top: Topic title and PEP reference
- Sections: Rule, Examples, Common Mistakes, Practice
- Bottom: "Mark as Learned" button

### 5. Practice Screen
**Primary Content:**
- Exercise question (fill-in-blank, error correction, sentence rewriting)
- Input area for answer
- Immediate feedback after submission
- Explanation for correct/incorrect answers

**Key Functionality:**
- Submit answer
- Get instant feedback
- See correct answer and explanation
- Next question button

**Layout:**
- Top: Progress indicator (Question 1/5)
- Middle: Question text
- Input area (varies by question type)
- Submit button
- Feedback card (appears after submission)

### 6. Progress Screen (Tab)
**Primary Content:**
- Learning streak calendar
- Total sentences checked
- Grammar topics mastered
- Error type breakdown chart
- Achievement badges

**Key Functionality:**
- View detailed statistics
- See improvement over time
- Access achievement details

**Layout:**
- Top: Streak counter with calendar heatmap
- Stats cards (sentences checked, topics learned, accuracy rate)
- Chart showing most common error types
- Achievement badge grid at bottom

### 7. Settings Screen (Tab)
**Primary Content:**
- Grade level selection
- Notification preferences
- Theme toggle (light/dark)
- About app information

**Key Functionality:**
- Change grade level (affects grammar library content)
- Toggle notifications
- Switch theme
- View app version and credits

**Layout:**
- Grouped list style (iOS Settings app pattern)
- Section headers: Learning, Preferences, About
- Each setting item is a tappable row

## Key User Flows

### Flow 1: Check a Sentence
1. User opens app → Home Screen
2. User types sentence in input box
3. User taps "Check Grammar" button
4. App analyzes sentence → Check Result Screen
5. User reviews errors and corrections
6. User taps "Learn More" on an error → Grammar Lesson Screen
7. User reads explanation and completes practice
8. User returns to Home to check another sentence

### Flow 2: Study Grammar by Grade Level
1. User taps "Library" tab → Grammar Library Screen
2. User selects grade level (e.g., Grade 9)
3. User taps a grammar category (e.g., "Past Perfect Tense")
4. App shows Grammar Lesson Screen
5. User reads explanation and examples
6. User taps "Practice" → Practice Screen
7. User completes exercises with instant feedback
8. User marks topic as learned → returns to Library

### Flow 3: Review Progress
1. User taps "Progress" tab → Progress Screen
2. User views learning streak and statistics
3. User taps on error type chart → sees detailed breakdown
4. User identifies weak areas
5. User taps "Practice Weak Areas" → redirects to relevant lessons

### Flow 4: Daily Learning Routine
1. User opens app daily → sees daily grammar tip on Home Screen
2. User taps tip → Grammar Lesson Screen
3. User learns new rule
4. User practices with 3-5 sentences
5. User checks own sentences throughout the day
6. User maintains learning streak

## Navigation Structure
- **Tab Bar** (bottom, 4 tabs):
  1. Home (house icon)
  2. Library (book icon)
  3. Progress (chart icon)
  4. Settings (gear icon)

- **Modal Screens** (slide up from bottom):
  - Check Result Screen
  - Grammar Lesson Screen
  - Practice Screen

## Interaction Patterns
- **Text Input**: Large, rounded, with subtle border; focus state shows primary color border
- **Error Highlighting**: Red wavy underline (like Word/Google Docs)
- **Buttons**: Rounded corners (12px), primary buttons use brand color, secondary use surface color
- **Cards**: Rounded (16px), subtle shadow, tappable with opacity feedback (0.7)
- **Lists**: Swipe actions for delete/save (iOS pattern)
- **Haptic Feedback**: Light impact on button taps, success notification on correct answers

## Typography
- **Headings**: SF Pro Display (iOS), bold, 24-32px
- **Body Text**: SF Pro Text (iOS), regular, 16-18px
- **Input Text**: SF Pro Text, 18px for readability
- **Explanations**: SF Pro Text, 15px, line-height 1.5 for comfortable reading

## Accessibility
- Minimum touch target: 44x44pt (iOS standard)
- High contrast mode support
- Dynamic type support (text scaling)
- VoiceOver support for screen readers
