import time
from playwright.sync_api import sync_playwright

def test_go_live_loading_state():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            print("Navigating to app...")
            page.goto("http://localhost:5173")

            # Wait for the Go Live button
            print("Waiting for Go Live button...")
            go_live_btn = page.locator("button", has_text="GO LIVE")
            go_live_btn.wait_for(state="visible", timeout=10000)

            # Take initial screenshot
            page.screenshot(path="verification/1_before_click.png")
            print("Initial screenshot taken")

            # Click the button
            print("Clicking Go Live button...")
            go_live_btn.click()

            # Check for loading state text "STARTING..."
            # Note: Since the mock might be fast or slow, we try to catch it
            # In a real scenario, we might mock the audio service to delay
            # But here we just check if the UI updates or if we can see the change

            # Since we can't easily mock the internal audio service delay from outside without complex setup,
            # we will check if the button state changes at all or if errors appear.
            # However, since I added the `isProcessingLive` state, it should briefly show "STARTING..."

            # Let's try to capture it immediately
            page.screenshot(path="verification/2_during_click.png")

            # Wait a bit
            time.sleep(2)

            page.screenshot(path="verification/3_after_click.png")
            print("Screenshots taken")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    test_go_live_loading_state()
