const OpenAI = require('openai');
const logger = require('../utils/logger');

let openai = null;

const getOpenAIClient = () => {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
};

/**
 * Generate trip itinerary using OpenAI
 */
const generateItinerary = async (tripData, contextData) => {
  const client = getOpenAIClient();

  if (!client) {
    logger.warn('OpenAI not configured. Generating demo itinerary.');
    return generateDemoItinerary(tripData);
  }

  const systemPrompt = `You are an expert AI travel planner specializing in creating realistic, budget-conscious, and geographically optimized travel itineraries. 

Your rules:
1. Never schedule places that are geographically far apart on the same day
2. Always respect estimated opening hours (most attractions: 9AM-6PM)
3. Consider weather conditions — schedule indoor activities on rainy days
4. Stay within the specified budget
5. Never duplicate attractions across days
6. Keep travel time between activities to under 30 minutes when possible
7. Group geographically close attractions together
8. Include realistic meal recommendations based on the destination
9. Provide practical travel tips for each day
10. Return ONLY valid JSON, no markdown, no explanation text

The output MUST be a valid JSON object with this exact structure:
{
  "tripTitle": string,
  "destination": string,
  "summary": string,
  "estimatedBudget": number,
  "tags": string[],
  "days": [
    {
      "day": number,
      "date": string,
      "title": string,
      "theme": string,
      "activities": [
        {
          "name": string,
          "startTime": string,
          "duration": string,
          "description": string,
          "type": "attraction" | "restaurant" | "hotel" | "transport" | "other",
          "estimatedCost": number,
          "tips": string
        }
      ],
      "meals": {
        "breakfast": { "name": string, "location": string, "estimatedCost": number },
        "lunch": { "name": string, "location": string, "estimatedCost": number },
        "dinner": { "name": string, "location": string, "estimatedCost": number }
      },
      "accommodation": {
        "name": string,
        "type": string,
        "location": string,
        "estimatedCost": number,
        "rating": number
      },
      "estimatedCost": number,
      "tips": string[]
    }
  ]
}`;

  const userPrompt = buildUserPrompt(tripData, contextData);

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    const parsed = JSON.parse(content);

    // Validate response
    if (!parsed.days || !Array.isArray(parsed.days)) {
      throw new Error('Invalid AI response structure');
    }

    logger.info(`AI generated itinerary for ${tripData.destination}, ${parsed.days.length} days`);
    return parsed;
  } catch (error) {
    logger.error('OpenAI API error:', error.message);
    return generateDemoItinerary(tripData);
  }
};

/**
 * Regenerate or modify an existing itinerary
 */
const regenerateItinerary = async (existingTrip, instruction) => {
  const client = getOpenAIClient();

  if (!client) {
    return generateDemoItinerary(existingTrip);
  }

  const systemPrompt = `You are an expert AI travel planner. You will receive an existing travel itinerary and a modification instruction. 
  Apply the modification while keeping as much of the original structure as possible.
  Return ONLY valid JSON with the same structure as the input itinerary.`;

  const userPrompt = `Existing Itinerary:
${JSON.stringify(existingTrip.itinerary, null, 2)}

Trip Details:
- Destination: ${existingTrip.destination}
- Budget: ₹${existingTrip.budget}
- Days: ${existingTrip.days}

Modification Request: "${instruction}"

Apply this modification and return the complete updated itinerary JSON.`;

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.6,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    logger.error('Regenerate error:', error.message);
    throw error;
  }
};

