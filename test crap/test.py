import requests

# The CDN image URL
url = "https://scontent-den2-1.xx.fbcdn.net/v/t45.5328-4/502846951_1011828177734340_6568752350921583642_n.jpg?stp=dst-jpg_tt6&amp;cstp=mx1536x2048&amp;ctp=p600x600&amp;_nc_cat=102&amp;ccb=1-7&amp;_nc_sid=4aa2e4&amp;_nc_ohc=-TD5Uo-QIaYQ7kNvwGa6EWN&amp;_nc_oc=Adnnf-qXtFrFBdWiKLwNZbTm4mQdd2Jfz03HK9zGxHAvmtbZRw_5CWB3oar9Y6C7M04&amp;_nc_zt=23&amp;_nc_ht=scontent-den2-1.xx&amp;_nc_gid=uh0YmfuZEw2HspElyaxsSw&amp;oh=00_Afap0O9JVebjSQIcTkbJR613qgibf50vcPaJoyA2rXtcxQ&amp;oe=68D2757F"  # replace with actual URL

# Optional: include cookies if you have them (e.g., from browser)
cookies = {
    # 'c_user': 'your_fb_user_id',
    # 'xs': 'your_fb_xs_cookie',
}

# Headers to mimic a browser request
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/120.0.0.0 Safari/537.36",
    "Referer": "https://www.facebook.com/",  # important to bypass referrer check
}

response = requests.get(url, headers=headers, cookies=cookies, stream=True)

if response.status_code == 200:
    with open("fb_image.jpg", "wb") as f:
        for chunk in response.iter_content(1024):
            f.write(chunk)
    print("Downloaded successfully!")
else:
    print(f"Failed to download: {response.status_code}")