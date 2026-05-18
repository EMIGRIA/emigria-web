/**
 * ML Service
 * Role    : Forward extracted job data to FastAPI AI service,
 *           return fraud prediction result
 * Status  : LIVE — connected to real FastAPI Docker service
 * Endpoint: POST http://localhost:8000/predict
 *           (configured via ML_SERVICE_URL env variable)
 */

import axiosClient from '../utils/axiosClient.js';
import { ML_SERVICE_URL } from '../config/env.js';

const FALLBACK_RESULT = {
  ml_fraud_probability: null,
  ml_fraud_prediction: null,
  pmi_rule_score: null,
  triggered_rules: [],
  fraud_prediction: null,
  risk_level: 'UNKNOWN',
  threshold: null,
  pmi_rule_threshold: null,
  is_fallback: true,
};

export async function predict(extractedData) {
  const d = extractedData || {};

  // Map extractedData to FastAPI request schema
  const requestBody = {
    title: d.title || '',
    location: d.location || '',
    country: d.country || '',
    salary_range: d.salary_range || '',
    description: d.description || '',
    requirements: d.requirements || '',
    company_profile: d.company_profile || '',
    employment_type: d.employment_type || 'Unknown',
    industry: d.industry || 'Unknown',
    benefits: d.benefits || '',
    required_experience: d.required_experience || 'Not Specified',
    required_education: d.required_education || 'Not Specified',
    telecommuting: d.telecommuting ?? 0,
    has_company_logo: d.has_company_logo ?? 0,
    has_questions: d.has_questions ?? 0,
  };

  try {
    const { data } = await axiosClient.post(
      `${ML_SERVICE_URL}/predict`,
      requestBody
    );

    return { ...data, is_fallback: false };
  } catch (err) {
    console.warn(
      '[mlService] FastAPI unreachable, using fallback —',
      err.message
    );
    return { ...FALLBACK_RESULT };
  }
}