import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../config/env.js';

const SYSTEM_PROMPT = `You are an information extraction system for Emigria, an app that detects possible fraud in overseas job offers for Indonesian migrant workers.
Your task is to extract structured JSON from the provided job poster, image, OCR text, or job description.
Return ONLY valid JSON. Do not include markdown, explanation, comments, or extra text.
Use this exact JSON schema:
{
  "extracted_data": {
    "title": "",
    "location": "",
    "country": "",
    "salary_range": "",
    "salary_currency": null,
    "description": "",
    "requirements": "",
    "company_profile": "",
    "employment_type": "Unknown",
    "industry": "Unknown",
    "benefits": "",
    "required_experience": "Not Specified",
    "required_education": "Not Specified",
    "telecommuting": 0,
    "has_company_logo": 0,
    "has_questions": 0,
    
Rules:
1. Return valid JSON only.
2. Do not invent information that is not present.
3. If a field is missing, use the default value from the schema.
4. Keep text fields in the original language found in the poster.
5. For "country", infer the destination country if clearly mentioned. Always use English country name.
6. For "salary_range", preserve the FULL salary text exactly as written, including ALL currencies and equivalents. If the text shows both foreign currency and IDR equivalent (e.g. "Gaji NT 28.590/Bln (Setara -+ Rp. 15.500.000,-)"), include the ENTIRE string with both amounts.
7. For "salary_currency": Use the PRIMARY currency code (the destination country's currency). IDR/Rupiah → "IDR", MYR/Ringgit → "MYR", SAR/Riyal → "SAR", SGD → "SGD", TWD/NT → "TWD", HKD → "HKD", KRW/Won → "KRW", JPY/Yen → "JPY", AED/Dirham → "AED", BND → "BND". If the text shows BOTH a foreign currency AND an IDR equivalent, set salary_currency to the FOREIGN currency code (not IDR). Cannot be determined → null.
8. Set "has_company_logo" to 1 only if a company logo is visible or explicitly mentioned. Otherwise 0.
9. Set "has_questions" to 1 only if screening questions, interview questions, or application questions are present. Otherwise 0.
10. Set "telecommuting" to 1 only if the job is remote/work from home. Otherwise 0.
11. Set "company_identity_clear" to true only if company name, profile, address, or official identity is clear.
12. Set "uses_personal_contact" to true if the job uses WhatsApp, personal phone number, personal email, Gmail/Yahoo/Hotmail, or informal contact as the main application method.
13. Set "urgency_level" to one of: "low", "medium", "high".
14. Fill "risk_keywords" with exact suspicious phrases found in the input.`;

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
