import { SALARY_STANDARD_IDR } from '../data/realityCheckData.js';

// Professional exchange rate table for cross-currency comparison (to IDR)
// Updated to 2025 average rates
const EXCHANGE_RATES_TO_IDR = {
  IDR: 1,
  MYR: 3850,
  SGD: 12610,
  BND: 12610,
  SAR: 4392,
  TWD: 540,
  HKD: 2113,
  KRW: 11.6,
  JPY: 110,
  USD: 16473,
  EUR: 18628,
  AED: 4486,
  CNY: 2300,
  PHP: 290,
  THB: 470,
  VND: 0.67,
  LAK: 0.75,
  MMK: 7.6,
  NT: 540,   // Alias for TWD (commonly written as "NT" on brochures)
};

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

const COUNTRY_TO_STANDARD_CURRENCY = {
  'Singapura': 'SGD', 'Filipina': 'PHP', 'Kamboja': 'KHR',
  'Arab Saudi': 'SAR', 'Korea Selatan': 'KRW', 'Uni Emirat Arab': 'AED',
  'Jepang': 'JPY', 'Malaysia': 'MYR', 'Brunei Darussalam': 'BND',
  'Thailand': 'THB', 'Vietnam': 'VND', 'Laos': 'LAK',
  'Myanmar': 'MMK', 'Taiwan': 'TWD', 'Hong Kong': 'HKD',
};

const HIGH_VALUE_CURRENCIES = ['MYR', 'SGD', 'BND', 'SAR', 'TWD', 'HKD', 'USD', 'EUR', 'AED', 'CNY', 'PHP', 'THB', 'JPY'];

// Currency prefix patterns for foreign salary extraction
const CURRENCY_PREFIXES = {
  'TWD': /(?:nt|twd|nt\$|ntd)\s*\.?\s*/gi,
  'MYR': /(?:rm|myr|ringgit)\s*\.?\s*/gi,
  'SGD': /(?:sgd|s\$)\s*\.?\s*/gi,
  'SAR': /(?:sar|riyal|rial|sr)\s*\.?\s*/gi,
  'HKD': /(?:hkd|hk\$)\s*\.?\s*/gi,
  'KRW': /(?:krw|won|₩)\s*\.?\s*/gi,
  'JPY': /(?:jpy|yen|¥)\s*\.?\s*/gi,
  'USD': /(?:usd|us\$|\$)\s*\.?\s*/gi,
  'EUR': /(?:eur|€)\s*\.?\s*/gi,
  'AED': /(?:aed|dirham|dhs)\s*\.?\s*/gi,
  'BND': /(?:bnd|b\$)\s*\.?\s*/gi,
};

// --- Shared helpers ---

/** Convert a currency amount to IDR */
function toIdr(amount, currency) {
  return amount * (EXCHANGE_RATES_TO_IDR[currency] || 1);
}

/** Compare offered vs standard and return a flag string (or null if OK) */
function compareFlag(offeredIdr, standardIdr, flagTooHigh, flagTooLow) {
  if (offeredIdr > standardIdr * 2) return flagTooHigh;
  if (offeredIdr < standardIdr) return flagTooLow;
  return null;
}

/** Build the final result object (shared by matched-job and fallback paths) */
function buildResult({ dataAvailable, offered, offCurr, standardMin, standardMax, source, flag, compareCurr }) {
  const offeredIdr = offered !== null ? toIdr(offered, offCurr) : null;
  return {
    data_available: dataAvailable,
    salary_is_realistic: offered !== null ? (flag === null) : null,
    offered_salary_idr: offeredIdr,
    standard_min_idr: standardMin,
    standard_max_idr: standardMax,
    source,
    currency_note: (offered !== null && compareCurr && offCurr !== compareCurr)
      ? `Mata uang dikonversi ke IDR untuk perbandingan (${offCurr} ${compareCurr ? `vs ${compareCurr}` : '-> IDR'})`
      : null,
    flag: offered !== null ? flag : "Gaji tidak dapat dideteksi dari brosur",
  };
}

