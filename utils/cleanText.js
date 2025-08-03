export async function cleanText(text) {
  return text
    .replace(/^#{1,6}\s?/gm, "\n")
    .replace(/[*_`~>]+/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .replace(/[ ]{2,}/g, " ") 
    .trim();
}
