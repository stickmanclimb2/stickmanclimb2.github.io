import os

# Map of filenames to their optimized keywords
keywords_map = {
    "index.html": "unblocked games, github games, stickman climb 2 unblocked, wordle unblocked, geometry dash unblocked github",
    "wordle-unlimited.html": "wordle unlimited unblocked, wordle github, infinite wordle, unblocked games github",
    "geometry-dash.html": "geometry dash unblocked, geometry dash github, geometry dash full version unblocked",
    "8-ball-pool.html": "8 ball pool unblocked, unblocked pool games, 8 ball pool github",
    "slope-3.html": "slope 3 unblocked, slope game github, unblocked slope 3",
    "g-switch-3.html": "g switch 3 unblocked, g-switch github, unblocked gravity runner",
    "gunspin.html": "gunspin unblocked, gunspin github, shooting games unblocked",
    "soccer-random.html": "soccer random unblocked, soccer random github, 2 player soccer unblocked",
    "basket-random.html": "basket random unblocked, basket random github, basketball games unblocked",
    "big-shot-boxing.html": "big shot boxing unblocked, boxing games github, big shot boxing unblocked school",
    "drive-mad.html": "drive mad unblocked, drive mad github, car games unblocked github",
    "basketball-stars.html": "basketball stars unblocked, basketball stars github, hoops unblocked",
    "penalty-shooters-2.html": "penalty shooters 2 unblocked, soccer penalty github, unblocked soccer games",
    "bloxorz.html": "bloxorz unblocked, bloxorz github, logic puzzles unblocked"
}

def apply_keywords(filename, keywords):
    # Check if file in root or play/
    if filename == "index.html":
        path = "index.html"
    else:
        path = os.path.join("play", filename)
    
    if not os.path.exists(path):
        print(f"File {path} not found!")
        return

    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    new_lines = []
    found_keywords = False
    
    # First pass to check if meta keywords exists
    for line in lines:
        if '<meta name="keywords"' in line or '<meta content=' in line and 'name="keywords"' in line:
            # Update existing keywords
            if 'name="keywords"' in line:
                 new_lines.append(f'<meta name="keywords" content="{keywords}"/>\n')
            else: # handle different formats
                 new_lines.append(f'<meta content="{keywords}" name="keywords"/>\n')
            found_keywords = True
        else:
            new_lines.append(line)

    # If not found, insert it after description or title
    if not found_keywords:
        final_lines = []
        inserted = False
        for line in new_lines:
            final_lines.append(line)
            if not inserted and ('name="description"' in line or '<title>' in line):
                final_lines.append(f'<meta name="keywords" content="{keywords}"/>\n')
                inserted = True
        new_lines = final_lines

    with open(path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print(f"Added keywords to {filename}")

for filename, keywords in keywords_map.items():
    apply_keywords(filename, keywords)
