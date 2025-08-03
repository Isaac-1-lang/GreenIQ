import axios from "axios";
const deepSeekKey =
  "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";
const modelId = "deepseek/deepseek-r1-0528:free";

export async function deepSeekRecommendation(product) {
  const productToString = JSON.stringify(product, null, 2);

const prompt = `
You are an expert Environmental Impact Analyst. 
Given the following structured product data: ${productToString}, 
generate one short, clean, and factual paragraph (max 50 words, no titles, no bullet points, no line breaks, no styling, no numbering of points). 
Include accurate disposal tips (recyclable, compostable, etc.) and 
suggest 2 real-world eco-friendly alternatives with justifications.
`;


  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: modelId,
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${deepSeekKey}`,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.log(error.message)
    throw error
  }
}
