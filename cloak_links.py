import os

# New Clean Link
CLEAN_LINK = "/go/games"

# Target scary link to replace
SCARY_LINK = "https://www.g2a.com/n/reflink-94130670e8"

def cloak_links(directory):
    count = 0
    for filename in os.listdir(directory):
        if filename.endswith(".html"):
            path = os.path.join(directory, filename)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if SCARY_LINK in content:
                new_content = content.replace(SCARY_LINK, CLEAN_LINK)
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                count += 1
    return count

# Update root index
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()
if SCARY_LINK in content:
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content.replace(SCARY_LINK, CLEAN_LINK))
    print("Cloaked link in index.html")

# Update all play pages
updated_count = cloak_links('play')
print(f"Cloaked links in {updated_count} files in /play/")
