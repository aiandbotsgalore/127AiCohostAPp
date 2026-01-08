
import asyncio
from playwright.async_api import async_playwright, expect

async def verify_settings_escape():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Navigate to the renderer
        await page.goto("http://localhost:5173")

        # Wait for app to load (look for "Go Live" button or similar)
        await page.wait_for_selector('button:has-text("GO LIVE")')

        # Open Settings Modal
        await page.get_by_label("Settings").click()

        # Verify Settings Modal is visible
        settings_title = page.get_by_text("⚙️ SETTINGS")
        await expect(settings_title).to_be_visible()

        # Take screenshot of open modal
        await page.screenshot(path="verification/1_settings_open.png")
        print("Settings modal opened")

        # Press Escape
        await page.keyboard.press("Escape")

        # Verify Settings Modal is HIDDEN
        await expect(settings_title).not_to_be_visible()

        # Take screenshot of closed modal
        await page.screenshot(path="verification/2_settings_closed.png")
        print("Settings modal closed via Escape")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify_settings_escape())
