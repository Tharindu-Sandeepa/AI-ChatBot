# ai.buddy (Gemini Chatbot)

Gemini Chatbot is a React application that leverages the Gemini API to provide a chatbot experience similar to ChatGPT. The app was built from scratch, with all code implemented by the developer. Data visualization and other enhancements were made with the help of ChatGPT, and the Gemini API documentation was utilized to understand its functionality.

## Features

- Interactive chatbot interface
- Supports Markdown and rich text formatting
- Table rendering for structured data
- Responsive design
- Dark theme UI with Google color scheme
- Typing indicator for improved user experience

## Installation

Follow these steps to set up and run the Gemini Chatbot locally:

### Prerequisites

- Node.js (version 14 or higher)
- npm (version 6 or higher) or yarn

### Steps

1. **Clone the repository:**

    ```bash
    git clone https://github.com/Tharindu-Sandeepa/gemini-chatbot.git
    cd gemini-chatbot
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Create a `.env` file:**

    In the root directory of the project, create a `.env` file and add your Gemini API key:

    ```plaintext
    REACT_APP_GEMINI_API_KEY=your_api_key_here
    ```

4. **Start the development server:**

    ```bash
    npm start
    ```

    The app should now be running on `http://localhost:3000`.

## Usage

Once the app is running, you can interact with the chatbot by typing your questions into the input field at the bottom of the screen. The chatbot will respond with answers, which may include rich text formatting and tables.

### Example Questions

- What is the weather like today?
- Tell me a joke.
- Explain the theory of relativity.
- Show me a table of the periodic elements.

## UI Theme

The app uses a dark theme inspired by Google's Material Design, with a custom color palette. The chat interface includes:

- An AppBar with the application logo and title
- A chat container that displays user and bot messages
- An input field for sending messages
- A typing indicator to show when the bot is processing a response

## Table Output

The chatbot can render tables from Markdown input. Tables are displayed with a styled header and alternating row colors for better readability. Here's an example of how a table is rendered:



## Development

### Code Structure

- **src/App.js**: Main component that initializes the chat interface.
- **src/TypingIndicator.js**: Component that displays the typing indicator.
- **src/index.js**: Entry point of the application.

### Key Libraries

- React: JavaScript library for building user interfaces
- Material-UI: React components for faster
