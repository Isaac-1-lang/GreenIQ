import axios from "axios";

// Using dummy data instead of external AI API
const dummyRecommendation = {
  recommendation: 'This product is recyclable. Please check local recycling guidelines. Consider eco-friendly alternatives like reusable containers or products with minimal packaging.',
  disposalMethod: 'Recyclable',
  ecoAlternatives: [
    'Buy from brands with sustainable packaging',
    'Choose products with minimal packaging'
  ]
};

export async function deepSeekRecommendation(product) {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          choices: [{
            message: {
              content: dummyRecommendation.recommendation
            }
          }]
        }
      });
    }, 500);
  });
}
