import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // You should retrieve this from env vars on Vercel
    // e.g. process.env.GEMINI_API_KEY
    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyARCseOc2BbhUgH1Z0Y3wt7DcipNGyKdCI";

    const systemPrompt = `
    You are an expert portfolio creator. The user will provide a brief description of themselves, their profession, and their skills. 
    Your goal is to extrapolate this short description into a complete, professional, multi-section portfolio.

    You MUST return ONLY valid JSON matching this exact structure:
    {
      "tagline": "A punchy, 1-sentence professional headline",
      "bio": "A well-written, engaging 2-3 paragraph biography expanding on what they do, their passion, and their value proposition.",
      "skills": [
        { "name": "Skill Name 1", "level": 90 },
        { "name": "Skill Name 2", "level": 85 }
      ],
      "projects": [
        {
          "title": "A realistic project title",
          "description": "A 2-3 sentence description of what the project does and the problem it solves.",
          "tech": ["Tech1", "Tech2", "Tech3"],
          "link": "#",
          "featured": true
        }
      ],
      "experience": [
        {
          "title": "Job Title",
          "company": "Company Name (make it sound realistic)",
          "period": "YYYY - YYYY",
          "description": "2-3 sentences about their responsibilities and achievements."
        }
      ]
    }

    Rules:
    - Generate 4 to 6 skills with realistic proficiency levels (70-100).
    - Generate 3 detailed, professional dummy projects based on their profession.
    - Generate 2 realistic dummy work experiences.
    - DO NOT include markdown code fences (like \`\`\`json). Return raw JSON only.
    - Make the content highly professional.
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: systemPrompt },
              { text: `User Description: "${prompt}"` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini Error:", errorText);
      throw new Error(`Gemini API Error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the text response
    let aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Clean up potential markdown formatting if Gemini returns it
    aiText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      const parsedData = JSON.parse(aiText);
      return NextResponse.json({ data: parsedData });
    } catch (parseError) {
      console.error("Failed to parse AI JSON:", aiText);
      return NextResponse.json({ error: 'Failed to generate a valid portfolio structure' }, { status: 500 });
    }

  } catch (error: any) {
    console.error("AI Generation Route Error:", error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate portfolio' },
      { status: 500 }
    );
  }
}
