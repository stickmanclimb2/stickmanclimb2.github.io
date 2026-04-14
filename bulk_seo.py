import os

# Map of filenames to their optimized Titles and Descriptions
seo_map = {
    "gunspin.html": {
        "title": "Gunspin Unblocked - Play Free Shooting Game on GitHub",
        "desc": "Play Gunspin unblocked on GitHub! Master the recoil, unlock powerful guns, and see how far you can fly in this addictive physics-based shooting game. Play free now!"
    },
    "soccer-random.html": {
        "title": "Soccer Random Unblocked - 2 Player Physics Fun on GitHub",
        "desc": "Play Soccer Random unblocked on GitHub! Experience hilarious physics-based soccer with a friend or against the CPU. Random fields, random balls, and pure fun. Unblocked for school."
    },
    "basket-random.html": {
        "title": "Basket Random Unblocked - Epic 2 Player Basketball on GitHub",
        "desc": "Play Basket Random unblocked on GitHub! Fun physics, random players, and unpredictable basketball action. Can you score the winning basket? Play free at school or work!"
    },
    "big-shot-boxing.html": {
        "title": "Big Shot Boxing Unblocked - Become the Champ on GitHub",
        "desc": "Play Big Shot Boxing unblocked on GitHub! Rise through the ranks, train your boxer, and win the world title in this classic physics-based boxing game. Play unblocked now!"
    },
    "drive-mad.html": {
        "title": "Drive Mad Unblocked - Extreme Stunt Driving on GitHub",
        "desc": "Play Drive Mad unblocked on GitHub! Master challenging levels, drive crazy vehicles, and overcome insane obstacles in this rhythm-based driving game. Try to stay on the track!"
    },
    "basketball-stars.html": {
        "title": "Basketball Stars Unblocked - Play Hoops on GitHub",
        "desc": "Play Basketball Stars unblocked on GitHub! Show off your b-ball skills, perform sick dunks, and outplay your opponents in the ultimate unblocked basketball game. Play now!"
    },
    "penalty-shooters-2.html": {
        "title": "Penalty Shooters 2 Unblocked - Win the Cup on GitHub",
        "desc": "Play Penalty Shooters 2 unblocked on GitHub! Lead your favorite team to victory in the ultimate soccer penalty shootout. Realistic gameplay and high stakes. play unblocked now!"
    },
    "bloxorz.html": {
        "title": "Bloxorz Unblocked - The Classic Puzzle Game on GitHub",
        "desc": "Play Bloxorz unblocked on GitHub! Navigate the mysterious 3D block through 33 levels of brain-twisting puzzles. The original logic game, now unblocked for school or work."
    }
}

def apply_seo(filename, title, desc):
    path = os.path.join("play", filename)
    if not os.path.exists(path):
        print(f"File {path} not found!")
        return

    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    new_lines = []
    in_og = False
    for line in lines:
        # Replace main title
        if "<title>" in line:
            new_lines.append(f'<title>{title}</title>\n')
        # Replace main description
        elif '<meta content=' in line and 'name="description"' in line:
            new_lines.append(f'<meta content="{desc}" name="description"/>\n')
        # Replace OG title
        elif '<meta content=' in line and 'property="og:title"' in line:
            new_lines.append(f'<meta content="{title}" property="og:title"/>\n')
        # Replace OG description
        elif '<meta content=' in line and 'property="og:description"' in line:
            new_lines.append(f'<meta content="{desc}" property="og:description"/>\n')
        else:
            new_lines.append(line)

    with open(path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print(f"Optimized {filename}")

for filename, data in seo_map.items():
    apply_seo(filename, data['title'], data['desc'])
