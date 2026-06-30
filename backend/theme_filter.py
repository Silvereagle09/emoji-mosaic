import json

with open("data/emojilib.json", "r", encoding="utf-8") as f:
    EMOJI_KEYWORDS = json.load(f)

with open("data/emoji_colors.json", "r", encoding="utf-8") as f:
    EMOJI_COLORS = json.load(f)


THEME_KEYWORDS = {
    "pastel": [
        "flower", "blossom", "cute", "soft", "pink", "heart", "star", "cloud",
        "bunny", "cat", "sweet", "candy", "cake", "cupcake", "ribbon", "bow",
        "sparkle", "shine", "moon", "butterfly", "rose", "cherry", "strawberry",
        "milk", "cream", "pearl", "lace", "fairy", "angel", "baby", "teddy",
        "balloon", "gift", "present", "macaron", "donut", "ice_cream",
    ],
    "ocean": [
        "ocean", "sea", "wave", "water", "fish", "shell", "coral", "whale",
        "dolphin", "shark", "crab", "octopus", "jellyfish", "turtle", "boat",
        "anchor", "beach", "swim", "diving", "bubble", "splash", "tide",
        "seahorse", "lobster", "shrimp", "squid", "starfish", "blue", "tropical",
    ],
    "spooky": [
        "skull", "ghost", "pumpkin", "spider", "web", "bat", "witch", "moon",
        "grave", "candle", "skeleton", "zombie", "vampire", "halloween",
        "black_cat", "potion", "magic", "haunted", "scary", "fear", "dark",
        "night", "spell", "cauldron", "broom", "coffin", "fog", "mist",
        "evil", "monster", "demon",
    ],
    "y2k": [
        "star", "sparkle", "heart", "flame", "lightning", "disco", "music",
        "headphone", "phone", "camera", "computer", "robot", "alien", "rocket",
        "gem", "diamond", "crown", "lipstick", "nail", "sunglasses", "neon",
        "butterfly", "chain", "ring", "money", "dollar", "fire", "cd", "tape",
        "game", "joystick",
    ],
}


def build_theme_pools():
    pools = {name: {} for name in THEME_KEYWORDS}

    for char, keywords in EMOJI_KEYWORDS.items():

        # skip emojis we don't have color data for
        if char not in EMOJI_COLORS:
            continue

        keyword_set = set(k.lower().replace("_", " ") for k in keywords)
        # also check raw underscore versions
        keyword_set |= set(k.lower() for k in keywords)

        for theme_name, theme_words in THEME_KEYWORDS.items():

            for tw in theme_words:
                tw_clean = tw.lower().replace("_", " ")

                matched = any(
                    tw_clean in kw or tw.lower() in kw
                    for kw in keyword_set
                )

                if matched:
                    pools[theme_name][char] = EMOJI_COLORS[char]["lab"]
                    break  # one match is enough, move to next emoji

    for name, pool in pools.items():
        print(f"{name}: {len(pool)} emojis matched")

    return pools


if __name__ == "__main__":
    pools = build_theme_pools()

    with open("data/theme_pools.json", "w", encoding="utf-8") as f:
        json.dump(pools, f, ensure_ascii=False, indent=2)

    print("Saved data/theme_pools.json")