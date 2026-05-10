import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../config/env.js';

const SYSTEM_PROMPT = `You are an expert job fraud detection system.
Analyze the provided job offer and return a single JSON object.
You MUST respond with ONLY valid JSON — no markdown, no explanation, no code fences. Just the raw JSON object.
Use null for any field you cannot determine with confidence.

{
  "extracted_data": {
    "title": string | null,
    "location": string | null,
    "department": string | null,
    "salary_range": string | null,
    "company_profile": string | null,
    "description": string | null,
    "requirements": string | null,
    "benefits": string | null,
    "telecommuting": 0 | 1,
    "has_company_logo": 0 | 1,
    "has_questions": 0 | 1,
    "employment_type": string | null,
    "required_experience": string | null,
    "required_education": string | null,
    "industry": string | null,
    "function": string | null
  },
  "reality_check": {
    "salary_is_realistic": boolean,
    "realistic_salary_range": string | null,
    "salary_gap_assessment": string | null,
    "suspicious_promises": string[],
    "red_flags": string[],
    "assessment_summary": string | null
  },
  "geo_risk": {
    "country_identified": string | null,
    "risk_level": "low"|"medium"|"high"|"critical"|null,
    "risk_score": number | null,
    "risk_factors": string[],
    "worker_safety_notes": string | null,
    "is_known_high_risk": boolean
  }
}

Field instructions:
- salary_range: normalize any format:
    "3-5 juta" → "3000000-5000000 IDR/month"
    "$2000/month" → "2000 USD/month"
    "SAR 1500" → "1500 SAR/month"
    vague/unclear → null
- telecommuting: 1 if WFH/remote/work from home mentioned
- has_company_logo: 1 if logo clearly visible in image.
  Always 0 for text/url input.
- has_questions: 1 if screening questions mentioned
- employment_type: Full-time/Part-time/Contract/Internship
- required_experience: Mid-Senior level/Entry level/Internship/Not Applicable
- required_education: Bachelor's Degree/High School/Some College/Master's Degree
- reality_check fields: in simple Bahasa Indonesia
- geo_risk fields: in simple Bahasa Indonesia
- geo_risk.risk_score: float 0.0 to 1.0`;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  systemInstruction: SYSTEM_PROMPT,
  generationConfig: {
    // Force Gemini to respond ONLY with pure JSON
    responseMimeType: "application/json",
  }
});

// Process data using Gemini AI and return structured JSON
export async function extract(normalizedInput) {
  try {
    const parts = [];

    // Prepare payload based on input type
    if (normalizedInput.type === 'text' || normalizedInput.type === 'url') {
      parts.push(`Analyze this job offer:\n\n${normalizedInput.content}`);
    } else if (normalizedInput.type === 'image') {
      parts.push({
        inlineData: {
          data: normalizedInput.content,
          mimeType: normalizedInput.mimeType
        }
      });
      parts.push("Analyze the job offer in this image.");
    }

    // Send request to Gemini API
    const result = await model.generateContent(parts);
    const responseText = result.response.text();
    
    // Parse response as JSON
    const parsed = JSON.parse(responseText);
    
    // Validate the JSON structure safely
    if (!parsed.extracted_data || !parsed.reality_check || !parsed.geo_risk) {
      throw new Error('Gemini tidak mengembalikan struktur JSON yang lengkap');
    }
    
    return parsed;
  } catch (error) {
    console.error('Error saat memanggil SDK Gemini:', error);
    const err = new Error('Gagal memproses analisis menggunakan AI');
    err.statusCode = 502; // Beri kode 502 agar konsisten
    throw err;
  }
}