// --- Number parsing ---

function parseValueString(numStr, hasJuta) {
  if (hasJuta) {
    const parsed = parseFloat(numStr.replace(',', '.'));
    return isNaN(parsed) ? null : parsed * 1_000_000;
  }
  const dotCount = (numStr.match(/\./g) || []).length;
  const commaCount = (numStr.match(/,/g) || []).length;

  if (dotCount > 1 || commaCount > 1) {
    return parseFloat(numStr.replace(/[.,]/g, ''));
  }
  if (dotCount === 1 && commaCount === 1) {
    return numStr.indexOf('.') < numStr.indexOf(',')
      ? parseFloat(numStr.replace(/\./g, '').replace(',', '.'))
      : parseFloat(numStr.replace(/,/g, ''));
  }
  if (dotCount === 1) {
    const parts = numStr.split('.');
    return (parts[1].length === 3 && parseFloat(parts[0]) < 1000)
      ? parseFloat(numStr.replace('.', ''))
      : parseFloat(numStr);
  }
  if (commaCount === 1) {
    const parts = numStr.split(',');
    return (parts[1].length === 3 && parseFloat(parts[0]) < 1000)
      ? parseFloat(numStr.replace(',', ''))
      : parseFloat(numStr.replace(',', '.'));
  }
  return parseFloat(numStr);
}

// --- Salary extraction ---

/** Detect if raw text contains BOTH foreign currency AND IDR amounts */
function textContainsBothCurrencies(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  const hasForeign = /\b(nt|twd|myr|sgd|sar|hkd|krw|jpy|usd|eur|aed|cny|php|thb|vnd|lak|mmk|bnd|rm|riyal|rial|dollar|won|yen|yuan|dirham|baht|dong|ringgit)\b/i.test(lower);
  const hasIdr = /\b(rp\.?|idr|rupiah)\b/i.test(lower) || lower.includes('juta') || lower.includes('jt');
  return hasForeign && hasIdr;
}

/** Check for "juta"/"jt" keywords (always IDR) */
function hasJutaKeyword(text) {
  const lower = text.toLowerCase();
  return lower.includes('juta') || lower.includes('jt') || lower.includes('million') || lower.includes('mio');
}

/** Extract IDR equivalent from raw salary text (e.g. "Setara Rp. 15.500.000") */
function extractIdrSalary(salaryRangeStr) {
  if (!salaryRangeStr) return null;
  const raw = String(salaryRangeStr);
  const hasJuta = hasJutaKeyword(raw);

  // 1. "setara" pattern — most explicit IDR equivalent
  const setaraMatch = raw.match(/setara[\s\-\+~:=]*(?:rp\.?\s*)?([0-9]+(?:[.,][0-9]+)*)/i);
  if (setaraMatch) {
    const val = parseValueString(setaraMatch[1], hasJuta);
    if (val !== null && val >= 100_000) return val;
  }

  // 2. "Rp" / "Rp." followed by number — collect ALL matches, pick largest
  const rpRegex = /rp\.?\s*([0-9]+(?:[.,][0-9]+)*)/gi;
  const rpCandidates = [];
  let m;
  while ((m = rpRegex.exec(raw)) !== null) {
    const val = parseValueString(m[1], hasJuta);
    if (val !== null && val > 0) rpCandidates.push(val);
  }
  if (rpCandidates.length > 0) {
    const best = Math.max(...rpCandidates);
    if (best >= 100_000) return best;
  }

  // 3. Standalone "juta"/"jt" without "Rp" prefix
  if (hasJuta) {
    const jutaMatch = raw.match(/([0-9]+(?:[.,][0-9]+)*)\s*(?:juta|jt)/i);
    if (jutaMatch) {
      const val = parseValueString(jutaMatch[1], true);
      if (val !== null && val >= 1_000_000) return val;
    }
  }

  // 4. "IDR" followed by number
  const idrMatch = raw.match(/idr[\s.:]*([0-9]+(?:[.,][0-9]+)*)/i);
  if (idrMatch) {
    const val = parseValueString(idrMatch[1], hasJuta);
    if (val !== null && val >= 100_000) return val;
  }

  return null;
}

