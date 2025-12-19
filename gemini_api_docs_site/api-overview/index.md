# Gemini API reference  |  Google AI for Developers

Source: https://ai.google.dev/gemini-api/docs/api-overview

/\* Styles inlined from /site-assets/css/style.css \*/ body\[theme="googledevai-theme"\] { --devsite-background-0: var(--devsite-background-1); --devsite-button-border: 1px solid #747775; --devsite-button-border-radius: 20rem; --devsite-button-font: 500 14px/36px 'Google Sans Text', Roboto, sans-serif; --devsite-code-font-family: 'Google Sans Mono', Roboto Mono, monospace; --devsite-primary-font-family: 'Google Sans Text', Roboto, sans-serif; --devsite-table-heading-font: 500 14px/20px 'Google Sans Text', Roboto, sans-serif; --googledevai-border-color: #c4c7c5; --googledevai-blue-light: #d7e6ff; --googledevai-blue-dark: #2e64de; --googledevai-cyan-light: #c7e4ff; --googledevai-cyan-dark: #3c8fe3; --googledevai-purple-light: #dce2ff; --googledevai-purple-dark: #987be9; --googledevai-purple: #ac87eb; --googledevai-red: #ee4d5d; --googledevai-secondary-text: #001d35; --googledevai-button-gradient-light: linear-gradient(90deg, var(--googledevai-blue-light), var(--googledevai-cyan-light), var(--googledevai-purple-light)); --googledevai-button-gradient-dark: linear-gradient(90deg, var(--googledevai-blue), var(--googledevai-cyan), var(--googledevai-purple)); } body\[theme="googledevai-theme"\]:not(\[type="reference"\]){ --googledevai-page-width: 1100px; } body\[layout=docs\]\[theme="googledevai-theme"\]:not(\[type="reference"\]) .devsite-main-content, body\[layout=docs\]\[theme="googledevai-theme"\]:not(\[type="reference"\]) .devsite-main-content\[has-book-nav\]\[has-sidebar\] { grid-template-columns: minmax(269px, 1fr) minmax(752px, var(--googledevai-page-width)) minmax(160px, 1fr); grid-gap: 3rem; } body\[layout=docs\]\[theme="googledevai-theme"\] devsite-content { max-width: var(--googledevai-page-width); } body\[layout=docs\]\[theme="googledevai-theme"\] .devsite-article { box-shadow: unset; } body\[theme="googledevai-theme"\] { --googledevai-header-gradient: linear-gradient(90deg, var(--googledevai-blue) 50%, var(--googledevai-cyan), var(--googledevai-purple), var(--googledevai-red)); } body\[theme="googledevai-theme"\].color-scheme--dark { --googledevai-header-gradient: linear-gradient(90deg, var(--googledevai-blue) 75%, var(--googledevai-cyan), var(--googledevai-purple)); --googledevai-border-color: #444746; } /\* Ensure that full-bleed pages get the full width. \*/ body\[theme="googledevai-theme"\]\[layout="full"\] .devsite-main-content { max-width: none; padding: 0; } /\* And ensure that any site banners/ACL warnings/etc don't get hidden on \* full-bleed pages. \*/ body\[theme="googledevai-theme"\]\[layout="full"\] .devsite-banner { margin: 0; } tab:has(> a.hidden-tab) { display: none; } body\[theme="googledevai-theme"\] devsite-toc > .devsite-nav-list { border-inline-start: unset; } /\* Banner notice \*/ \[layout=docs\] .devsite-banner:first-of-type { background: var(--googledevai-cyan-light); border-radius: 10px; color: var(--googledevai-secondary-text); margin: -2.5rem -0.25rem 2.5rem; display: flex; } /\* Banner notice smaller screens \*/ @media (max-width: 840px) { \[layout=docs\] .devsite-banner:first-of-type { margin: -0.25rem -0.25rem 2.5rem; } } /\* Asides \*/ .devsite-article-body>aside:not(\[class\*=attempt\]) { border-radius: 2px; } /\* Tables \*/ table:not(.tfo-notebook-buttons) { border: 1px solid var(--googledevai-border-color); border-collapse: unset; border-radius: 9px; margin: auto; width: 100%; } .gemini-api-model-table tr:not(:last-child) td:not(:first-child), .gemini-api-model-table tr:not(:last-child) th, th, table:not(.gemini-api-model-table):not(.tfo-notebook-buttons) tr:not(:last-child) td { border-bottom: 1px solid var(--googledevai-border-color); } th, td { background: transparent; padding: 1rem; } /\* Notebooks \*/ devsite-code .tfo-notebook-code-cell-output { max-height: 300px; overflow: auto; background: rgba(237, 247, 255, 1); /\* blue bg to distinguish from input code cells \*/ } devsite-code .tfo-notebook-code-cell-output + .devsite-code-buttons-container button { background: rgba(237, 247, 255, .7); /\* blue bg to distinguish from input code cells \*/ } .color-scheme--dark devsite-code .tfo-notebook-code-cell-output { background: rgba(var(--devsite-background-2), 1); } .color-scheme--dark devsite-code .tfo-notebook-code-cell-output + .devsite-code-buttons-container button { background: rgba(var(--devsite-background-2), .7); } devsite-code\[dark-code\] .tfo-notebook-code-cell-output { background: rgba(64, 78, 103, 1); /\* medium slate \*/ } devsite-code\[dark-code\] .tfo-notebook-code-cell-output + .devsite-code-buttons-container button { background: rgba(64, 78, 103, .7); /\* medium slate \*/ } .devsite-article-body>devsite-code { --devsite-code-buttons-container-right: 0; --devsite-code-margin: 0 0; --devsite-code-padding-block: 14px; border-radius: 8px; } .devsite-article-body>.beta:not(\[class\*=attempt\]), .devsite-article-body>.caution:not(\[class\*=attempt\]), .devsite-article-body>.deprecated:not(\[class\*=attempt\]), .devsite-article-body>.dogfood:not(\[class\*=attempt\]), .devsite-article-body>.experimental:not(\[class\*=attempt\]), .devsite-article-body>.key-point:not(\[class\*=attempt\]), .devsite-article-body>.key-term:not(\[class\*=attempt\]), .devsite-article-body>.note:not(\[class\*=attempt\]), .devsite-article-body>.objective:not(\[class\*=attempt\]), .devsite-article-body>.preview:not(\[class\*=attempt\]), .devsite-article-body>.special:not(\[class\*=attempt\]), .devsite-article-body>.success:not(\[class\*=attempt\]), .devsite-article-body>.tip:not(\[class\*=attempt\]), .devsite-article-body>.warning:not(\[class\*=attempt\]), .devsite-article-body>aside:not(\[class\*=attempt\]) { --devsite-notice-margin: 0 0; border-radius: 8px; } /\* override default table styles for notebook buttons \*/ .devsite-table-wrapper .tfo-notebook-buttons { display: block; width: auto; } .tfo-notebook-buttons td { display: inline-block; padding: 0 16px 16px 0; } /\* from DevSite's buttons.scss \*/ .tfo-notebook-buttons a, .tfo-notebook-buttons :link, .tfo-notebook-buttons :visited { -moz-appearance: none; -webkit-appearance: none; -webkit-box-align: center; -ms-flex-align: center; align-items: center; align-self: var(--devsite-button-align-self); background: var(--devsite-button-background, var(--devsite-background-1)); border: var(--devsite-button-border, 0); border-radius: var(--devsite-button-border-radius, 2px); box-sizing: border-box; color: var(--devsite-button-color); cursor: pointer; display: -webkit-box; display: -ms-flexbox; display: flex; font: var(--devsite-button-font, 500 14px/36px var(--devsite-primary-font-family)); height: var(--devsite-button-height, 36px); letter-spacing: var(--devsite-button-letter-spacing, 0); line-height: var(--devsite-button-line-height, 36px); margin: var(--devsite-button-margin, 0); margin-inline-end: var(--devsite-button-margin-x-end); max-width: var(--devsite-button-max-width, none); min-width: 36px; outline: 0; overflow: hidden; padding: var(--devsite-button-with-icon-padding, 0 16px); text-align: center; text-decoration: none; text-overflow: ellipsis; text-transform: var(--devsite-button-text-transform, uppercase); transition: background-color .2s, border .2s; vertical-align: middle; white-space: nowrap; width: var(--devsite-button-width, auto); } .tfo-notebook-buttons a:hover, .tfo-notebook-buttons a:focus { background: var(--devsite-button-background-hover); border: var(--devsite-button-border-hover, 0); color: var(--devsite-button-color-hover, var(--devsite-button-color)); text-decoration: var(--devsite-button-text-decoration-hover, none); } .tfo-notebook-buttons a:active { background: var(--devsite-button-background-active); border: var(--devsite-button-border-active, 0); transform: var(--devsite-button-transform-active, none); } .tfo-notebook-buttons tr { background: 0; border: 0; } /\* on rendered notebook page, remove link to webpage since we're already here \*/ .tfo-notebook-buttons:not(.tfo-api) td:first-child { display: none; } .tfo-notebook-buttons td > a > img { margin: 0 8px 0 -4px; height: 20px; } \[appearance='dark'\] .tfo-notebook-buttons td > a > img { filter: invert(1); } @media (prefers-color-scheme: dark) { \[appearance='device'\] .tfo-notebook-buttons td > a > img { filter: invert(1); } .sub-heading { background-color: #333; color: #bdbdbd; } } \[appearance='dark'\] .sub-heading { background-color: #333; color: #bdbdbd; } .sub-heading { background-color: #f2f2f2; color: #5f6368; } @media screen and (max-width: 600px) { .tfo-notebook-buttons td { display: block; } } devsite-nav-buttons button { margin-left: 0; margin-top: 5px; } code { border-radius: 6px } devsite-book-nav .devsite-nav-list>.devsite-nav-heading:not(.devsite-nav-divider) { border-top: 0; padding-bottom: 0.9rem; font-size: 1rem; } /\* \* TODO(b/439059414): Remove this workaround in favor of a project-level \* body\_class when possible. \*/ .ais-theme-marker { display: none; } /\* \* Gemini API body class. \* https://source.corp.google.com/piper///depot/google3/third\_party/devsite/googledevai/en/gemini-api/\_project.yaml;l=7 \*/ .gemini-api devsite-thumb-rating\[position="header"\], .gemini-api devsite-feedback\[position="header"\] { /\* Hide the thumb rating and feedback widgets at the top of the page. \*/ display: none; }

Gemini 3 Pro is here. [Try it for free in Google AI Studio](https://aistudio.google.com?model=gemini-3-pro-preview).

*   [Home](https://ai.google.dev/)
*   [Gemini API](https://ai.google.dev/gemini-api)
*   [API reference](https://ai.google.dev/api)

Send feedback

# Gemini API reference

This API reference describes the standard, streaming, and realtime APIs you can use to interact with the Gemini models. You can use the REST APIs in any environment that supports HTTP requests. Refer to the [Quickstart guide](https://ai.google.dev/gemini-api/docs/quickstart) for how to get started with your first API call. If you're looking for the references for our language-specific libraries and SDKs, go to the link for that language in the left navigation under **SDK references**.

## Primary endpoints

The Gemini API is organized around the following major endpoints:

*   **Standard content generation ([`generateContent`](/api/generate-content#method:-models.generatecontent)):** A standard REST endpoint that processes your request and returns the model's full response in a single package. This is best for non-interactive tasks where you can wait for the entire result.
*   **Streaming content generation ([`streamGenerateContent`](/api/generate-content#method:-models.streamGenerateContent)):** Uses Server-Sent Events (SSE) to push chunks of the response to you as they are generated. This provides a faster, more interactive experience for applications like chatbots.
*   **Live API ([`BidiGenerateContent`](/api/live#send-messages)):** A stateful WebSocket-based API for bi-directional streaming, designed for real-time conversational use cases.
*   **Batch mode ([`batchGenerateContent`](/api/batch-mode)):** A standard REST endpoint for submitting batches of `generateContent` requests.
*   **Embeddings ([`embedContent`](/api/embeddings)):** A standard REST endpoint that generates a text embedding vector from the input `Content`.
*   **Gen Media APIs:** Endpoints for generating media with our specialized models such as [Imagen for image generation](/api/models#method:-models.predict), and [Veo for video generation](/api/models#method:-models.predictlongrunning). Gemini also has these capabilities built in which you can access using the `generateContent` API.
*   **Platform APIs:** Utility endpoints that support core capabilities such as [uploading files](/api/files), and [counting tokens](/api/tokens).

## Authentication

All requests to the Gemini API must include an `x-goog-api-key` header with your API key. Create one with a few clicks in [Google AI Studio](https://aistudio.google.com/app/apikey).

The following is an example request with the API key included in the header:

```
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H 'Content-Type: application/json' \
  -X POST \
  -d '{
    "contents": [
      {
        "parts": [
          {
            "text": "Explain how AI works in a few words"
          }
        ]
      }
    ]
  }'
```

For instructions on how to pass your key to the API using Gemini SDKs, see the [Using Gemini API keys](/gemini-api/docs/api-key) guide.

## Content generation

This is the central endpoint for sending prompts to the model. There are two endpoints for generating content, the key difference is how you receive the response:

*   **[`generateContent`](/api/generate-content#method:-models.generatecontent) (REST)**: Receives a request and provides a single response after the model has finished its entire generation.
*   **[`streamGenerateContent`](/api/generate-content#method:-models.streamgeneratecontent) (SSE)**: Receives the exact same request, but the model streams back chunks of the response as they are generated. This provides a better user experience for interactive applications as it lets you display partial results immediately.

### Request body structure

The [request body](/api/generate-content#request-body) is a JSON object that is **identical** for both standard and streaming modes and is built from a few core objects:

*   [`Content`](/api/caching#Content) object: Represents a single turn in a conversation.
*   [`Part`](/api/caching#Part) object: A piece of data within a `Content` turn (like text or an image).
*   `inline_data` ([`Blob`](/api/caching#Blob)): A container for raw media bytes and their MIME type.

At the highest level, the request body contains a `contents` object, which is a list of `Content` objects, each representing turns in conversation. In most cases, for basic text generation, you will have a single `Content` object, but if you'd like to maintain conversation history, you can use multiple `Content` objects.

The following shows a typical `generateContent` request body:

```
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H 'Content-Type: application/json' \
  -X POST \
  -d '{
    "contents": [
      {
          "role": "user",
          "parts": [
              // A list of Part objects goes here
          ]
      },
      {
          "role": "model",
          "parts": [
              // A list of Part objects goes here
          ]
      }
    ]
  }'
```

### Response body structure

The [response body](/api/generate-content#response-body) is similar for both the streaming and standard modes except for the following:

*   Standard mode: The response body contains an instance of [`GenerateContentResponse`](/api/generate-content#v1beta.GenerateContentResponse).
*   Streaming mode: The response body contains a stream of [`GenerateContentResponse`](/api/generate-content#v1beta.GenerateContentResponse) instances.

At a high level, the response body contains a `candidates` object, which is a list of `Candidate` objects. The `Candidate` object contains a `Content` object that has the generated response returned from the model.

## Request examples

The following examples show how these components come together for different types of requests.

### Text-only prompt

A simple text prompt consists of a `contents` array with a single `Content` object. That object's `parts` array, in turn, contains a single `Part` object with a `text` field.

```
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H 'Content-Type: application/json' \
  -X POST \
  -d '{
    "contents": [
      {
        "parts": [
          {
            "text": "Explain how AI works in a single paragraph."
          }
        ]
      }
    ]
  }'
```

### Multimodal prompt (text and image)

To provide both text and an image in a prompt, the `parts` array should contain two `Part` objects: one for the text, and one for the image `inline_data`.

```
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" \
-H "x-goog-api-key: $GEMINI_API_KEY" \
-H 'Content-Type: application/json' \
-X POST \
-d '{
    "contents": [{
    "parts":[
        {
            "inline_data": {
            "mime_type":"image/jpeg",
            "data": "/9j/4AAQSkZJRgABAQ... (base64-encoded image)"
            }
        },
        {"text": "What is in this picture?"},
      ]
    }]
  }'
```

### Multi-turn conversations (chat)

To build a conversation with multiple turns, you define the `contents` array with multiple `Content` objects. The API will use this entire history as context for the next response. The `role` for each `Content` object should alternate between `user` and `model`.

**Note:** The client SDKs provide a chat interface that manages this list for you automatically. When using the REST API, you are responsible for maintaining the conversation history.

```
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H 'Content-Type: application/json' \
  -X POST \
  -d '{
    "contents": [
      {
        "role": "user",
        "parts": [
          { "text": "Hello." }
        ]
      },
      {
        "role": "model",
        "parts": [
          { "text": "Hello! How can I help you today?" }
        ]
      },
      {
        "role": "user",
        "parts": [
          { "text": "Please write a four-line poem about the ocean." }
        ]
      }
    ]
  }'
```

### Key takeaways

*   `Content` is the envelope: It's the top-level container for a message turn, whether it's from the user or the model.
*   `Part` enables multimodality: Use multiple `Part` objects within a single `Content` object to combine different types of data (text, image, video URI, etc.).
*   Choose your data method:
    *   For small, directly embedded media (like most images), use a `Part` with `inline_data`.
    *   For larger files or files you want to reuse across requests, use the File API to upload the file and reference it with a `file_data` part.
*   Manage conversation history: For chat applications using the REST API, build the `contents` array by appending `Content` objects for each turn, alternating between `"user"` and `"model"` roles. If you're using an SDK, refer to the SDK documentation for the recommended way to manage conversation history.

## Response examples

The following examples show how these components come together for different types of requests.

### Text-only response

A simple text response consists of a `candidates` array with one or more `content` objects that contain the model's response.

The following is an example of a **standard** response:

```
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "At its core, Artificial Intelligence works by learning from vast amounts of data ..."
          }
        ],
        "role": "model"
      },
      "finishReason": "STOP",
      "index": 1
    }
  ],
}
```

The following is series of **streaming** responses. Each response contains a `responseId` that ties the full response together:

```
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "The image displays"
          }
        ],
        "role": "model"
      },
      "index": 0
    }
  ],
  "usageMetadata": {
    "promptTokenCount": ...
  },
  "modelVersion": "gemini-2.5-flash-lite",
  "responseId": "mAitaLmkHPPlz7IPvtfUqQ4"
}

...

{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": " the following materials:\n\n*   **Wood:** The accordion and the violin are primarily"
          }
        ],
        "role": "model"
      },
      "index": 0
    }
  ],
  "usageMetadata": {
    "promptTokenCount": ...
  }
  "modelVersion": "gemini-2.5-flash-lite",
  "responseId": "mAitaLmkHPPlz7IPvtfUqQ4"
}
```

## Live API (BidiGenerateContent) WebSockets API

Live API offers a stateful WebSocket based API for bi-directional streaming to enable real-time streaming use cases. You can review [Live API guide](/gemini-api/docs/live) and the [Live API reference](/api/live) for more details.

## Specialized models

In addition to the Gemini family of models, Gemini API offers endpoints for specialized models such as [Imagen](/gemini-api/docs/imagen), [Lyria](/gemini-api/docs/music-generation) and [embedding](/gemini-api/docs/embeddings) models. You can check out these guides under the Models section.

## Platform APIs

The rest of the endpoints enable additional capabilities to use with the main endpoints described so far. Check out topics [Batch mode](/gemini-api/docs/batch-mode) and [File API](/gemini-api/docs/files) in the Guides section to learn more.

## What's next

If you're just getting started, check out the following guides, which will help you understand the Gemini API programming model:

*   [Gemini API quickstart](/gemini-api/docs/quickstart)
*   [Gemini model guide](/gemini-api/docs/models/gemini)

You might also want to check out the capabilities guides, which introduce different Gemini API features and provide code examples:

*   [Text generation](/gemini-api/docs/text-generation)
*   [Context caching](/gemini-api/docs/caching)
*   [Embeddings](/gemini-api/docs/embeddings)

Send feedback

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2025-09-08 UTC.
