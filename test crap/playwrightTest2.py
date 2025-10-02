from playwright.sync_api import sync_playwright # 1.55.0

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False, slow_mo=500)
    page = browser.new_page()
    page.goto("https://www.facebook.com/marketplace/?ref=app_tab")
    page.screenshot(path='screenshot.png', full_page=True)