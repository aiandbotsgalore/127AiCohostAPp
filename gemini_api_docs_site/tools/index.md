# Using tools with Gemini API  |  Google AI for Developers

Source: https://ai.google.dev/gemini-api/docs/tools

Gemini 3 Pro is here. [Try it for free in Google AI Studio](https://aistudio.google.com?model=gemini-3-pro-preview).

*   [Home](https://ai.google.dev/)
*   [Gemini API](https://ai.google.dev/gemini-api)
*   [Gemini API Docs](https://ai.google.dev/gemini-api/docs)

Send feedback

# Using tools with Gemini API

Tools extend the capabilities of Gemini models, enabling them to take action in the world, access real-time information, and perform complex computational tasks. Models can use tools in both standard request-response interactions and real-time streaming sessions via the [Live API](/gemini-api/docs/live-tools).

The Gemini API provides a suite of fully managed, built-in tools optimized for Gemini models or you can define custom tools using [Function Calling](/gemini-api/docs/function-calling).

## Available built-in tools

| Tool | Description | Use Cases |
| --- | --- | --- |
| [Google Search](/gemini-api/docs/google-search) | Ground responses in current events and facts from the web to reduce hallucinations. | \- Answering questions about recent events  
\- Verifying facts with diverse sources |
| [Google Maps](/gemini-api/docs/maps-grounding) | Build location-aware assistants that can find places, get directions, and provide rich local context. | \- Planning travel itineraries with multiple stops  
\- Finding local businesses based on user criteria |
| [Code Execution](/gemini-api/docs/code-execution) | Allow the model to write and run Python code to solve math problems or process data accurately. | \- Solving complex mathematical equations  
\- Processing and analyzing text data precisely |
| [URL Context](/gemini-api/docs/url-context) | Direct the model to read and analyze content from specific web pages or documents. | \- Answering questions based on specific URLs or documents  
\- Retrieving information across different web pages |
| [Computer Use (Preview)](/gemini-api/docs/computer-use) | Enable Gemini to view a screen and generate actions to interact with web browser UIs (Client-side execution). | \- Automating repetitive web-based workflows  
\- Testing web application user interfaces |
| [File Search](/gemini-api/docs/file-search) | Index and search your own documents to enable Retrieval Augmented Generation (RAG). | \- Searching technical manuals  
\- Question answering over proprietary data |

See the [Pricing page](/gemini-api/docs/pricing#pricing_for_tools) for details on costs associated with specific tools.

## How tools execution works

Tools allow the model to request actions during a conversation. The flow differs depending on whether the tool is built-in (managed by Google) or custom (managed by you).

### Built-in tool flow

For built-in tools like Google Search or Code Execution, the entire process happens within one API call:

1.  **You** send a prompt: "What is the square root of the latest stock price of GOOG?"
2.  **Gemini** decides it needs tools and executes them on Google's servers (e.g., searches for the stock price, then runs Python code to calculate the square root).
3.  **Gemini** sends back the final answer grounded in the tool results.

### Custom tool flow (Function Calling)

For custom tools and Computer Use, your application handles the execution:

1.  **You** send a prompt along with functions (tools) declarations.
2.  **Gemini** might send back a structured JSON to call a specific function (for example, `{"name": "get_order_status", "args": {"order_id": "123"}}`).
3.  **You** execute the function in your application or environment.
4.  **You** send the function results back to Gemini.
5.  **Gemini** uses the results to generate a final response or another tool call.

Learn more in the [Function calling guide](/gemini-api/docs/function-calling).

## Structured outputs vs. function Calling

Gemini offers two methods for generating structured outputs. Use [Function calling](/gemini-api/docs/function-calling) when the model needs to perform an intermediate step by connecting to your own tools or data systems. Use [Structured Outputs](/gemini-api/docs/structured-output) when you strictly need the model's final response to adhere to a specific schema, such as for rendering a custom UI.

## Structured outputs with tools

**Preview:** This is a feature available only with the `gemini-3-pro-preview` model.

You can combine [Structured Outputs](/gemini-api/docs/structured-output) with built-in tools to ensure that model responses grounded in external data or computation still adhere to a strict schema.

See [Structured outputs with tools](/gemini-api/docs/structured-output?example=recipe#structured_outputs_with_tools) for code examples.

## Building agents

Agents are systems that use models and tools to complete multi-step tasks. While Gemini provides the reasoning capabilities (the "brain") and the essential tools (the "hands"), you often need an orchestration framework to manage the agent's memory, plan loops, and perform complex tool chaining.

To maximize reliability in multi-step workflows, you should craft instructions that explicitly control how the model reasons and plans. While Gemini provides strong general reasoning, complex agents benefit from prompts that enforce specific behaviors like persistence in the face of issues, risk assessment, and proactive planning.

See the [Agentic workflows](/gemini-api/docs/prompting-strategies#agentic-workflows) for strategies on designing these prompts. Here is a example, of a [system instruction](/gemini-api/docs/prompting-strategies#agentic-si-template) that improved performance on several agentic benchmarks by around 5%.

### Agent frameworks

Gemini integrates with leading open-source agent frameworks such as:

*   [**LangChain / LangGraph**](/gemini-api/docs/langgraph-example): Build stateful, complex application flows and multi-agent systems using graph structures.
*   [**LlamaIndex**](/gemini-api/docs/llama-index): Connect Gemini agents to your private data for RAG-enhanced workflows.
*   [**CrewAI**](/gemini-api/docs/crewai-example): Orchestrate collaborative, role-playing autonomous AI agents.
*   [**Vercel AI SDK**](/gemini-api/docs/vercel-ai-sdk-example): Build AI-powered user interfaces and agents in JavaScript/TypeScript.
*   [**Google ADK**](https://google.github.io/adk-docs/get-started/python/): An open-source framework for building and orchestrating interoperable AI agents.

Send feedback

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2025-11-24 UTC.
