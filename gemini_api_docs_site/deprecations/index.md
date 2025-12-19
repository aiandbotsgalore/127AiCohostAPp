# Gemini deprecations  |  Gemini API  |  Google AI for Developers

Source: https://ai.google.dev/gemini-api/docs/deprecations

/\* Styles inlined from /site-assets/css/pricing.css \*/ /\* Pricing table styles \*/ .pricing-table { border-collapse: separate; border-spacing: 0; border-radius: 8px; overflow: hidden; } .pricing-table th { background-color: #f2f2f2; text-align: left; padding: 8px; } /\* Set the second and after (of three total) columns to 35% width. \*/ .pricing-table th:nth-child(n+2) { width: 35%; } /\* These should use theme colours for light too, so we don't \* need an override. \*/ .color-scheme--dark .pricing-table th { background-color: var(--devsite-ref-palette--grey800); } .pricing-table td { padding: 8px; } .free-tier { background-color: none; } .paid-tier { background-color: #eff5ff; } .color-scheme--dark .paid-tier { background-color: var(--devsite-background-5); } .pricing-table th:first-child { border-top-left-radius: 8px; } .pricing-table th:last-child { border-top-right-radius: 8px; } .pricing-table tr:last-child td:first-child { border-bottom-left-radius: 8px; } .pricing-table tr:last-child td:last-child { border-bottom-right-radius: 8px; } .pricing-container { max-width: 1100px; width: 100%; } .pricing-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; justify-content: center; } .pricing-card { background-color: #ffffff; border-radius: 16px; border: 1px solid #dadce0; padding: 2.5rem; display: flex; flex-direction: column; transition: all 0.3s ease; position: relative; } .color-scheme--dark .pricing-card { background-color: var(--devsite-ref-palette--grey800); } .plan-name { font-size: 1.75rem; font-weight: 700; margin: 0 0 0.5rem 0; } .plan-description { font-size: 1rem; color: #5f6368; margin: 0 0 2.5rem 0; line-height: 1.5; min-height: 80px; } .color-scheme--dark .plan-description { color: var(--devsite-primary-text-color); } .plan-description a { color: #1a73e8; text-decoration: none; } .plan-description a:hover { text-decoration: underline; } .features { list-style: none; padding: 0; margin: 0 0 2rem 0; } .features li { display: flex; align-items: flex-start; margin-bottom: 1.25rem; font-size: 1rem; line-height: 1.5; color: #3c4043; } .features li.feature-description { display: block; color: #5f6368; } .features li a { color: #1a73e8; text-decoration: none; margin-left: 4px; } .features li .material-symbols-outlined { font-size: 24px; margin-right: 0.75rem; color: #3c4043; margin-top: 2px; } .color-scheme--dark .features li, .features li .material-symbols-outlined { color: var(--devsite-primary-text-color); } .cta-button { display: inline-block; text-align: center; text-decoration: none; width: 100%; padding: 0.75rem 1rem; border-radius: 8px; font-size: 1rem; font-weight: 500; cursor: pointer; transition: background-color 0.2s ease; box-sizing: border-box; border: 1px solid #dadce0; background-color: #fff; color: #1a73e8; margin-top: auto; } .cta-button:hover { background-color: rgba(66, 133, 244, 0.05); } .pricing-card.recommended { border: 2px solid #1a73e8; overflow: hidden; } .pricing-card.recommended::before { position: absolute; top: 22px; right: -32px; width: 120px; height: 30px; background-color: #1a73e8; color: white; display: flex; justify-content: center; align-items: center; font-size: 0.8rem; font-weight: 600; transform: rotate(45deg); z-index: 1; } .heading-group { display: flex; flex-direction: column; } .heading-group h2 { margin-bottom: 0; } .heading-group em { margin-top: 0; }

Gemini 3 Pro is here. [Try it for free in Google AI Studio](https://aistudio.google.com?model=gemini-3-pro-preview).

*   [Home](https://ai.google.dev/)
*   [Gemini API](https://ai.google.dev/gemini-api)
*   [Gemini API Docs](https://ai.google.dev/gemini-api/docs)

Send feedback

# Gemini deprecations

This page lists the known deprecation schedules for stable (GA) models in the Gemini API. A "**deprecation**" is the announcement that we no longer provide support for a model, and that it will be "**shut down**" in the near future. Once a model is "**shutdown**", it is completely turned off, and the endpoint is no longer available.

[Preview model](/gemini-api/docs/models#preview) deprecations are documented on the [Release notes](/gemini-api/docs/changelog) page.

## Gemini 2.0 models

| **Model** | **Release date** | **Shutdown date** | **Recommended replacement** |
| --- | --- | --- | --- |
| `gemini-2.0-flash` | February 5, 2025 | Earliest February 2026 | `gemini-2.5-flash` |
| `gemini-2.0-flash-001` | February 5, 2025 | Earliest February 2026 | `gemini-2.5-flash` |
| `gemini-2.0-flash-lite` | February 25, 2025 | Earliest February 2026 | `gemini-2.5-flash-lite` |
| `gemini-2.0-flash-lite-001` | February 25, 2025 | Earliest February 2026 | `gemini-2.5-flash-lite` |

## Gemini 2.5 Flash models

| **Model** | **Release date** | **Shutdown date** | **Recommended replacement** |
| --- | --- | --- | --- |
| `gemini-2.5-flash` | June 17, 2025 | Earliest June 2026 |  |
| `gemini-2.5-flash-image` | October 2, 2025 | Earliest October 2026 |  |
| `gemini-2.5-flash-lite` | July 22, 2025 | Earliest July 2026 |  |

## Gemini 2.5 Pro models

| **Model** | **Release date** | **Shutdown date** | **Recommended replacement** |
| --- | --- | --- | --- |
| `gemini-2.5-pro` | June 17, 2025 | Earliest June 2026 | `gemini-3-pro` |

## Recently deprecated

### Imagen 3 models

| **Model** | **Release date** | **Shutdown date** | **Recommended replacement** |
| --- | --- | --- | --- |
| `imagen-3.0-generate-002` | February 6, 2025 | November 10, 2025 | `imagen-4.0-generate-001` |

Send feedback

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2025-12-02 UTC.
