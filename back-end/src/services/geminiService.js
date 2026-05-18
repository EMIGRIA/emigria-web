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
    "country": string | null,
    "employment_type": string | null,
    "required_experience": string | null,
    "required_education": string | null,
    "industry": string | null,
    "salary_range": string | null,
    "salary_currency": string | null,
    "company_profile": string | null,
    "description": string | null,
    "requirements": string | null,
    "benefits": string | null,
    "telecommuting": 0 | 1,
    "has_company_logo": 0 | 1,
    "has_questions": 0 | 1
  }
}

Field instructions:
- title: job position title as written in the offer
- location: full location as written, city and country
- country: clean country name ONLY — no city, no extra text.
    "Malaysia, Kuala Lumpur" → country: "Malaysia"
    "Arab Saudi" → country: "Saudi Arabia"
    "Korea Selatan" → country: "South Korea"
    Always use English country name.
- employment_type: Full-time / Part-time / Contract / Internship / null
- required_experience: Mid-Senior level / Entry level / Internship / Not Applicable / null
- required_education: Bachelor's Degree / High School or equivalent / Some College / Master's Degree / null
- industry: industry sector if identifiable, else null
- salary_range: extract numeric value EXACTLY as written, no conversion, no currency symbol.
    "Rp 20.000.000/bulan" → "20000000"
    "MYR 1500-2000" → "1500-2000"
    "gaji kompetitif" → null
- salary_currency: currency written in the brochure.
    IDR or Rupiah mentioned → "IDR"
    MYR / Ringgit → "MYR"
    SAR / Riyal → "SAR"
    SGD → "SGD"
    TWD → "TWD"
    HKD → "HKD"
    Cannot be determined → null
- company_profile: company description if mentioned, else empty string ""
- description: full job description or role summary
- requirements: skills or qualifications needed, else empty string ""
- benefits: benefits or perks mentioned, else empty string ""
- telecommuting: 1 if WFH/remote/work from home mentioned, else 0
- has_company_logo: 1 if company logo clearly visible in image. Always 0 for text/url input.
- has_questions: 1 if screening questions mentioned, else 0`;

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
    if (!parsed.extracted_data) {
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
