import os

# Your G2A Reflink
G2A_LINK = "https://www.g2a.com/n/reflink-94130670e8"

# The HTML block to find (The Lucky Numbers card)
OLD_CARD = """        <!-- 3. Number/Decision Wheel -->
        <a href="https://tinyfont.me/random-number-wheel/?utm_source=stickmanclimb&utm_medium=game_overlay&utm_campaign=gamer_traffic"
            target="_blank" class="promo-card" style="border-color: #fb5607;">
            <span class="promo-icon">🎲</span>
            <div class="promo-title">Lucky Numbers</div>
            <div class="promo-desc">Need to decide? <br> Let the wheel choose your fate!</div>
        </a>"""

# The New Money-Making Card
NEW_CARD = f"""        <!-- 3. G2A Affiliate - Money Maker -->
        <a href="{G2A_LINK}"
            target="_blank" class="promo-card" style="border-color: #f39c12;">
            <span class="promo-icon">🎮</span>
            <div class="promo-title">Cheap Game Keys</div>
            <div class="promo-desc">Get Roblox, Steam & Fortnite <br> Gift Cards at 20% Off!</div>
        </a>"""

def update_files(directory):
    count = 0
    for filename in os.listdir(directory):
        if filename.endswith(".html"):
            path = os.path.join(directory, filename)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if OLD_CARD in content:
                new_content = content.replace(OLD_CARD, NEW_CARD)
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                count += 1
    return count

# Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()
if OLD_CARD in content:
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content.replace(OLD_CARD, NEW_CARD))
    print("Updated index.html")

# Update all play pages
updated_count = update_files('play')
print(f"Updated {updated_count} files in /play/")
