from playwright.sync_api import sync_playwright, expect
import time

def verify_toast(page):
    print("Navigating to app...")
    page.goto("http://localhost:5173")

    # Wait for the app to load
    page.wait_for_selector("text=DR. SNUGGLES CONTROL CENTER")

    # Click the "Test Audio" button to trigger a toast or something similar?
    # Wait, looking at the code, "Test Audio" logs to console but doesn't explicitly showToast unless error?
    # Let's find a button that definitely shows a toast.

    # "Save Profile" shows a modal, and submitting it shows a toast.
    # "Export Transcript" shows a toast.

    # Let's try "Export Transcript" in the Transcript Widget if available,
    # but the TranscriptWidget uses props.
    # In DrSnugglesControlCenter, handleExportTranscript calls showToast('Transcript exported to file').
    # But that needs a button.
    # TranscriptWidget has "onExport" passed to it.

    # Let's try to trigger a toast via "System Prompt" -> "Apply Changes".
    # handleApplySystemPrompt calls showToast('System prompt updated').
    # The button is "✓ APPLY CHANGES".

    print("Clicking Apply Changes button...")
    # Open the "SYSTEM PROMPT" section first if it's collapsed?
    # By default sections are NOT collapsed (collapsedSections is empty Set).

    # Find the button.
    # It has text "✓ APPLY CHANGES".
    apply_btn = page.get_by_text("✓ APPLY CHANGES")
    apply_btn.scroll_into_view_if_needed()
    apply_btn.click()

    print("Waiting for toast...")
    # The toast should appear. It has text "System prompt updated".
    # And it should have role="status".
    toast = page.get_by_role("status")
    expect(toast).to_be_visible()
    expect(toast).to_have_text("✅ System prompt updated")

    # Take screenshot
    print("Taking screenshot...")
    page.screenshot(path="verification/toast_verification.png")
    print("Screenshot saved to verification/toast_verification.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_toast(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/toast_error.png")
        finally:
            browser.close()
