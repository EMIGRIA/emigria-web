import { SALARY_STANDARD_IDR } from '../data/realityCheckData.js';

// Professional exchange rate table for cross-currency comparison (to IDR)
const EXCHANGE_RATES_TO_IDR = {
  IDR: 1,
  MYR: 3500,
  SGD: 11800,
  BND: 11800,
  SAR: 4200,
  TWD: 500,
  HKD: 2000,
  KRW: 12,
  JPY: 100,
  USD: 16000,
  EUR: 17200,
  AED: 4300,
  CNY: 2200,
  PHP: 280,
  THB: 440,
  VND: 0.65,
  LAK: 0.75,
  MMK: 7.6,
};

// Canonical country map to align English/Indonesian inputs with constants.js keys
const CANONICAL_COUNTRY_MAP = {
  'singapore': 'Singapura',
  'philippines': 'Filipina',
  'cambodia': 'Kamboja',
  'saudi arabia': 'Arab Saudi',
  'south korea': 'Korea Selatan',
  'uae': 'Uni Emirat Arab',
  'united arab emirates': 'Uni Emirat Arab',
  'japan': 'Jepang',
  'china': 'China',
  'malaysia': 'Malaysia',
  'brunei darussalam': 'Brunei Darussalam',
  'brunei': 'Brunei Darussalam',
  'thailand': 'Thailand',
  'vietnam': 'Vietnam',
  'laos': 'Laos',
  'myanmar': 'Myanmar',
  'timor-leste': 'Timor-Leste',
  'taiwan': 'Taiwan',
  'hong kong': 'Hong Kong',
  'hongkong': 'Hong Kong',
  'singapura': 'Singapura',
  'filipina': 'Filipina',
  'kamboja': 'Kamboja',
  'arab saudi': 'Arab Saudi',
  'korea selatan': 'Korea Selatan',
  'uni emirat arab': 'Uni Emirat Arab',
  'jepang': 'Jepang',
  'timor leste': 'Timor-Leste',
};

// Robust fuzzy, case-insensitive job matching
function findMatchingJob(countryJobs, title) {
  if (!title || !countryJobs) return null;
  const normalizedTitle = title.toLowerCase().trim();
  
  // 1. Exact match (case insensitive)
  for (const job of Object.keys(countryJobs)) {
    if (job.toLowerCase() === normalizedTitle) {
      return { jobName: job, ...countryJobs[job] };
    }
  }
  
  // 2. Fuzzy match (substring match)
  for (const job of Object.keys(countryJobs)) {
    const jobLower = job.toLowerCase();
    if (jobLower.includes(normalizedTitle) || normalizedTitle.includes(jobLower)) {
      return { jobName: job, ...countryJobs[job] };
    }
  }
  
  // 3. Word overlap match
  const titleWords = normalizedTitle.split(/\s+/).filter(w => w.length > 3);
  if (titleWords.length > 0) {
    for (const job of Object.keys(countryJobs)) {
      const jobLower = job.toLowerCase();
      if (titleWords.some(word => jobLower.includes(word))) {
        return { jobName: job, ...countryJobs[job] };
      }
    }
  }
  
  return null;
}
// Robust parser for salary ranges/values (supporting 'juta', 'jt', 'million', 'mio')
function parseSalary(salaryRange) {
  if (salaryRange == null) return null;
  const original = String(salaryRange);
  const normalized = original.toLowerCase().trim();

  // Check if it contains millions indicators
  const hasJuta = normalized.includes('juta') || normalized.includes('jt') || normalized.includes('million') || normalized.includes('mio');

  // Extract first group of numbers, dots, and commas
  const matches = normalized.match(/[0-9]+([.,][0-9]+)*/g);
  if (!matches || matches.length === 0) return null;

  const firstNumStr = matches[0];
  let parsedVal = null;

  if (hasJuta) {
    // Treat as a decimal number (like "13", "13.5", "13,5")
    const cleaned = firstNumStr.replace(',', '.');
    parsedVal = parseFloat(cleaned);
    if (!isNaN(parsedVal)) {
      parsedVal = parsedVal * 1000000;
    }
  } else {
    const dotCount = (firstNumStr.match(/\./g) || []).length;
    const commaCount = (firstNumStr.match(/,/g) || []).length;

    if (dotCount > 1 || commaCount > 1) {
      // Thousands separators
      const cleaned = firstNumStr.replace(/[.,]/g, '');
      parsedVal = parseFloat(cleaned);
    } else if (dotCount === 1 && commaCount === 1) {
      const dotIndex = firstNumStr.indexOf('.');
      const commaIndex = firstNumStr.indexOf(',');
      if (dotIndex < commaIndex) {
        // IDR style: "13.000,00"
        const cleaned = firstNumStr.replace(/\./g, '').replace(',', '.');
        parsedVal = parseFloat(cleaned);
      } else {
        // EN style: "13,000.00"
        const cleaned = firstNumStr.replace(/,/g, '');
        parsedVal = parseFloat(cleaned);
      }
    } else if (dotCount === 1) {
      const parts = firstNumStr.split('.');
      if (parts[1].length === 3 && parseFloat(parts[0]) < 1000) {
        // Thousands separator
        parsedVal = parseFloat(firstNumStr.replace('.', ''));
      } else {
        // Decimal
        parsedVal = parseFloat(firstNumStr);
      }
    } else if (commaCount === 1) {
      const parts = firstNumStr.split(',');
      if (parts[1].length === 3 && parseFloat(parts[0]) < 1000) {
        // Thousands separator
        parsedVal = parseFloat(firstNumStr.replace(',', ''));
      } else {
        // Decimal
        parsedVal = parseFloat(firstNumStr.replace(',', '.'));
      }
    } else {
      parsedVal = parseFloat(firstNumStr);
    }
  }

  return parsedVal;
}

