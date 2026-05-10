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

    // 3. Run ML prediction, geo risk, and reality check in parallel
    const [mlResult, geoResult, realityResult] = await Promise.all([
      mlService.predict(geminiResult),
      geoRiskService.analyze(geminiResult.geo_risk),
      realityCheckService.analyze(geminiResult.reality_check),
    ]);

    // 4. Generate scan ID
    const scanId = nanoid(10);

    // 5. Format final response
    const finalResponse = responseFormatter.format({
      scanId,
      inputType: payload.type,
      geminiResult,
      mlResult,
      geoResult,
      realityResult,
    });

    // 6. Fire-and-forget log — never await
    logService.save(finalResponse).catch(console.error);

    // 7. Send response
    return res.status(200).json(finalResponse);
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    }

    console.error('Scan pipeline error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during scan analysis',
    });
  }
};
