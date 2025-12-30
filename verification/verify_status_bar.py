from playwright.sync_api import sync_playwright

def verify_status_bar():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the renderer
        page.goto("http://localhost:5173")

        # Wait for the status bar to be visible
        # We look for specific text elements in the status bar
        page.wait_for_selector("text=LATENCY")
        page.wait_for_selector("text=QUEUE DEPTH")
        page.wait_for_selector("text=PROCESSING DELAY")

        # Take a screenshot
        page.screenshot(path="verification/status_bar.png")

        browser.close()

if __name__ == "__main__":
    verify_status_bar()
