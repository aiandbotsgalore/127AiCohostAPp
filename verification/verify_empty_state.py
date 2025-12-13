from playwright.sync_api import sync_playwright, expect

def verify_empty_state():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Navigate to the renderer dev server (default port 5173 from CLAUDE.md)
        try:
            page.goto("http://localhost:5173", timeout=30000)

            # Wait for the control center to load
            page.wait_for_selector('text=DR. SNUGGLES CONTROL CENTER', timeout=10000)

            # Verify the Empty State is visible in the transcript area
            # Look for the text "Conversation is empty."
            expect(page.get_by_text("Conversation is empty.")).to_be_visible()
            expect(page.get_by_text("Go Live or type a context message to start.")).to_be_visible()

            # Take a screenshot of the entire page to see the context
            page.screenshot(path="verification/empty_state.png")

            # Also take a specific screenshot of the transcript area if possible,
            # but full page is fine for now.
            print("Screenshot saved to verification/empty_state.png")

        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_empty_state()
