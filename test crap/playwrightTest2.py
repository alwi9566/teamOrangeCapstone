from playwright.sync_api import sync_playwright # 1.55.0

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False, slow_mo=500)
    page = browser.new_page()
    page.goto("https://www.ebay.com/itm/356605653571?_trkparms=amclksrc%3DITM%26aid%3D777008%26algo%3DPERSONAL.TOPIC%26ao%3D1%26asc%3D20240114230122%26meid%3D4e791805f304433e905855b41f51dfd6%26pid%3D101950%26rk%3D1%26rkt%3D1%26itm%3D356605653571%26pmt%3D0%26noa%3D1%26pg%3D4375194%26algv%3DFeaturedDealsV2&_trksid=p4375194.c101950.m162919&_trkparms=parentrq%3A82f76f0d1990a6ba9f16e056fff9ed19%7Cpageci%3Af4fca7d6-9a5d-11f0-b67d-7a0dee668275%7Ciid%3A1%7Cvlpname%3Avlp_homepage")
    page.screenshot(path='screenshot.png', full_page=True)