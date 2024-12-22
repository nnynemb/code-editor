export function generateCartoonHeroName() {
    const names = ["Zippy", "Goofy", "Fluffy", "Chirpy", "Loopy"];
    const lastNames = ["Bubbles", "Snuggles", "Sprinkles", "Wiggles", "Doodles"];

    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    return `${randomName} ${randomLastName}`;
}
