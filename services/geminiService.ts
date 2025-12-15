import { GoogleGenAI, Type } from "@google/genai";
import { StorageService } from './storage';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key is missing. Ensure process.env.API_KEY is set.");
  }
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

export const generateRecoveryAdvice = async (
  addiction: string,
  daysClean: number,
  symptomsDetailed: string, // Stringified list including severity
  userNotes: string
): Promise<{ practicalTips: string[], encouragement: string }> => {
  const ai = getClient();
  const config = StorageService.getConfig();

  const resourcesContext = `
    Here are some local remedies and resources available in Sri Lanka that you can recommend if relevant:
    Herbal Remedies: ${config.herbalRemedies.map(r => `${r.name}: ${r.description}`).join('; ')}
    Emergency Contacts: ${config.emergencyContacts.map(c => `${c.name}: ${c.number}`).join('; ')}
  `;
  
  const prompt = `
    You are an expert addiction recovery specialist and empathetic life coach.
    The user is recovering from an addiction to: ${addiction}.
    They have been clean for: ${daysClean} days.
    
    They have reported the following symptoms with severity (1-10):
    ${symptomsDetailed}
    
    Additional notes from user: "${userNotes}".

    Context on Resources (Use these if they fit the symptoms):
    ${resourcesContext}

    Task:
    1. Analyze the combination of symptoms and their severity. Higher severity items need more immediate/stronger actionable advice.
    2. Provide 3 highly specific, practical, and immediate actions. 
       - Do NOT just say "see a doctor" (unless it's life-threatening like severe tremors/delirium). 
       - Suggest things like specific herbal teas (e.g., Samahan, Ginger), temperature therapy, breathing techniques, or sensory distractions.
       - Address the most severe symptom first.
    3. Provide a short, punchy, dopamine-boosting message of encouragement.

    Return JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            practicalTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 3 practical tips."
            },
            encouragement: {
              type: Type.STRING,
              description: "A short motivational sentence."
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      practicalTips: [
        "Drink plenty of water to help flush toxins.",
        "Try 4-7-8 breathing: Inhale for 4s, hold for 7s, exhale for 8s.",
        "Take a warm bath with Epsom salts for muscle relaxation."
      ],
      encouragement: "You're doing great, keep going!"
    };
  }
};