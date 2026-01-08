from playwright.sync_api import sync_playwright, expect

def verify_save_prompt_dialog():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            # Navigate to the app
            page.goto("http://localhost:5173")

            # Wait for the app to load
            page.wait_for_selector("text=DR. SNUGGLES CONTROL CENTER")

            # Open the System Prompt section if it's not visible
            # The section is titled "SYSTEM PROMPT" and has a collapse button
            # We need to check if the content is visible.
            # The content has a "Save as template" button (floppy disk icon)

            # Click the collapse button if needed?
            # By default sections seem to be expanded based on the code?
            # Let's try to find the "Save as template" button directly.
            # It has title="Save as template"

            save_btn = page.locator('button[title="Save as template"]')

            # Ensure it's visible. If not, maybe we need to expand the section.
            if not save_btn.is_visible():
                print("Save button not visible, trying to expand section...")
                # Find the collapse button for prompt section.
                # It is near "SYSTEM PROMPT" text.
                # In the code: <div style={styles.sectionHeader}>📝 SYSTEM PROMPT</div>
                # <button onClick={() => toggleSection('prompt')}>
                page.locator("text=📝 SYSTEM PROMPT").locator("..").locator("button").click()

            expect(save_btn).to_be_visible()

            # Click the save button to open the modal
            save_btn.click()

            # Verify the InputModal appears
            # It should have title "Save System Prompt"
            modal_title = page.locator("h2", has_text="Save System Prompt")
            expect(modal_title).to_be_visible()

            # Verify the input field exists with correct placeholder
            input_field = page.locator('input[placeholder="e.g., Physics Lecturer Mode"]')
            expect(input_field).to_be_visible()

            # Verify the description "Template Name:" is present (rendered as label)
            label = page.locator('label', has_text="Template Name:")
            expect(label).to_be_visible()

            # Type a name
            input_field.fill("Test Template")

            # Take a screenshot of the modal
            page.screenshot(path="verification/save_prompt_modal.png")
            print("Screenshot saved to verification/save_prompt_modal.png")

            # Click Cancel to close
            page.get_by_text("Cancel").click()

            # Verify modal is gone
            expect(modal_title).not_to_be_visible()

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
            raise e
        finally:
            browser.close()

if __name__ == "__main__":
    verify_save_prompt_dialog()
