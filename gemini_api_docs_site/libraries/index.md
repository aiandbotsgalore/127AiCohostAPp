# Gemini API libraries  |  Google AI for Developers

Source: https://ai.google.dev/gemini-api/docs/libraries

/\* Styles inlined from /site-assets/css/pricing.css \*/ /\* Pricing table styles \*/ .pricing-table { border-collapse: separate; border-spacing: 0; border-radius: 8px; overflow: hidden; } .pricing-table th { background-color: #f2f2f2; text-align: left; padding: 8px; } /\* Set the second and after (of three total) columns to 35% width. \*/ .pricing-table th:nth-child(n+2) { width: 35%; } /\* These should use theme colours for light too, so we don't \* need an override. \*/ .color-scheme--dark .pricing-table th { background-color: var(--devsite-ref-palette--grey800); } .pricing-table td { padding: 8px; } .free-tier { background-color: none; } .paid-tier { background-color: #eff5ff; } .color-scheme--dark .paid-tier { background-color: var(--devsite-background-5); } .pricing-table th:first-child { border-top-left-radius: 8px; } .pricing-table th:last-child { border-top-right-radius: 8px; } .pricing-table tr:last-child td:first-child { border-bottom-left-radius: 8px; } .pricing-table tr:last-child td:last-child { border-bottom-right-radius: 8px; } .pricing-container { max-width: 1100px; width: 100%; } .pricing-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; justify-content: center; } .pricing-card { background-color: #ffffff; border-radius: 16px; border: 1px solid #dadce0; padding: 2.5rem; display: flex; flex-direction: column; transition: all 0.3s ease; position: relative; } .color-scheme--dark .pricing-card { background-color: var(--devsite-ref-palette--grey800); } .plan-name { font-size: 1.75rem; font-weight: 700; margin: 0 0 0.5rem 0; } .plan-description { font-size: 1rem; color: #5f6368; margin: 0 0 2.5rem 0; line-height: 1.5; min-height: 80px; } .color-scheme--dark .plan-description { color: var(--devsite-primary-text-color); } .plan-description a { color: #1a73e8; text-decoration: none; } .plan-description a:hover { text-decoration: underline; } .features { list-style: none; padding: 0; margin: 0 0 2rem 0; } .features li { display: flex; align-items: flex-start; margin-bottom: 1.25rem; font-size: 1rem; line-height: 1.5; color: #3c4043; } .features li.feature-description { display: block; color: #5f6368; } .features li a { color: #1a73e8; text-decoration: none; margin-left: 4px; } .features li .material-symbols-outlined { font-size: 24px; margin-right: 0.75rem; color: #3c4043; margin-top: 2px; } .color-scheme--dark .features li, .features li .material-symbols-outlined { color: var(--devsite-primary-text-color); } .cta-button { display: inline-block; text-align: center; text-decoration: none; width: 100%; padding: 0.75rem 1rem; border-radius: 8px; font-size: 1rem; font-weight: 500; cursor: pointer; transition: background-color 0.2s ease; box-sizing: border-box; border: 1px solid #dadce0; background-color: #fff; color: #1a73e8; margin-top: auto; } .cta-button:hover { background-color: rgba(66, 133, 244, 0.05); } .pricing-card.recommended { border: 2px solid #1a73e8; overflow: hidden; } .pricing-card.recommended::before { position: absolute; top: 22px; right: -32px; width: 120px; height: 30px; background-color: #1a73e8; color: white; display: flex; justify-content: center; align-items: center; font-size: 0.8rem; font-weight: 600; transform: rotate(45deg); z-index: 1; } .heading-group { display: flex; flex-direction: column; } .heading-group h2 { margin-bottom: 0; } .heading-group em { margin-top: 0; }

Gemini 3 Pro is here. [Try it for free in Google AI Studio](https://aistudio.google.com?model=gemini-3-pro-preview).

*   [Home](https://ai.google.dev/)
*   [Gemini API](https://ai.google.dev/gemini-api)
*   [Gemini API Docs](https://ai.google.dev/gemini-api/docs)

Send feedback

# Gemini API libraries

When building with the Gemini API, we recommend using the **Google GenAI SDK**. These are the official, production-ready libraries that we develop and maintain for the most popular languages. They are in [General Availability](/gemini-api/docs/libraries#new-libraries) and used in all our official documentation and examples.

**Note:** If you're using one of our legacy libraries, we strongly recommend you [migrate](/gemini-api/docs/migrate) to the Google GenAI SDK. Review the [legacy libraries](/gemini-api/docs/libraries#previous-sdks) section for more information.

If you're new to the Gemini API, follow our [quickstart guide](/gemini-api/docs/quickstart) to get started.

## Language support and installation

The Google GenAI SDK is available for the Python, JavaScript/TypeScript, Go and Java languages. You can install each language's library using package managers, or visit their GitHub repos for further engagement:

### Python

*   Library: [`google-genai`](https://pypi.org/project/google-genai)
    
*   GitHub Repository: [googleapis/python-genai](https://github.com/googleapis/python-genai)
    
*   Installation: `pip install google-genai`
    

### JavaScript

*   Library: [`@google/genai`](https://www.npmjs.com/package/@google/genai)
    
*   GitHub Repository: [googleapis/js-genai](https://github.com/googleapis/js-genai)
    
*   Installation: `npm install @google/genai`
    

### Go

*   Library: [`google.golang.org/genai`](https://pkg.go.dev/google.golang.org/genai)
    
*   GitHub Repository: [googleapis/go-genai](https://github.com/googleapis/go-genai)
    
*   Installation: `go get google.golang.org/genai`
    

### Java

*   Library: `google-genai`
    
*   GitHub Repository: [googleapis/java-genai](https://github.com/googleapis/java-genai)
    
*   Installation: If you're using Maven, add the following to your dependencies:
    

```
<dependencies>
  <dependency>
    <groupId>com.google.genai</groupId>
    <artifactId>google-genai</artifactId>
    <version>1.0.0</version>
  </dependency>
</dependencies>
```

### C#

*   Library: `Google.GenAI`
    
*   GitHub Repository: [googleapis/go-genai](https://googleapis.github.io/dotnet-genai/)
    
*   Installation: `dotnet add package Google.GenAI`
    

## General availability

We started rolling out Google GenAI SDK, a new set of libraries to access Gemini API, in late 2024 when we launched Gemini 2.0.

As of May 2025, they reached General Availability (GA) across all supported platforms and are the recommended libraries to access the Gemini API. They are stable, fully supported for production use, and are actively maintained. They provide access to the latest features, and offer the best performance working with Gemini.

If you're using one of our legacy libraries, we strongly recommend you migrate so that you can access the latest features and get the best performance working with Gemini. Review the [legacy libraries](/gemini-api/docs/libraries#previous-sdks) section for more information.

## Legacy libraries and migration

If you are using one of our legacy libraries, we recommend that you [migrate to the new libraries](/gemini-api/docs/migrate).

The legacy libraries don't provide access to recent features (such as [Live API](/gemini-api/docs/live) and [Veo](/gemini-api/docs/video)) and are on a deprecation path. They will stop receiving updates on November 30th, 2025, the feature gaps will grow and potential bugs may no longer get fixed.

Each legacy library's support status varies, detailed in the following table:

   
| Language | Legacy library | Support status | Recommended library |
| --- | --- | --- | --- |
| **Python** | `[google-generativeai](https://github.com/google-gemini/deprecated-generative-ai-python)` | All support, including bug fixes, ends on November 30th, 2025. | `[google-genai](https://github.com/googleapis/python-genai)` |
| **JavaScript/TypeScript** | `[@google/generativeai](https://github.com/google-gemini/generative-ai-js)` | All support, including bug fixes, ends on November 30th, 2025. | `[@google/genai](https://github.com/googleapis/js-genai)` |
| **Go** | `[google.golang.org/generative-ai](https://github.com/google/generative-ai-go)` | All support, including bug fixes, ends on November 30th, 2025. | `[google.golang.org/genai](https://github.com/googleapis/go-genai)` |
| **Dart and Flutter** | `[google_generative_ai](https://pub.dev/packages/google_generative_ai/install)` | Not actively maintained | Use trusted community or third party libraries, like [firebase\_ai](https://pub.dev/packages/firebase_ai), or access using REST API |
| **Swift** | `[generative-ai-swift](https://github.com/google/generative-ai-swift)` | Not actively maintained | Use [Firebase AI Logic](https://firebase.google.com/products/firebase-ai-logic) |
| **Android** | `[generative-ai-android](https://github.com/google-gemini/generative-ai-android)` | Not actively maintained | Use [Firebase AI Logic](https://firebase.google.com/products/firebase-ai-logic) |

**Note for Java developers:** There was no legacy Google-provided Java SDK for the Gemini API, so no migration from a previous Google library is required. You can start directly with the new library in the [Language support and installation](#install) section.

## Prompt templates for code generation

Generative models (e.g., Gemini, Claude) and AI-powered IDEs (e.g., Cursor) may produce code for the Gemini API using outdated or deprecated libraries due to their training data cutoff. For the generated code to use the latest, recommended libraries, provide version and usage guidance directly in your prompts. You can use the templates below to provide the necessary context:

*   [Python](https://github.com/googleapis/python-genai/blob/main/codegen_instructions.md)
    
*   [JavaScript/TypeScript](https://github.com/googleapis/js-genai/blob/main/codegen_instructions.md)
    

Send feedback

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2025-11-10 UTC.
