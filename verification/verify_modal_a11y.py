from playwright.sync_api import sync_playwright

def verify_modal_a11y():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the app
        print("Navigating to app...")
        page.goto("http://localhost:5173")
        page.wait_for_load_state("networkidle")

        # Click "Clear Transcript" button (trash icon in Transcript section)
        # The button has aria-label="Clear transcript"
        print("Clicking Clear Transcript button...")
        clear_btn = page.locator('button[aria-label="Clear transcript"]')
        clear_btn.click()

        # Wait for modal to appear
        print("Waiting for modal...")
        modal = page.locator('div[role="dialog"]')
        modal.wait_for(state="visible")

        # Verify ARIA attributes
        print("Verifying ARIA attributes...")
        role = modal.get_attribute("role")
        aria_modal = modal.get_attribute("aria-modal")
        aria_labelledby = modal.get_attribute("aria-labelledby")
        aria_describedby = modal.get_attribute("aria-describedby")

        print(f"role: {role}")
        print(f"aria-modal: {aria_modal}")
        print(f"aria-labelledby: {aria_labelledby}")
        print(f"aria-describedby: {aria_describedby}")

        # Verify title ID matches
        title_id = page.locator("#input-modal-title").get_attribute("id")
        print(f"Title ID: {title_id}")

        if aria_labelledby == title_id:
            print("✅ aria-labelledby matches title ID")
        else:
            print("❌ aria-labelledby does NOT match title ID")

        if role == "dialog" and aria_modal == "true":
            print("✅ role and aria-modal are correct")
        else:
            print("❌ role or aria-modal are incorrect")

        # Take screenshot
        page.screenshot(path="verification/modal_a11y.png")
        print("Screenshot saved to verification/modal_a11y.png")

        browser.close()

if __name__ == "__main__":
    verify_modal_a11y()
