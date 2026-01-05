from playwright.sync_api import sync_playwright

def verify_control_center():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:5173")
            page.wait_for_selector('text=DR. SNUGGLES CONTROL CENTER', timeout=10000)

            # Check for AvatarWidget presence
            page.wait_for_selector('text=🐻 DR. SNUGGLES', timeout=5000)

            # Check for Analytics section and Speaking Time
            page.wait_for_selector('text=📊 ANALYTICS', timeout=5000)
            page.wait_for_selector('text=Speaking Time:', timeout=5000)

            # We expect 0s initially
            page.wait_for_selector('text=0s', timeout=5000)

            print("Verification successful: Control center loaded and components visible.")
            page.screenshot(path="verification/control_center.png")

        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_control_center()
