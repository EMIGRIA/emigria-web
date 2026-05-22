import { GEO_RISK_DATA } from '../data/geoRiskData.js';

// Canonical country map to align English/Indonesian inputs with geoRiskData keys
const CANONICAL_COUNTRY_MAP = {
  'singapore': 'Singapore',
  'singapura': 'Singapore',
  'philippines': 'Philippines',
  'filipina': 'Philippines',
  'cambodia': 'Cambodia',
  'kamboja': 'Cambodia',
  'saudi arabia': 'Saudi Arabia',
  'arab saudi': 'Saudi Arabia',
  'south korea': 'South Korea',
  'korea selatan': 'South Korea',
  'uae': 'United Arab Emirates',
  'united arab emirates': 'United Arab Emirates',
  'uni emirat arab': 'United Arab Emirates',
  'japan': 'Japan',
  'jepang': 'Japan',
  'china': 'China',
  'malaysia': 'Malaysia',
  'brunei darussalam': 'Brunei Darussalam',
  'brunei': 'Brunei Darussalam',
  'thailand': 'Thailand',
  'vietnam': 'Vietnam',
  'laos': 'Laos',
  'myanmar': 'Myanmar',
  'timor-leste': 'Timor-Leste',
  'timor leste': 'Timor-Leste',
  'taiwan': 'Taiwan',
  'hong kong': 'Hong Kong',
  'hongkong': 'Hong Kong',
  'turkey': 'Turkey',
  'turki': 'Turkey',
  'italy': 'Italy',
  'italia': 'Italy',
  'indonesia': 'Indonesia',
};

// Static geo risk lookup dari geoRiskData — berbasis struktur geo_risk_simplified.json
export function analyze(country) {
  const normalizedCountry = country ? country.toLowerCase().trim() : null;
  const canonicalCountry = normalizedCountry ? CANONICAL_COUNTRY_MAP[normalizedCountry] : null;
  
  let data = canonicalCountry ? (GEO_RISK_DATA[canonicalCountry] ?? null) : null;
  
  // Case-insensitive fallback lookup
  if (!data && normalizedCountry) {
    for (const key of Object.keys(GEO_RISK_DATA)) {
      if (key.toLowerCase() === normalizedCountry) {
        data = GEO_RISK_DATA[key];
        break;
      }
    }
  }

  const resolvedCountry = data ? (canonicalCountry || country) : country;

  if (!data) {
    return {
      country: country ?? null,
      data_available: false,
      risk_level: 'MEDIUM',
      risk_score: 0.5,
      crime_index: null,
      crime_level: null,
      crime_variation: null,
      crime_rankings: null,
      crime_historical: null,
      iso3: null,
      year: null,
      source_note: null,
    };
  }

  const ci = data.crime_index;
  const crimeIndex = ci?.crime_index ?? null;
  const crimeLevel = ci?.crime_level ?? 'medium';
  
  // Normalisasi risk_level ke uppercase untuk konsistensi frontend
  const riskLevel = crimeLevel.toUpperCase();

  // Kalkulasi risk_score kontinu skala 0-1 langsung dari crime_index skala 0-10
  const riskScore = crimeIndex !== null ? Number((crimeIndex / 10).toFixed(3)) : 0.5;

  return {
    country: resolvedCountry,
    data_available: true,
    iso3: data.iso3,
    year: data.year,
    risk_level: riskLevel,
    risk_score: riskScore,
    crime_index: crimeIndex,
    crime_level: crimeLevel,
    crime_variation: ci?.variation ?? null,
    crime_rankings: ci?.rankings ?? null,
    crime_historical: ci?.historical ?? null,
    source_note: data.source_note ?? null,
  };
}