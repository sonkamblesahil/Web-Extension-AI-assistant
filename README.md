# AI Research Assistant

A Chrome extension that uses Google's Gemini AI to summarize text and suggest related topics in real-time.

## Features

- **Real-time text selection** - Select text on any webpage and it automatically appears in the sidebar
- **AI-powered summarization** - Get concise summaries of selected content
- **Smart suggestions** - Receive related topics and further reading recommendations
- **Side panel interface** - Non-intrusive sidebar that doesn't block page content

## Project Structure

```
AI-assistant/
├── backend/                 # Spring Boot backend
│   ├── src/main/java/com/research/backend/
│   │   ├── BackendApplication.java
│   │   ├── ResearchController.java
│   │   ├── ResearchRequest.java
│   │   └── ResearchService.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
└── frontend/                # Chrome Extension
    ├── index.html           # Side panel UI
    ├── popup.js             # Main extension logic
    ├── background.js        # Service worker
    ├── content.js           # Content script for text selection
    ├── manifest.json        # Extension configuration
    └── icons/               # Extension icons
```



## Setup

### Backend

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Add your Gemini API key to `src/main/resources/application.properties`:

   ```properties
   gemini.api.key=YOUR_API_KEY_HERE
   ```

3. Run the Spring Boot application:

   ```bash
   ./mvnw spring-boot:run
   ```

   The server will start on `http://localhost:8081`

### Chrome Extension

1. Open Chrome and navigate to `chrome://extensions/`

2. Enable **Developer mode** (toggle in top right corner)

3. Click **Load unpacked**

4. Select the `frontend` folder

5. The extension icon will appear in your Chrome toolbar

## Usage

1. **Start the backend** server first

2. **Click the extension icon** in Chrome toolbar to open the side panel

3. **Select any text** on a webpage - it will automatically appear in the input field

4. Click **Summary** to get a concise summary of the text

5. Click **Suggest** to get related topics and further reading recommendations

6. Use the **Copy** button to copy results to clipboard



