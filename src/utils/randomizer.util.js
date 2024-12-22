export function generateCartoonHeroName() {
    const names = ["Zippy", "Goofy", "Fluffy", "Chirpy", "Loopy"];
    const lastNames = ["Bubbles", "Snuggles", "Sprinkles", "Wiggles", "Doodles"];

    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    return `${randomName} ${randomLastName}`;
}

export function generateConsistentColor(word) {
    // Hash function to convert the word into a consistent number
    const hash = word
        .split('')
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    // Convert the hash to a color from the color palette
    const colors = [
        "#FF5733", // Vibrant Orange
        "#33FF57", // Bright Green
        "#3357FF", // Bold Blue
        "#FF33A6", // Hot Pink
        "#FFD133", // Sunshine Yellow
    ];

    const color = colors[hash % colors.length];
    return color;
}
