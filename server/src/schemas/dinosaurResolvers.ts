import Dinosaur from "../models/Dinosaur";
import { AuthenticationError, ForbiddenError } from "apollo-server-express";
import Bun from 'bun'

export const dinosaurResolvers = {
  Query: {
    dinosaurs: async (_: any, args: { sortBy?: string }) => {
      const { sortBy } = args;
      const sortObj: any = {};
      if (sortBy === "species") {
        sortObj.species = 1;
      } else if (sortBy === "size") {
        sortObj.size = 1;
      } else if (sortBy === "price") {
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
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            max_tokens: 120,
            temperature: 0.5,
            messages: [
              {
                role: "system",
                content:
                  "You are a knowledgeable dinosaur expert. When given the name of a dinosaur, provide detailed factual information about it including its period, size, habitat, diet, and any interesting characteristics using less than 120 words.",
              },
              { role: "user", content: query },
            ],
          }),
        });
      
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || "Failed to fetch data");
        }
      
        const data = await response.json();
        return data.choices[0].message.content.trim();
      } catch (error: any) {
        if (error instanceof Error) {
          console.error("Error calling OpenAI API:", error.message);
        } else {
          console.error("Error calling OpenAI API:", error);
        }
        throw new Error("Failed to fetch dinosaur information.");
      }
    }
  },

  Mutation: {
    addDinosaur: async (_: any, { input }: { input: any }, { user }: { user: any }) => {
      if (!user || !user.isAdmin) {
        throw new ForbiddenError("Access denied: Only admins can add dinosaurs.");
      }

      const newDinosaur = new Dinosaur(input);
      await newDinosaur.save();
      return newDinosaur;
    },

    updateDinosaur: async (_: any, { id, input }: { id: string; input: any }, { user }: { user: any }) => {
      if (!user || !user.isAdmin) {
        throw new ForbiddenError("Access denied: Only admins can update dinosaurs.");
      }

      const updatedDinosaur = await Dinosaur.findByIdAndUpdate(id, input, { new: true });
      if (!updatedDinosaur) throw new Error("Dinosaur not found");
      return updatedDinosaur;
    },
    
    deleteDinosaur: async (_: any, { id }: { id: string }, { user }: { user: any }) => {
      if (!user || !user.isAdmin) {
        throw new ForbiddenError("Access denied: Only admins can delete dinosaurs.");
      }

      const deletedDinosaur = await Dinosaur.findByIdAndDelete(id);
      if (!deletedDinosaur) throw new Error("Dinosaur not found");
      return "Dinosaur deleted successfully";
    },
  },
};
