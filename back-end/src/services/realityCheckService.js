import { SALARY_STANDARD_IDR } from '../config/constants.js';

// Compare offered salary (IDR) against BP2MI standard — no longer uses Gemini output
export function analyze(country, salaryRange, salaryCurrency) {
  const standard = SALARY_STANDARD_IDR[country] ?? SALARY_STANDARD_IDR["default"];

  // Parse offered salary: strip non-numeric/non-dash, take first number
  let offered = null;
  if (salaryRange != null) {
    const cleaned = String(salaryRange).replace(/[^0-9\-]/g, '');
    const parts = cleaned.split('-');
    const parsed = parseFloat(parts[0]);
    if (!isNaN(parsed)) {
      offered = parsed;
    }
  }

  // Currency is not IDR — cannot compare automatically
  if (salaryCurrency != null && salaryCurrency !== 'IDR') {
    return {
      data_available: false,
      salary_is_realistic: null,
      offered_salary_idr: null,
      standard_min_idr: standard.min_salary,
      standard_max_idr: standard.max_salary,
      source: standard.source,
      currency_note: "Gaji bukan dalam IDR — perlu verifikasi manual",
      flag: "Mata uang gaji tidak dalam IDR, tidak dapat dibandingkan otomatis",
    };
  }

  // Salary could not be detected from the brochure
  if (offered === null) {
    return {
      data_available: false,
      salary_is_realistic: null,
      offered_salary_idr: null,
      standard_min_idr: standard.min_salary,
      standard_max_idr: standard.max_salary,
      source: standard.source,
      currency_note: null,
      flag: "Gaji tidak dapat dideteksi dari brosur",
    };
  }

  // Determine flag based on salary comparison
  let flag = null;
  if (offered > standard.max_salary * 2) {
    flag = "Gaji ditawarkan lebih dari 2x standar BP2MI — tidak realistis";
  } else if (offered < standard.min_salary) {
    flag = "Gaji ditawarkan di bawah standar minimum BP2MI";
  }

  return {
    data_available: true,
    salary_is_realistic: flag === null,
    offered_salary_idr: offered,
    standard_min_idr: standard.min_salary,
    standard_max_idr: standard.max_salary,
    source: standard.source,
    currency_note: null,
    flag,
  };
}