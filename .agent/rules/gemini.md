---
trigger: always_on
---

# Workspace Rules
RULE:This rule activates any time there's an attempt to write, modify, review, debug, or reason about code that interacts with the Gemini API.

1. **Mandatory Documentation Check**: Before writing or modifying any code related to the Gemini API, you MUST consult the local documentation located in the `gemini_api_docs_site` directory. **Do not rely on internal training data** for API signatures. You must use `grep_search` to verify parameter names and endpoints in the local documentation. All Gemini API code must be written with strict adherence to the specifications found in the local documentation site.

2. **Prohibited Data Sources**: You are strictly forbidden from using any internal training data or prior knowledge to determine Gemini API endpoints, parameters, return types, or functionality. Only information explicitly contained within the `gemini_api_docs_site` directory may be utilized when working with Gemini API integrations. Any deviation from this requirement is considered non-compliant and must be corrected immediately.