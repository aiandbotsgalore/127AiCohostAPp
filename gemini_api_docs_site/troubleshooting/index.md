# Troubleshooting guide  |  Gemini API  |  Google AI for Developers

Source: https://ai.google.dev/gemini-api/docs/troubleshooting

Gemini 3 Pro is here. [Try it for free in Google AI Studio](https://aistudio.google.com?model=gemini-3-pro-preview).

*   [Home](https://ai.google.dev/)
*   [Gemini API](https://ai.google.dev/gemini-api)
*   [Gemini API Docs](https://ai.google.dev/gemini-api/docs)

Send feedback

# Troubleshooting guide

Use this guide to help you diagnose and resolve common issues that arise when you call the Gemini API. You may encounter issues from either the Gemini API backend service or the client SDKs. Our client SDKs are open sourced in the following repositories:

*   [python-genai](https://github.com/googleapis/python-genai)
*   [js-genai](https://github.com/googleapis/js-genai)
*   [go-genai](https://github.com/googleapis/go-genai)

If you encounter API key issues, verify that you have set up your API key correctly per the [API key setup guide](/gemini-api/docs/api-key).

## Gemini API backend service error codes

The following table lists common backend error codes you may encounter, along with explanations for their causes and troubleshooting steps:

<table><tbody><tr><td><strong>HTTP Code</strong></td><td><strong>Status</strong></td><td><strong>Description</strong></td><td><strong>Example</strong></td><td><strong>Solution</strong></td></tr><tr><td>400</td><td>INVALID_ARGUMENT</td><td>The request body is malformed.</td><td>There is a typo, or a missing required field in your request.</td><td>Check the <a href="/api">API reference</a> for request format, examples, and supported versions. Using features from a newer API version with an older endpoint can cause errors.</td></tr><tr><td>400</td><td>FAILED_PRECONDITION</td><td>Gemini API free tier is not available in your country. Please enable billing on your project in Google AI Studio.</td><td>You are making a request in a region where the free tier is not supported, and you have not enabled billing on your project in Google AI Studio.</td><td>To use the Gemini API, you will need to setup a paid plan using <a href="https://aistudio.google.com/app/apikey">Google AI Studio</a>.</td></tr><tr><td>403</td><td>PERMISSION_DENIED</td><td>Your API key doesn't have the required permissions.</td><td>You are using the wrong API key; you are trying to use a tuned model without going through <a href="/docs/model-tuning/tutorial?lang=python#set_up_authentication">proper authentication</a>.</td><td>Check that your API key is set and has the right access. And make sure to go through proper authentication to use tuned models.</td></tr><tr><td>404</td><td>NOT_FOUND</td><td>The requested resource wasn't found.</td><td>An image, audio, or video file referenced in your request was not found.</td><td>Check if all <a href="/docs/troubleshooting#check-api">parameters in your request are valid</a> for your API version.</td></tr><tr><td>429</td><td>RESOURCE_EXHAUSTED</td><td>You've exceeded the rate limit.</td><td>You are sending too many requests per minute with the free tier Gemini API.</td><td>Verify that you're within the model's <a href="/gemini-api/docs/rate-limits">rate limit</a>. <a href="/gemini-api/docs/rate-limits#request-rate-limit-increase">Request a quota increase</a> if needed.</td></tr><tr><td>500</td><td>INTERNAL</td><td>An unexpected error occurred on Google's side.</td><td>Your input context is too long.</td><td>Reduce your input context or temporarily switch to another model (e.g. from Gemini 2.5 Pro to Gemini 2.5 Flash) and see if it works. Or wait a bit and retry your request. If the issue persists after retrying, please report it using the <b>Send feedback</b> button in Google AI Studio.</td></tr><tr><td>503</td><td>UNAVAILABLE</td><td>The service may be temporarily overloaded or down.</td><td>The service is temporarily running out of capacity.</td><td>Temporarily switch to another model (e.g. from Gemini 2.5 Pro to Gemini 2.5 Flash) and see if it works. Or wait a bit and retry your request. If the issue persists after retrying, please report it using the <b>Send feedback</b> button in Google AI Studio.</td></tr><tr><td>504</td><td>DEADLINE_EXCEEDED</td><td>The service is unable to finish processing within the deadline.</td><td>Your prompt (or context) is too large to be processed in time.</td><td>Set a larger 'timeout' in your client request to avoid this error.</td></tr></tbody></table>

## Check your API calls for model parameter errors

Verify that your model parameters are within the following values:

<table><tbody><tr><td><strong>Model parameter</strong></td><td><strong>Values (range)</strong></td></tr><tr><td>Candidate count</td><td>1-8 (integer)</td></tr><tr><td>Temperature</td><td>0.0-1.0</td></tr><tr><td>Max output tokens</td><td>Use <code translate="no" dir="ltr">get_model</code> (<a href="/api/python/google/generativeai/get_model">Python</a>) to determine the maximum number of tokens for the model you are using.</td></tr><tr><td>TopP</td><td>0.0-1.0</td></tr></tbody></table>

In addition to checking parameter values, make sure you're using the correct [API version](/gemini-api/docs/api-versions) (e.g., `/v1` or `/v1beta`) and model that supports the features you need. For example, if a feature is in Beta release, it will only be available in the `/v1beta` API version.

## Check if you have the right model

Verify that you are using a supported model listed on our [models page](/gemini-api/docs/models/gemini).

## Higher latency or token usage with 2.5 models

If you're observing higher latency or token usage with the 2.5 Flash and Pro models, this can be because they come with **thinking is enabled by default** in order to enhance quality. If you are prioritizing speed or need to minimize costs, you can adjust or disable thinking.

Refer to [thinking page](/gemini-api/docs/thinking#set-budget) for guidance and sample code.

## Safety issues

If you see a prompt was blocked because of a safety setting in your API call, review the prompt with respect to the filters you set in the API call.

If you see `BlockedReason.OTHER`, the query or response may violate the [terms of service](/terms) or be otherwise unsupported.

## Recitation issue

If you see the model stops generating output due to the RECITATION reason, this means the model output may resemble certain data. To fix this, try to make prompt / context as unique as possible and use a higher temperature.

When using Gemini 3 models, we strongly recommend keeping the `temperature` at its default value of 1.0. Changing the temperature (setting it below 1.0) may lead to unexpected behavior, such as looping or degraded performance, particularly in complex mathematical or reasoning tasks.

## Repetitive tokens issue

If you see repeated output tokens, try the following suggestions to help reduce or eliminate them.

  
| Description | Cause | Suggested workaround |
| --- | --- | --- |
| Repeated hyphens in Markdown tables | This can occur when the contents of the table are long as the model tries to create a visually aligned Markdown table. However, the alignment in Markdown is not necessary for correct rendering. | 
Add instructions in your prompt to give the model specific guidelines for generating Markdown tables. Provide examples that follow those guidelines. You can also try adjusting the temperature. For generating code or very structured output like Markdown tables, high temperature have shown to work better (>= 0.8).

The following is an example set of guidelines you can add to your prompt to prevent this issue:

          ```
          # Markdown Table Format
          
          * Separator line: Markdown tables must include a separator line below
            the header row. The separator line must use only 3 hyphens per
            column, for example: |---|---|---|. Using more hypens like
            ----, -----, ------ can result in errors. Always
            use |:---|, |---:|, or |---| in these separator strings.

            For example:

            | Date | Description | Attendees |
            |---|---|---|
            | 2024-10-26 | Annual Conference | 500 |
            | 2025-01-15 | Q1 Planning Session | 25 |

          * Alignment: Do not align columns. Always use |---|.
            For three columns, use |---|---|---| as the separator line.
            For four columns use |---|---|---|---| and so on.

          * Conciseness: Keep cell content brief and to the point.

          * Never pad column headers or other cells with lots of spaces to
            match with width of other content. Only a single space on each side
            is needed. For example, always do "| column name |" instead of
            "| column name                |". Extra spaces are wasteful.
            A markdown renderer will automatically take care displaying
            the content in a visually appealing form.
```
         |
| Repeated tokens in Markdown tables | Similar to the repeated hyphens, this occurs when the model tries to visually align the contents of the table. The alignment in Markdown is not required for correct rendering. | 

*   Try adding instructions like the following to your system prompt:
    
                ```
                FOR TABLE HEADINGS, IMMEDIATELY ADD ' |' AFTER THE TABLE HEADING.
    ```
              
*   Try adjusting the temperature. Higher temperatures (>= 0.8) generally helps to eliminate repetitions or duplication in the output.

 |
| Repeated newlines (`\n`) in structured output | When the model input contains unicode or escape sequences like `\u` or `\t`, it can lead to repeated newlines. | 

*   Check for and replace forbidden escape sequences with UTF-8 characters in your prompt. For example, `\u` escape sequence in your JSON examples can cause the model to use them in its output too.
*   Instruct the model on allowed escapes. Add a system instruction like this:
    
                ```
                In quoted strings, the only allowed escape sequences are \\, \n, and \". Instead of \u escapes, use UTF-8.
    ```
              

 |
| Repeated text in using structured output | When the model output has a different order for the fields than the defined structured schema, this can lead to repeating text. | 

*   Don't specify the order of fields in your prompt.
*   Make all output fields required.

 |
| Repetitive tool calling | This can occur if the model loses the context of previous thoughts and/or call an unavailable endpoint that it's forced to. | Instruct the model to maintain state within its thought process. Add this to the end of your system instructions:

        ```
        When thinking silently: ALWAYS start the thought with a brief
        (one sentence) recap of the current progress on the task. In
        particular, consider whether the task is already done.
```
       |
| Repetitive text that's not part of structured output | This can occur if the model gets stuck on a request that it can't resolve. | 

*   If thinking is turned on, avoid giving explicit orders for how to think through a problem in the instructions. Just ask for the final output.
*   Try a higher temperature >= 0.8.
*   Add instructions like "Be concise", "Don't repeat yourself", or "Provide the answer once".

 |

## Improve model output

For higher quality model outputs, explore writing more structured prompts. The [prompt engineering guide](/gemini-api/docs/prompting-strategies) page introduces some basic concepts, strategies, and best practices to get you started.

## Understand token limits

Read through our [Token guide](/gemini-api/docs/tokens) to better understand how to count tokens and their limits.

## Known issues

*   The API supports only a number of select languages. Submitting prompts in unsupported languages can produce unexpected or even blocked responses. See [available languages](/gemini-api/docs/models#supported-languages) for updates.

## File a bug

Join the discussion on the [Google AI developer forum](https://discuss.ai.google.dev) if you have questions.

Send feedback

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2025-11-27 UTC.
