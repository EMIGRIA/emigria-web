import { nanoid } from 'nanoid';
import * as inputProcessor from '../services/inputProcessor.js';
import * as geminiService from '../services/geminiService.js';
import * as mlService from '../services/mlService.js';
import * as geoRiskService from '../services/geoRiskService.js';
import * as realityCheckService from '../services/realityCheckService.js';
import * as responseFormatter from '../services/responseFormatter.js';
import * as logService from '../services/logService.js';

export const analyze = async (req, res) => {
  try {
    // 1. Normalize input
    const payload = await inputProcessor.normalize(req.body, req.file);

    // 2. Extract structured data via Gemini
    const geminiResult = await geminiService.extract(payload);

    // 3. Parse potentially multi-country string from Gemini
    const rawCountry = geminiResult.extracted_data.country || '';
    const countries = rawCountry.split(/,\s*/).filter(Boolean);
    const primaryCountry = countries[0] || rawCountry;

    // 4. Run geo risk (per-country) and reality check in parallel
    const [geoResults, realityResult] = await Promise.all([
      // Analyze each country individually, always returns an array
      Promise.all(
        countries.length > 0
          ? countries.map(c => geoRiskService.analyze(c.trim()))
          : [geoRiskService.analyze(rawCountry)]
      ),
      realityCheckService.analyze(
        primaryCountry,
        geminiResult.extracted_data.title,
        geminiResult.extracted_data.salary_range,
        geminiResult.extracted_data.salary_currency
      ),
    ]);

    // 5. Run ML prediction via FastAPI
    const mlResult = await mlService.predict(
      geminiResult.extracted_data
    );

    // 6. Generate scan ID
    const scanId = nanoid(10);

    // 7. Format final response
    const finalResponse = responseFormatter.format({
      scanId,
      inputType: payload.type,
      geminiResult,
      mlResult,
      geoResults,
      realityResult,
    });

    // 7. Fire-and-forget log — never await
    logService.save(finalResponse).catch(console.error);

    // 8. Send response
    return res.status(200).json(finalResponse);
  } catch (err) {
    console.error('Scan pipeline error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during scan analysis',
    });
  }
};