// Compare offered salary against BP2MI standard
export function analyze(country, jobTitle, salaryRange, salaryCurrency) {
  // Parse offered salary using robust parseSalary function
  const offered = parseSalary(salaryRange);

  // Get jobs for the specific country from constants
  const canonicalCountry = country ? CANONICAL_COUNTRY_MAP[country.toLowerCase().trim()] : null;
  const countryJobs = canonicalCountry ? SALARY_STANDARD_IDR[canonicalCountry] : null;

  // Attempt to match job title
  const matchedJob = findMatchingJob(countryJobs, jobTitle);

  if (matchedJob) {
    const realSalary = matchedJob.gaji;
    const realCurrency = matchedJob.currency || "IDR";

    const offCurr = (salaryCurrency || "IDR").toUpperCase();
    const realCurr = realCurrency.toUpperCase();

    const rateOffered = EXCHANGE_RATES_TO_IDR[offCurr] || 1;
    const rateReal = EXCHANGE_RATES_TO_IDR[realCurr] || 1;

    const realInIdr = realSalary * rateReal;

    // Handle case where offered salary is not detected
    if (offered === null) {
      return {
        data_available: true,
        salary_is_realistic: null,
        offered_salary_idr: null,
        standard_min_idr: realInIdr,
        standard_max_idr: realInIdr,
        source: `SISKOP2MI BP2MI - Lowongan Resmi: ${matchedJob.jobName}`,
        currency_note: null,
        flag: "Gaji tidak dapat dideteksi dari brosur",
      };
    }

    const offeredInIdr = offered * rateOffered;

    let flag = null;
    if (offeredInIdr > realInIdr * 2) {
      flag = "Gaji ditawarkan tidak realistis (terlalu tinggi)";
    } else if (offeredInIdr < realInIdr) {
      flag = "Gaji ditawarkan di bawah standar lowongan resmi SISKOP2MI";
    }

    return {
      data_available: true,
      salary_is_realistic: flag === null,
      offered_salary_idr: offeredInIdr,
      standard_min_idr: realInIdr,
      standard_max_idr: realInIdr,
      source: `SISKOP2MI BP2MI - Lowongan Resmi: ${matchedJob.jobName}`,
      currency_note: offCurr !== realCurr ? `Mata uang dikonversi ke IDR untuk perbandingan (${offCurr} vs ${realCurr})` : null,
      flag,
    };
  }

  // Dynamic fallback: compute average salary from country-level jobs or use global default
  let countryFallbackMin = 3000000;
  let countryFallbackMax = 5000000;
  let source = "BP2MI 2024 (estimasi)";

  if (countryJobs) {
    const salariesInIdr = Object.entries(countryJobs).map(([jobName, data]) => {
      const rate = EXCHANGE_RATES_TO_IDR[data.currency.toUpperCase()] || 1;
      return data.gaji * rate;
    }).filter(s => s > 0);

    if (salariesInIdr.length > 0) {
      const avg = salariesInIdr.reduce((a, b) => a + b, 0) / salariesInIdr.length;
      countryFallbackMin = Math.round(avg * 0.8);
      countryFallbackMax = Math.round(avg * 1.2);
      source = `SISKOP2MI BP2MI - Rata-rata Regional ${canonicalCountry}`;
    }
  }

  const offCurr = (salaryCurrency || "IDR").toUpperCase();

  if (offered === null) {
    return {
      data_available: false,
      salary_is_realistic: null,
      offered_salary_idr: null,
      standard_min_idr: countryFallbackMin,
      standard_max_idr: countryFallbackMax,
      source,
      currency_note: null,
      flag: "Gaji tidak dapat dideteksi dari brosur",
    };
  }

  // Cross-currency conversion for dynamic regional fallback comparison
  const rateOffered = EXCHANGE_RATES_TO_IDR[offCurr] || 1;
  const offeredInIdr = offered * rateOffered;

  let flag = null;
  if (offeredInIdr > countryFallbackMax * 2) {
    flag = "Gaji ditawarkan tidak realistis (terlalu tinggi)";
  } else if (offeredInIdr < countryFallbackMin) {
    flag = "Gaji ditawarkan di bawah standar rata-rata BP2MI regional";
  }

  return {
    data_available: true,
    salary_is_realistic: flag === null,
    offered_salary_idr: offeredInIdr,
    standard_min_idr: countryFallbackMin,
    standard_max_idr: countryFallbackMax,
    source,
    currency_note: offCurr !== "IDR" ? `Mata uang dikonversi ke IDR untuk perbandingan (${offCurr} -> IDR)` : null,
    flag,
  };
}