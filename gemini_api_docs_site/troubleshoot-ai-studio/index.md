# Troubleshoot Google AI Studio  |  Gemini API  |  Google AI for Developers

Source: https://ai.google.dev/gemini-api/docs/troubleshoot-ai-studio

Gemini 3 Pro is here. [Try it for free in Google AI Studio](https://aistudio.google.com?model=gemini-3-pro-preview).

*   [Home](https://ai.google.dev/)
*   [Gemini API](https://ai.google.dev/gemini-api)
*   [Gemini API Docs](https://ai.google.dev/gemini-api/docs)

Send feedback

# Troubleshoot Google AI Studio

This page provides suggestions for troubleshooting Google AI Studio if you encounter issues.

## Understand 403 Access Restricted errors

If you see a 403 Access Restricted error, you are using Google AI Studio in a way that does not follow the [Terms of Service](/terms). One common reason is you are not located in a [supported region](/available_regions).

## Resolve No Content responses on Google AI Studio

A warning **No Content** message appears on Google AI Studio if the content is blocked for any reason. To see more details, hold the pointer over **No Content** and click warning **Safety**.

If the response was blocked due to [safety settings](/docs/safety_setting) and you considered the [safety risks](/docs/safety_guidance) for your use case, you can modify the [safety settings](/docs/safety_setting#safety_settings_in_makersuite) to influence the returned response.

If the response was blocked but not due to the safety settings, the query or response may violate the [Terms of Service](/terms) or be otherwise unsupported.

## Check token usage and limits

When you have a prompt open, the **Text Preview** button at the bottom of the screen shows the current tokens used for the content of your prompt and the maximum token count for the model being used.

Send feedback

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2025-09-22 UTC.
