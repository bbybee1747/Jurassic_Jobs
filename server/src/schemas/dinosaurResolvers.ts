import Dinosaur from '../models/Dinosaur';
import axios from "axios";

export const dinosaurResolvers = {
  Query: {
    dinosaurs: async (_: any, args: { sortBy?: string }) => {
      const { sortBy } = args;
      const sortObj: any = {};
      if (sortBy === 'species') {
        sortObj.species = 1;
      } else if (sortBy === 'size') {
        sortObj.size = 1;
      } else if (sortBy === 'price') {
        sortObj.price = 1;
      } else {
        sortObj.age = 1;
      }
      return Dinosaur.find().sort(sortObj);
    },
    searchDinosaur: async (_: any, args: { query: string }) => {
      const { query } = args;
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("Missing OpenAI API key");
      }
      
      try {
        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-3.5-turbo",
            max_tokens: 100,
            temperature: 0.5,
            messages: [
              { role: "system", content: "You are a knowledgeable dinosaur expert. When given the name of a dinosaur, provide detailed factual information about it including its period, size, habitat, diet, and any interesting characteristics." 
              },
              { role: "user", content: query},
              ],
          },
          
          {
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
          }
        );
        
        return response.data.choices[0].message.content.trim();
      } catch (error: any) {
        console.error("Error calling OpenAI API:", error.response?.data || error.message);
        throw new Error("Failed to fetch dinosaur information.");
      }
    },
  },
};