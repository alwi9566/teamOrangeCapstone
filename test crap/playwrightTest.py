import re
from playwright.sync_api import Page, expect

def test_has_title(page: Page):
    page.goto("https://www.ebay.com/itm/356605653571?_trkparms=amclksrc%3DITM%26aid%3D777008%26algo%3DPERSONAL.TOPIC%26ao%3D1%26asc%3D20240114230122%26meid%3D4e791805f304433e905855b41f51dfd6%26pid%3D101950%26rk%3D1%26rkt%3D1%26itm%3D356605653571%26pmt%3D0%26noa%3D1%26pg%3D4375194%26algv%3DFeaturedDealsV2&_trksid=p4375194.c101950.m162919&_trkparms=parentrq%3A82f76f0d1990a6ba9f16e056fff9ed19%7Cpageci%3Af4fca7d6-9a5d-11f0-b67d-7a0dee668275%7Ciid%3A1%7Cvlpname%3Avlp_homepage")
    page.screenshot(path='screenshot.png', full_page=True)
    # Expect a title "to contain" a substring.
    # expect(page).to_have_title(re.compile("Condition"))

# def test_get_started_link(page: Page):
#     page.goto("https://playwright.dev/")
#
#     # Click the get started link.
#     page.get_by_role("link", name="Get started").click()
#
#     # Expects page to have a heading with the name of Installation.
#     expect(page.get_by_role("heading", name="Installation")).to_be_visible()

# def test_has_condition(page: Page):
    # expect()