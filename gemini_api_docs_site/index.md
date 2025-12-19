# Gemini API  |  Google AI for Developers

Source: https://ai.google.dev/gemini-api/docs

/\* Styles inlined from /site-assets/css/models.css \*/ :root { --gemini-api-table-font-color: #3c4043; --gemini-api-model-font: 'Google Sans Text', Roboto, sans-serif; --gemini-api-card-width: 17rem; --gemini-api-elevation-1dp: 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 3px 0 rgba(0, 0, 0, 0.2); --gemini-api-elevation-3dp: 0 3px 4px 0 rgba(0, 0, 0, 0.14), 0 3px 3px -2px rgba(0, 0, 0, 0.12), 0 1px 8px 0 rgba(0, 0, 0, 0.2); } body\[theme="googledevai-theme"\] { --googledevai-button-gradient: var(--googledevai-button-gradient-light); } body\[theme="googledevai-theme"\].color-scheme--dark { --googledevai-button-gradient: var(--googledevai-button-gradient-dark); } .google-symbols { background: -webkit-linear-gradient(45deg, var(--googledevai-blue), var(--googledevai-purple)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; user-select: none; vertical-align: bottom; } /\* Cards \*/ @media only screen and (min-width: 625px) { .gemini-api-recommended { display: grid; grid-template-columns: repeat(3, 1fr); /\* Three equal-width columns \*/ grid-column-gap: 3rem; /\* Keep the gap between columns \*/ } } .gemini-api-recommended { width: 100%; /\* Take full width of parent \*/ margin: 0 auto; } .gemini-api-card { background: var(--devsite-background-1); border: 1px solid var(--googledevai-border-color); border-radius: 9px; box-shadow: var(--gemini-api-elevation-1dp); height: 23rem; margin: 1rem .5rem; padding: 1rem; transition: box-shadow 0.3s ease-in-out; width: var(--gemini-api-card-width); } .color-scheme--dark .gemini-api-card { background: #131314; border-color: #444746; } .gemini-api-card:hover { box-shadow: var(--gemini-api-elevation-3dp); } .gemini-api-card a:empty { display: block; position: relative; height: 23rem; width: var(--gemini-api-card-width); top: -22.8rem; left: -1rem; } .gemini-api-card a:empty:focus { border: 2px solid var(--devsite-primary-color); border-radius: 9px; } .gemini-api-card-title { font-family: "Google Sans", Roboto, sans-serif; font-size: 1.3rem; font-weight: 500; height: 1.5rem; margin-bottom: 2.5rem; line-height: 1.3rem; } .gemini-api-card-description { font-size: .9rem; height: 7.5rem; overflow: hidden; text-overflow: ellipsis; white-space: normal; } .gemini-api-card-bulletpoints { color: #757575; font-size: .8rem; height: 8.2rem; margin-left: 1rem; padding: 0; } .color-scheme--dark .gemini-api-card-bulletpoints { color: var(--devsite-primary-text-color); } .gemini-api-card-description, .gemini-api-card-bulletpoints { font-family: var(--gemini-api-model-font); } .gemini-api-card-bulletpoints li { line-height: 1rem; margin: .3rem 0; } /\* Tables \*/ .gemini-api-model-table, .gemini-api-model-table th { color: var(--gemini-api-table-font-color); font: .95rem var(--gemini-api-model-font); } .color-scheme--dark .gemini-api-model-table, .color-scheme--dark .gemini-api-model-table th { color: var(--devsite-primary-text-color); } .gemini-api-model-table th { font-weight: 500; } .gemini-api-model-table td:first-child { max-width: 0; } .gemini-api-model-table-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr)); grid-gap: 1rem .5rem; } .gemini-api-model-table section { display: inline-grid; } .gemini-api-model-table p { margin: 0 0 .5rem; } .gemini-api-model-table li { margin: 0; } .gemini-api-model-table ul { margin-top: .5rem; } .gemini-api-model-table .google-symbols { margin-right: .7rem; vertical-align: middle; } .gemini-api-supported, .gemini-api-not-supported, .gemini-api-experimental { border-radius: 8px; display: inline-block; font-size: .9rem; font-weight: 500; line-height: 1rem; padding: .3rem 0.5em; } .gemini-api-supported { background: #e6f4ea; /\* GM3 Green 50 \*/ color: #177d37; /\* GM3 Green 700 \*/ } .gemini-api-not-supported { background: #fce8e6; /\* GM3 Red 50 \*/ color: #c5221f; /\* GM3 Red 700 \*/ } .gemini-api-experimental { background: #e8def8; color: #4a4458; } .color-scheme--dark .gemini-api-supported { background: #177d37; /\* GM3 Green 700 \*/ color: #e6f4ea; /\* GM3 Green 50 \*/ } .color-scheme--dark .gemini-api-not-supported { background: #c5221f; /\* GM3 Red 700 \*/ color: #fce8e6; /\* GM3 Red 50 \*/ } /\* Buttons \*/ .gemini-api-model-button { background: var(--googledevai-button-gradient); background-size: 300% 300%; border-radius: 20rem; color: #001d35; font-family: var(--gemini-api-model-font); font-size: .9rem; font-weight: 500; padding: .6rem 1rem; text-align: center; text-decoration: none; transition: filter .2s ease-in-out, box-shadow .2s ease-in-out; } .gemini-api-model-button:hover{ animation: gradient 5s ease infinite; filter: brightness(.98); box-shadow: var(--gemini-api-elevation-1dp); } .gemini-api-model-button:focus { filter: brightness(.95); outline: #00639b solid 3px; outline-offset: 2px; text-decoration: none; } .gemini-api-model-button::before { content: 'spark'; font-family: 'Google Symbols'; padding-right: 0.5rem; vertical-align: middle; } @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } } .model-card { display: flex; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; margin-bottom: 1.5rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); transition: box-shadow 0.3s ease; } .color-scheme--dark .model-card { background-color: #3c4043; } .model-card:hover { box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); } .card-content { padding: 2.5rem; flex: 1; } .sub-heading-model { font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 0.5rem 0; } .color-scheme--dark .sub-heading-model { color: var(--devsite-primary-text-color); } .card-content h2 { font-size: 2rem; font-weight: 500; margin: 0 0 1rem 0; } .description { font-size: 1rem; line-height: 1.6; color: #3c4043; margin: 0 0 1.5rem 0; } .color-scheme--dark .description { color: var(--devsite-primary-text-color); } .card-content a:not(.gemini-api-model-button) { color: #1a73e8; text-decoration: none; font-weight: 600; } .card-content a:hover { text-decoration: underline; } @media (max-width: 768px) { .model-card { flex-direction: column; } .card-content { padding: 1.5rem; } h1 { font-size: 2rem; } .card-content h2 { font-size: 1.5rem; } } /\* Styles inlined from /site-assets/css/overview.css \*/ .button-primary { border-radius: 0.375rem; } .code-snippet { background-color: #f5f5f5; padding: 1rem; border-radius: 4px; overflow: auto; } .code-snippet code { font-family: monospace; } .quickstart { align-items: center; display: flex; flex-direction: row; padding-bottom: 1rem; } .quickstart p { margin: 0; } .quickstart-blurb { margin-left: 1rem; padding-left: 1rem; border-left: 2px solid var(--googledevai-border-color); } .gemini-api-card-overview { background: var(--devsite-background-1); border: 1px solid var(--googledevai-border-color); border-radius: 8px; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); color: var(--devsite-primary-text-color); padding: 1rem; text-decoration: none; transition: box-shadow 0.3s ease-in-out; } .gemini-api-card-overview:active, .gemini-api-card-overview:focus { text-decoration: none; border-color: var(--devsite-primary-color); } .gemini-api-card-overview:hover { box-shadow: var(--gemini-api-elevation-3dp); } .gemini-api-card-title { align-items: center; display: flex; font-size: 1rem; height: auto; /\* Override the setting for now in models.css \*/ margin: 0 0 0.75rem 0; } .gemini-api-card-overview .google-symbols { font-size: 18px; } .gemini-api-card-overview .google-symbols.spark { font-size: 16px; } .gemini-api-card-overview .ais-logo { height: 16px; user-select: none; } .gemini-api-card-overview .ais-logo, .gemini-api-card-overview .google-symbols, .gemini-api-card-overview .nano-banana { margin-right: 0.5rem; } .gemini-api-card-overview.with-links { display: flex; flex-direction: column; justify-content: space-between; } .gemini-api-card-description { margin: 0; height: auto; /\* Override the setting for now in models.css \*/ } .gemini-api-card-description-cta { color: var(--devsite-link-color); margin: 1rem 0 0 0; } .blue-bold-card { display: flex; flex-direction: row; gap: 0.5rem; } .icon-background { display: flex; border-radius: 8px; padding: 0.5rem; background-color: rgb(from var(--devsite-link-background) r g b / 40%); } .icon-background .google-symbols { margin: 0; } /\* Add this to prevent the button from getting squashed on any screen size \*/ .quickstart .button-primary { flex-shrink: 0; /\* Critical: Never let this element shrink \*/ white-space: nowrap; /\* Critical: Keep text on one line \*/ min-width: max-content; /\* Ensure it takes up as much space as the text needs \*/ } @media only screen and (min-width: 625px) { .gemini-api-recommended { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; } } @media only screen and (max-width: 625px) { /\* 1. Standard Card Resets for Mobile \*/ .gemini-api-card-overview { display: block; margin: 1rem 0; } .gemini-api-card-title { margin: 0 0 0.25rem 0; } .blue-bold-card { display: flex; } /\* 2. Quickstart Split Layout (Text -> Button -> Text) \*/ .quickstart { flex-direction: column; align-items: flex-start; gap: 1rem; } /\* "Unwrap" the text container so we can reorder paragraphs individually \*/ .quickstart-blurb { display: contents; } /\* Order 1: The first paragraph ("Follow our Quickstart...") \*/ .quickstart-blurb p:first-child { order: 1; } /\* Order 2: The Button \*/ .quickstart .button-primary { order: 2; } /\* Order 3: The second paragraph ("For most models...") \*/ .quickstart-blurb p:last-child { order: 3; } }

Gemini 3 Pro is here. [Try it for free in Google AI Studio](https://aistudio.google.com?model=gemini-3-pro-preview).

*   [Home](https://ai.google.dev/)
*   [Gemini API](https://ai.google.dev/gemini-api)
*   [Gemini API Docs](https://ai.google.dev/gemini-api/docs)

# Gemini API

The developer platform to build and scale with Google's latest AI models. Start in minutes.

### Python

```
from google import genai

client = genai.Client()

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Explain how AI works in a few words",
)

print(response.text)
```

### JavaScript

```
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
}

await main();
```

### Go

```
package main

import (
    "context"
    "fmt"
    "log"
    "google.golang.org/genai"
)

func main() {
    ctx := context.Background()
    client, err := genai.NewClient(ctx, nil)
    if err != nil {
        log.Fatal(err)
    }

    result, err := client.Models.GenerateContent(
        ctx,
        "gemini-2.5-flash",
        genai.Text("Explain how AI works in a few words"),
        nil,
    )
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println(result.Text())
}
```

### Java

```
package com.example;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;

public class GenerateTextFromTextInput {
  public static void main(String[] args) {
    Client client = new Client();

    GenerateContentResponse response =
        client.models.generateContent(
            "gemini-2.5-flash",
            "Explain how AI works in a few words",
            null);

    System.out.println(response.text());
  }
}
```

### C#

```
using System.Threading.Tasks;
using Google.GenAI;
using Google.GenAI.Types;

public class GenerateContentSimpleText {
  public static async Task main() {
    var client = new Client();
    var response = await client.Models.GenerateContentAsync(
      model: "gemini-2.5-flash", contents: "Explain how AI works in a few words"
    );
    Console.WriteLine(response.Candidates[0].Content.Parts[0].Text);
  }
}
```

### REST

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

[Start building](/gemini-api/docs/quickstart)

Follow our Quickstart guide to get an API key and make your first API call in minutes.

For most models, you can start with our free tier, without having to set up a billing account.

* * *

## Meet the models

[

auto\_awesome Gemini 3 Pro

Our most intelligent model, the best in the world for multimodal understanding, all built on state-of-the-art reasoning.

](/gemini-api/docs/models#gemini-3-pro)[

video\_library Veo 3.1

Our state-of-the-art video generation model, with native audio.

](/gemini-api/docs/video)[

🍌 Nano Banana and Nano Banana Pro

State-of-the-art image generation and editing models.

](/gemini-api/docs/image-generation)[

spark Gemini 2.5 Pro

Our powerful reasoning model, which excels at coding and complex reasonings tasks.

](/gemini-api/docs/models#gemini-2.5-pro)[

spark Gemini 2.5 Flash

Our most balanced model, with a 1 million token context window and more.

](/gemini-api/docs/models/gemini#gemini-2.5-flash)[

spark Gemini 2.5 Flash-Lite

Our fastest and most cost-efficient multimodal model with great performance for high-frequency tasks.

](/gemini-api/docs/models/gemini#gemini-2.5-flash-lite)

## Explore Capabilities

[

imagesmode

Native Image Generation (Nano Banana)

Generate and edit highly contextual images natively with Gemini 2.5 Flash Image.



](/gemini-api/docs/image-generation)[

article

Long Context

Input millions of tokens to Gemini models and derive understanding from unstructured images, videos, and documents.



](/gemini-api/docs/long-context)[

code

Structured Outputs

Constrain Gemini to respond with JSON, a structured data format suitable for automated processing.



](/gemini-api/docs/structured-output)[

functions

Function Calling

Build agentic workflows by connecting Gemini to external APIs and tools.



](/gemini-api/docs/function-calling)[

videocam

Video Generation with Veo 3.1

Create high-quality video content from text or image prompts with our state-of-the-art model.



](/gemini-api/docs/video)[

android\_recorder

Voice Agents with Live API

Build real-time voice applications and agents with the Live API.



](/gemini-api/docs/live)[

build

Tools

Connect Gemini to the world through built-in tools like Google Search, URL Context, Google Maps, Code Execution and Computer Use.



](/gemini-api/docs/tools)[

stacks

Document Understanding

Process up to 1000 pages of PDF files with full multimodal understanding or other text-based file types.



](/gemini-api/docs/document-processing)[

cognition\_2

Thinking

Explore how thinking capabilities improve reasoning for complex tasks and agents.



](/gemini-api/docs/thinking)

## Resources

[

Google AI Studio

Test prompts, manage your API keys, monitor usage, and build prototypes in platform for AI builders.

Open Google AI Studio

](https://aistudio.google.com)[

group Developer Community

Ask questions and find solutions from other developers and Google engineers.

Join the community

](https://discuss.ai.google.dev/c/gemini-api/4)[

menu\_book API Reference

Find detailed information about the Gemini API in the official reference documentation.

Read the API reference

](/api)

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2025-11-29 UTC.