const buildUserPrompt = (tripData, contextData) => {
  const { destination, startLocation, startDate, endDate, days, travelers, budget, preferences } = tripData;
  const totalTravelers = (travelers?.adults || 1) + (travelers?.children || 0);

  return `Plan a ${days}-day trip with the following details:

TRIP DETAILS:
- From: ${startLocation}
- To: ${destination}
- Start Date: ${startDate}
- End Date: ${endDate}
- Duration: ${days} days
- Travelers: ${totalTravelers} (${travelers?.adults || 1} adults, ${travelers?.children || 0} children)
- Total Budget: ₹${budget}
- Travel Style: ${preferences?.travelStyle?.join(', ') || 'general'}
- Interests: ${preferences?.interests?.join(', ') || 'sightseeing'}
- Transport: ${preferences?.transport?.join(', ') || 'car'}
- Accommodation: ${preferences?.accommodation || 'mid-range'}

AVAILABLE ATTRACTIONS:
${JSON.stringify(contextData.places?.slice(0, 8) || [], null, 2)}

RESTAURANTS:
${JSON.stringify(contextData.restaurants?.slice(0, 6) || [], null, 2)}

WEATHER FORECAST:
${JSON.stringify(contextData.weather || [], null, 2)}

INSTRUCTIONS:
- Use the actual place names from the AVAILABLE ATTRACTIONS list when possible
- Plan outdoor activities on days with good weather; indoor activities when rain is expected
- Keep geographically close places on the same day
- Stay within ₹${budget} total budget
- Make the itinerary feel natural and unhurried
- Include local food recommendations specific to ${destination}
- Provide practical tips for each day
- Generate the itinerary starting from date: ${startDate}`;
};

const generateDemoItinerary = (tripData) => {
  const { destination, startDate, days, budget } = tripData;
  const start = new Date(startDate || Date.now());

  const demoActivities = {
    1: [`${destination} Botanical Garden`, `${destination} Lake`, `${destination} Heritage Walk`],
    2: [`${destination} Viewpoint`, `${destination} Tea/Spice Garden`, `${destination} Museum`],
    3: [`${destination} Waterfall`, `${destination} Local Market`, `${destination} Sunset Point`],
  };

  const itineraryDays = Array.from({ length: Math.min(days, 7) }, (_, i) => {
    const dayDate = new Date(start);
    dayDate.setDate(start.getDate() + i);
    const activities = demoActivities[(i % 3) + 1] || demoActivities[1];

    return {
      day: i + 1,
      date: dayDate.toISOString().split('T')[0],
      title: `Day ${i + 1} - Exploring ${destination}`,
      theme: ['Discovery', 'Adventure', 'Culture'][i % 3],
      activities: activities.map((name, j) => ({
        name,
        startTime: `${9 + j * 3}:00`,
        duration: '2 hours',
        description: `Visit the beautiful ${name} and enjoy the natural surroundings.`,
        type: 'attraction',
        estimatedCost: Math.round((budget / days) * 0.15),
        tips: 'Best visited in the morning for pleasant weather.',
      })),
      meals: {
        breakfast: { name: 'Hotel Breakfast', location: `Your Hotel, ${destination}`, estimatedCost: 200 },
        lunch: { name: `${destination} Local Restaurant`, location: `Near ${activities[0]}`, estimatedCost: 400 },
        dinner: { name: 'Local Cuisine Experience', location: `${destination} Food Street`, estimatedCost: 600 },
      },
      accommodation: {
        name: `${destination} Comfort Inn`,
        type: tripData.preferences?.accommodation || 'mid-range',
        location: `Central ${destination}`,
        estimatedCost: Math.round(budget * 0.15 / days),
        rating: 4.2,
      },
      estimatedCost: Math.round(budget / days),
      tips: [
        `Carry water and sunscreen when visiting outdoor spots`,
        `Try the local specialties at the market`,
        `Book tickets for popular attractions in advance`,
      ],
    };
  });

  return {
    tripTitle: `${days}-Day ${destination} Escape`,
    destination,
    summary: `A wonderful ${days}-day journey through ${destination}, experiencing the best of nature, culture, and local cuisine.`,
    estimatedBudget: budget,
    tags: ['nature', 'culture', 'adventure'],
    days: itineraryDays,
  };
};

module.exports = { generateItinerary, regenerateItinerary };
