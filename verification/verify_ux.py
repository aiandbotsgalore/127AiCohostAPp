
import time
from playwright.sync_api import sync_playwright

def verify_ux_changes():
    with sync_playwright() as p:
        # Launch browser
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to app
        try:
            print("Navigating to app...")
            page.goto("http://localhost:5173")

            # Wait for app to load
            print("Waiting for app to load...")
            page.wait_for_selector('text=DR. SNUGGLES CONTROL CENTER', timeout=10000)

            # 1. Verify ARIA labels on collapse buttons
            print("Verifying ARIA labels...")

            # Voice section
            voice_btn = page.locator('button[aria-label="Collapse voice section"]')
            if voice_btn.count() == 0:
                voice_btn = page.locator('button[aria-label="Expand voice section"]')

            print(f"Voice button found: {voice_btn.count() > 0}")
            if voice_btn.count() > 0:
                print(f"Voice button label: {voice_btn.get_attribute('aria-label')}")

            # Toggle voice section
            if voice_btn.count() > 0:
                voice_btn.click()
                time.sleep(0.5)
                # Check if label changed
                new_label = page.locator('button').filter(has_text='▼').first.get_attribute('aria-label') # Assuming it changes to arrow
                # Actually, my code changes the label based on state.
                # Re-locate by the new label to verify it updated
                expanded_btn = page.locator('button[aria-label="Expand voice section"]')
                collapsed_btn = page.locator('button[aria-label="Collapse voice section"]')

                if expanded_btn.count() > 0:
                     print("Voice section successfully collapsed (found 'Expand' label)")
                elif collapsed_btn.count() > 0:
                     print("Voice section successfully expanded (found 'Collapse' label)")

            # 2. Verify Fact Checker Empty State
            print("Verifying Fact Checker empty state...")

            # Ensure Fact Checker is expanded
            facts_section_btn = page.locator('button[aria-label="Expand fact checker section"]')
            if facts_section_btn.count() > 0:
                facts_section_btn.click()
                time.sleep(0.5)

            # Look for empty state text
            empty_state_text = page.locator('text=No fact checks yet.')
            print(f"Empty state text visible: {empty_state_text.is_visible()}")

            # Take screenshot of the whole page, but scroll to fact checker if possible
            # Just take full page screenshot
            print("Taking screenshot...")
            page.screenshot(path="verification/ux_verification.png", full_page=True)

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_ux_changes()
