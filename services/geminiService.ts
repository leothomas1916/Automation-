
import { GoogleGenAI, Type } from "@google/genai";
import { PostOptions, GeneratedContent, WeeklyPost } from "../types";

const REPAIR_SERVICES_CONTEXT = `
Business: iRepair2k - iPhone, iPad, MacBook Repair Bangalore
Brand Strategy: Premium, reliable, only Genuine Parts, same-day service.
Main Location: No. 1, 1st Floor, 12th Main Rd, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038.
Service Areas: Indiranagar, Koramangala, HSR Layout, Marathahalli, Whitefield, Electronic City, JP Nagar, Halasuru.
Core Services: iPhone Screen Repair, Battery Replacement, MacBook Logic Board Repair, iPad Glass Repair, Water Damage Recovery.
SEO Keywords: iPhone repair Bangalore, MacBook service center Indiranagar, iPad repair near me, genuine Apple parts Bangalore.
Hours: Mon-Sat: 10:00 AM - 8:00 PM, Sun: 11:00 AM - 5:00 PM.
Payment Methods: Cash, Credit Card, Debit Card, UPI, GPay, PhonePe.
`;

const GMB_AUTOMATION_RULES = `
- Output gmbApiType: 'OFFER' for discounts, 'EVENT' for workshops, 'STANDARD' for updates.
- Distribute content topics: 40% Repairs, 30% Trust/Reviews, 20% Offers, 10% Local Bangalore Tips.
- Use date-aware scheduling based on the provided start date.
`;

export const generateSchemaMarkup = async (location: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a comprehensive JSON-LD Schema.org markup for iRepair2k in ${location}. 
    Include: 
    - LocalBusiness (with Address, GeoCoordinates, Telephone)
    - RepairService (with serviceType, areaServed)
    - OpeningHoursSpecification (based on context)
    - paymentAccepted (based on context)
    - FAQ (common repair questions)
    Use the following context: ${REPAIR_SERVICES_CONTEXT}`,
    config: {
      systemInstruction: "Return ONLY valid JSON-LD code block. No markdown formatting outside the JSON.",
    }
  });
  return response.text || "";
};

export const generatePostContent = async (options: PostOptions): Promise<GeneratedContent> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // If it's a schema request
  if (options.type === 'seo_schema') {
     const schema = await generateSchemaMarkup(options.location);
     return {
       textContent: "SEO Data & JSON-LD Schema generated successfully.",
       imagePrompt: "Professional storefront of iRepair2k",
       schemaMarkup: schema,
       campaignContext: "SEO_UPDATE"
     };
  }

  if (options.type === 'weekly_plan' || options.type === 'monthly_plan') {
    const postCount = options.type === 'monthly_plan' ? 30 : 7;
    const userPrompt = `Generate a ${postCount}-day GMB Automation Plan for iRepair2k in ${options.location}. 
    Start Date: ${options.startDate}. 
    Context: ${options.month}. 
    Details: ${options.offerDetails || 'General repair services'}.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: `You are a GMB Automation Expert for Zapier workflows. Return a JSON array of ${postCount} objects. 
        Keys: day, date, topic, content, imagePrompt, offerValue, promoCode, validUntil, gmbApiType.
        Format dates as YYYY-MM-DD. ${REPAIR_SERVICES_CONTEXT} ${GMB_AUTOMATION_RULES}`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              day: { type: Type.STRING },
              date: { type: Type.STRING },
              topic: { type: Type.STRING },
              content: { type: Type.STRING },
              imagePrompt: { type: Type.STRING },
              offerValue: { type: Type.STRING },
              promoCode: { type: Type.STRING },
              validUntil: { type: Type.STRING },
              gmbApiType: { type: Type.STRING, enum: ['OFFER', 'EVENT', 'STANDARD', 'WHAT_NEW'] }
            },
            required: ["day", "date", "topic", "content", "imagePrompt", "gmbApiType"]
          }
        }
      }
    });

    const weeklyPosts: WeeklyPost[] = JSON.parse(response.text || "[]");
    return {
      textContent: `${postCount}-Day Zapier Automation Matrix Ready`,
      imagePrompt: weeklyPosts[0]?.imagePrompt || "GMB Cover Photo",
      weeklyPosts,
      campaignContext: `Zapier Loop for ${options.location}`
    };
  }

  // Single post generation
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Single GMB Post: ${options.type} for ${options.location}. Start: ${options.startDate}`,
    config: {
      systemInstruction: `Post content ||| Image prompt ||| GMB_TYPE (OFFER/STANDARD). Optimized for Zapier Webhooks. ${REPAIR_SERVICES_CONTEXT}`
    }
  });

  const parts = (response.text || "").split('|||');
  return {
    textContent: parts[0]?.trim() || "Content error",
    imagePrompt: parts[1]?.trim() || "Professional repair photo",
    campaignContext: parts[2]?.trim() || "STANDARD"
  };
};

export const generateImage = async (prompt: string): Promise<string> => {
  // @ts-ignore
  const hasKey = await window.aistudio.hasSelectedApiKey();
  if (!hasKey) {
    // @ts-ignore
    await window.aistudio.openSelectKey();
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: `${prompt}. High-end commercial style, Bangalore city vibes, 4K resolution.` }] },
    config: {
      imageConfig: { aspectRatio: "16:9", imageSize: "1K" }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Render failed");
};

export const getSystemPromptForAIStudio = (location: string) => {
  return `You are a Local SEO bot for iRepair2k ${location}, generating payloads for Zapier. 
Context: ${REPAIR_SERVICES_CONTEXT}
Rules: ${GMB_AUTOMATION_RULES}
Output: JSON ONLY, compatible with Zapier Catch Hooks.`;
};
