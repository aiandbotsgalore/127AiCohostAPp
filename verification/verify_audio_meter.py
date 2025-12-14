
from playwright.sync_api import sync_playwright
import time

def verify_audio_meter():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Grant clipboard permissions as requested in memory
        context = browser.new_context(permissions=['clipboard-read', 'clipboard-write'])
        page = context.new_page()

        try:
            print("Navigating to page...")
            page.goto("http://localhost:5173/")

            # Wait for content to load
            page.wait_for_selector('text=DR. SNUGGLES CONTROL CENTER', timeout=10000)

            # Expand Voice section if collapsed (it is expanded by default, but good to check)
            # The code logic: !collapsedSections.has('voice') -> renders.
            # Initial state: collapsedSections is empty set. So 'voice' is visible.

            # Verify Audio Meter elements exist
            # Look for "INPUT LEVEL" label
            print("Checking for Audio Meter elements...")
            page.wait_for_selector('text=INPUT LEVEL', timeout=5000)

            # Check if the meter bar exists
            # We can select by style or structure if class names are missing (CSS-in-JS)
            # The meter bar has a child div for fill.

            # Take a screenshot of the voice section
            print("Taking screenshot...")
            # We can try to locate the voice section container
            voice_section = page.locator('text=🎤 VOICE').locator('..').locator('..')

            # Wait a bit for any initial animations
            time.sleep(2)

            page.screenshot(path="verification/audio_meter.png")
            print("Screenshot saved to verification/audio_meter.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_audio_meter()