/** Extract foreign currency salary value from text */
function extractForeignSalary(salaryRangeStr, destinationCurrency) {
  if (!salaryRangeStr || !destinationCurrency || destinationCurrency === 'IDR') return null;
  const raw = String(salaryRangeStr);
  const prefix = CURRENCY_PREFIXES[destinationCurrency];
  if (!prefix) return null;

  let m;
  while ((m = prefix.exec(raw)) !== null) {
    const afterPrefix = raw.substring(m.index + m[0].length);
    const numMatch = afterPrefix.match(/^([0-9]+(?:[.,][0-9]+)*)/);
    if (numMatch) {
      const val = parseValueString(numMatch[1], false);
      if (val !== null && val > 0) return { value: val, currency: destinationCurrency };
    }
  }
  return null;
}

/** Simple first-number parser for fallback */
function parseSalary(salaryRange) {
  if (salaryRange == null) return null;
  const normalized = String(salaryRange).toLowerCase().trim();
  const hasJuta = hasJutaKeyword(normalized);
  const matches = normalized.match(/[0-9]+([.,][0-9]+)*/g);
  if (!matches || matches.length === 0) return null;
  return parseValueString(matches[0], hasJuta);
}

// --- Job matching ---

function findMatchingJob(countryJobs, title) {
  if (!title || !countryJobs) return null;
  const t = title.toLowerCase().trim();
  const jobs = Object.keys(countryJobs);

  // Exact → substring → word-overlap
  const match = jobs.find(j => j.toLowerCase() === t)
    || jobs.find(j => { const jl = j.toLowerCase(); return jl.includes(t) || t.includes(jl); })
    || (() => {
      const words = t.split(/\s+/).filter(w => w.length > 3);
      return words.length > 0
        ? jobs.find(j => words.some(w => j.toLowerCase().includes(w)))
        : undefined;
    })();

  return match ? { jobName: match, ...countryJobs[match] } : null;
}

// --- Currency detection heuristics ---

function detectCurrency(offered, salaryRange, salaryCurrency, canonicalCountry, hasBothCurrencies) {
  let offCurr = (salaryCurrency || "IDR").toUpperCase();

  // HEURISTIC 1: IDR keywords override — only if no foreign currency also present
  if (salaryRange && !hasBothCurrencies) {
    const rawLower = String(salaryRange).toLowerCase();
    if (['rp', 'idr', 'juta', 'jt', 'rupiah'].some(kw => rawLower.includes(kw))) {
      offCurr = "IDR";
    }
  }

  // HEURISTIC 2: Value >= 500k is almost certainly IDR
  if (offered !== null && offered >= 500_000 && HIGH_VALUE_CURRENCIES.includes(offCurr)) {
    offCurr = "IDR";
  }

  // HEURISTIC 3: Value too low for IDR → must be destination currency
  if (offered !== null && offered < 150_000 && canonicalCountry && canonicalCountry !== 'Indonesia') {
    const standardCurr = COUNTRY_TO_STANDARD_CURRENCY[canonicalCountry];
    if (standardCurr) {
      const rawLower = salaryRange ? String(salaryRange).toLowerCase() : '';
      const explicitlyIdr = !hasBothCurrencies && (rawLower.includes('rp') || rawLower.includes('idr') || rawLower.includes('rupiah'));
      if (!explicitlyIdr) offCurr = standardCurr;
    }
  }

  return offCurr;
}

// --- Main export ---

