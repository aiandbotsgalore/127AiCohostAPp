from playwright.sync_api import sync_playwright, expect

def test_save_prompt_modal():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Capture console logs
        page.on("console", lambda msg: print(f"Console: {msg.text}"))
        page.on("pageerror", lambda err: print(f"Page Error: {err}"))

        # Mock Electron IPC with correct structure
        page.add_init_script("""
            window.electron = {
                on: (channel, func) => { return () => {}; },
                send: (channel, data) => console.log('IPC send:', channel, data),
                removeListener: (channel, func) => {},
                invoke: (channel, data) => Promise.resolve()
            };
        """)

        try:
            # Navigate to the app
            page.goto("http://localhost:5173")

            # Wait for the app to load
            expect(page.get_by_text("DR. SNUGGLES CONTROL CENTER")).to_be_visible(timeout=10000)

            # Find the "Save as template" button in the System Prompt section
            save_btn = page.locator('button[aria-label="Save template"]')

            # Ensure it is visible
            expect(save_btn).to_be_visible()

            # Click the save button
            save_btn.click()

            # Verify the modal opens
            expect(page.get_by_role("heading", name="Save System Prompt")).to_be_visible()

            # Verify the placeholder text
            expect(page.get_by_placeholder("e.g., Physics Lecturer Mode")).to_be_visible()

            # Verify the description text
            expect(page.get_by_text("Enter a name for this prompt template.")).to_be_visible()

            # Take a screenshot
            page.screenshot(path="verification_modal.png")
            print("Screenshot saved to verification_modal.png")

        except Exception as e:
            print(f"Test failed: {e}")
            page.screenshot(path="verification_failure.png")
        finally:
            browser.close()

if __name__ == "__main__":
    test_save_prompt_modal()
