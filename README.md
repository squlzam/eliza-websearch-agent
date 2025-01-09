

# AI Agent Using Eliza Framework and Websearch Plugin (Assigment)

Overview

This project demonstrates the creation of an AI agent using the Eliza Framework integrated with the Websearch Plugin. The agent allows users to input queries through the Eliza chat interface, performs a web search based on the input, and displays the results both in the chat window and the terminal.
Features

    User Input: Accepts user queries through the Eliza chat interface.
    Web Search Integration: Uses the Websearch Plugin to fetch results from the web.
    Dual Display: Outputs search results in the chat interface and terminal.

Setup Instructions

1. Clone the Repositories

Clone the following repositories:

    Eliza Framework
    Eliza Kickstart

2. Install Dependencies

Run the following command in the project directory to install the required dependencies:

pnpm install

3. Configure API Keys

Add the following API keys to the .env file:

    OPENROUTER_API_KEY: For the language model integration.
    TAVILY_API_KEY: For the Websearch Plugin.

4. Customize the Agent

    Configure the agent to integrate the Websearch Plugin and set up the character.
    Remove unrelated or unnecessary code for streamlined functionality.

Challenges Faced

    System and Node Compatibility:
        Resolved compatibility issues by installing the correct versions of Node.js and other dependencies.

    Model API Access:
        Encountered issues with OpenAI, Gemini, and Anthropic APIs due to restrictions on free-tier usage.
        Used the OpenRouter API as a functional alternative.

    Performance with LLaMA Model:
        Cloned an 8GB LLaMA-local model, but it was too slow for practical use.

Usage Instructions

    Start the Eliza Chat Interface
    Run the following command:

    pnpm run start --character=./characters/qulzam.character.json

    Input a Query
    Enter a query in the chat interface.

    View Results
        Results will be displayed in the chat window.
        They will also appear in the terminal.

Demo Video

For a detailed walkthrough, [click here](https://www.loom.com/share/d90cb6e25a464f4897a55e2aaaa69612?sid=610e424b-8009-4da5-b8bf-337c26ff8d10).