export function analyze(country, jobTitle, salaryRange, salaryCurrency) {
  const canonicalCountry = country ? CANONICAL_COUNTRY_MAP[country.toLowerCase().trim()] : null;
  const hasBothCurrencies = textContainsBothCurrencies(salaryRange);

  // Step 1: Try to extract IDR salary directly (e.g. "Setara Rp 15.500.000")
  let offered = extractIdrSalary(salaryRange);
  let offCurr = "IDR";

  // Step 2: Fallback — parse raw value and detect currency via heuristics
  if (offered === null) {
    const destCurrency = canonicalCountry ? COUNTRY_TO_STANDARD_CURRENCY[canonicalCountry] : null;

    // Try foreign currency extraction + conversion when both currencies present
    if (hasBothCurrencies && destCurrency && destCurrency !== 'IDR') {
      const foreignResult = extractForeignSalary(salaryRange, destCurrency);
      if (foreignResult) {
        offered = Math.round(toIdr(foreignResult.value, foreignResult.currency));
        offCurr = "IDR";
      }
    }

    // Final fallback: parse first number + heuristic currency detection
    if (offered === null) {
      offered = parseSalary(salaryRange);
      offCurr = detectCurrency(offered, salaryRange, salaryCurrency, canonicalCountry, hasBothCurrencies);
    }
  }

  // Step 3: Look up standard salary data
  const countryJobs = canonicalCountry ? SALARY_STANDARD_IDR[canonicalCountry] : null;
  const matchedJob = findMatchingJob(countryJobs, jobTitle);

  if (matchedJob) {
    const realCurr = (matchedJob.currency || "IDR").toUpperCase();
    const realInIdr = toIdr(matchedJob.gaji, realCurr);
    const offeredIdr = offered !== null ? toIdr(offered, offCurr) : null;

    const flag = offeredIdr !== null
      ? compareFlag(offeredIdr, realInIdr, "Gaji ditawarkan tidak realistis (terlalu tinggi)", "Gaji ditawarkan di bawah standar lowongan resmi SISKOP2MI")
      : null;

    return buildResult({
      dataAvailable: true, offered, offCurr,
      standardMin: realInIdr, standardMax: realInIdr,
      source: `SISKOP2MI BP2MI - Lowongan Resmi: ${matchedJob.jobName}`,
      flag, compareCurr: realCurr,
    });
  }

  // Step 4: Dynamic fallback — use country average
  let fallbackMin = 3_000_000, fallbackMax = 5_000_000;
  let source = "BP2MI 2024 (estimasi)";

  if (countryJobs) {
    const salaries = Object.values(countryJobs)
      .map(d => toIdr(d.gaji, d.currency.toUpperCase()))
      .filter(s => s > 0);
    if (salaries.length > 0) {
      const avg = salaries.reduce((a, b) => a + b, 0) / salaries.length;
      fallbackMin = Math.round(avg * 0.8);
      fallbackMax = Math.round(avg * 1.2);
      source = `SISKOP2MI BP2MI - Rata-rata Regional ${canonicalCountry}`;
    }
  }

  const offeredIdr = offered !== null ? toIdr(offered, offCurr) : null;
  const flag = offeredIdr !== null
    ? compareFlag(offeredIdr, fallbackMax, "Gaji ditawarkan tidak realistis (terlalu tinggi)", "Gaji ditawarkan di bawah standar rata-rata BP2MI regional")
    : null;

  // For fallback "too low" comparison, use fallbackMin instead of fallbackMax
  const fallbackFlag = offeredIdr !== null
    ? (offeredIdr > fallbackMax * 2 ? "Gaji ditawarkan tidak realistis (terlalu tinggi)" :
       offeredIdr < fallbackMin ? "Gaji ditawarkan di bawah standar rata-rata BP2MI regional" : null)
    : null;

  return buildResult({
    dataAvailable: offered !== null,
    offered, offCurr,
    standardMin: fallbackMin, standardMax: fallbackMax,
    source, flag: fallbackFlag,
    compareCurr: offCurr !== "IDR" ? "IDR" : null,
  });
}