// Data geo risk berdasarkan geo_risk_simplified.json
// Dikonversi ke object keyed by country name untuk lookup O(1)
export const GEO_RISK_DATA = {
  "Brunei Darussalam": {
    "iso3": "BRN",
    "year": 2025,
    "crime_index": {
      "indicator": "criminality",
      "selected_year": 2025,
      "previous_year": 2023,
      "crime_index": 2.9,
      "crime_level": "low",
      "variation": 0.05,
      "rankings": {
        "region": { "rank": 11, "total": 11 },
        "global": { "rank": 176, "total": 193 }
      },
      "historical": [
        { "year": 2025, "crime_index": 2.9 },
        { "year": 2023, "crime_index": 2.85 },
        { "year": 2021, "crime_index": 2.76 }
      ]
    }
  },
  "Cambodia": {
    "iso3": "KHM",
    "year": 2025,
    "crime_index": {
      "indicator": "criminality",
      "selected_year": 2025,
      "previous_year": 2023,
      "crime_index": 7.02,
      "crime_level": "high",
      "variation": 0.17,
      "rankings": {
        "region": { "rank": 2, "total": 11 },
        "global": { "rank": 17, "total": 193 }
      },
      "historical": [
        { "year": 2025, "crime_index": 7.02 },
        { "year": 2023, "crime_index": 6.85 },
        { "year": 2021, "crime_index": 5.83 }
      ]
    }
  },
  "Indonesia": {
    "iso3": "IDN",
    "year": 2025,
    "crime_index": {
      "indicator": "criminality",
      "selected_year": 2025,
      "previous_year": 2023,
      "crime_index": 6.85,
      "crime_level": "high",
      "variation": 0,
      "rankings": {
        "region": { "rank": 3, "total": 11 },
        "global": { "rank": 24, "total": 193 }
      },
      "historical": [
        { "year": 2025, "crime_index": 6.85 },
        { "year": 2023, "crime_index": 6.85 },
        { "year": 2021, "crime_index": 6.38 }
      ]
    }
  },
  "Laos": {
    "iso3": "LAO",
    "year": 2025,
    "crime_index": {
      "indicator": "criminality",
      "selected_year": 2025,
      "previous_year": 2023,
      "crime_index": 6.37,
      "crime_level": "medium",
      "variation": 0.25,
      "rankings": {
        "region": { "rank": 7, "total": 11 },
        "global": { "rank": 39, "total": 193 }
      },
      "historical": [
        { "year": 2025, "crime_index": 6.37 },
        { "year": 2023, "crime_index": 6.12 },
        { "year": 2021, "crime_index": 5.51 }
      ]
    }
  },
  "Malaysia": {
    "iso3": "MYS",
    "year": 2025,
    "crime_index": {
      "indicator": "criminality",
      "selected_year": 2025,
      "previous_year": 2023,
      "crime_index": 6.53,
      "crime_level": "medium",
      "variation": 0.3,
      "rankings": {
        "region": { "rank": 6, "total": 11 },
        "global": { "rank": 35, "total": 193 }
      },
      "historical": [
        { "year": 2025, "crime_index": 6.53 },
        { "year": 2023, "crime_index": 6.23 },
        { "year": 2021, "crime_index": 5.94 }
      ]
    }
  },
  "Myanmar": {
    "iso3": "MMR",
    "year": 2025,
    "crime_index": {
      "indicator": "criminality",
      "selected_year": 2025,
      "previous_year": 2023,
      "crime_index": 8.08,
      "crime_level": "high",
      "variation": -0.07,
      "rankings": {
        "region": { "rank": 1, "total": 11 },
        "global": { "rank": 1, "total": 193 }
      },
      "historical": [
        { "year": 2025, "crime_index": 8.08 },
        { "year": 2023, "crime_index": 8.15 },
        { "year": 2021, "crime_index": 7.59 }
      ]
    }
  },
  "Philippines": {
    "iso3": "PHL",
    "year": 2025,
    "crime_index": {
      "indicator": "criminality",
      "selected_year": 2025,
      "previous_year": 2023,
      "crime_index": 6.57,
      "crime_level": "medium",
      "variation": -0.06,
      "rankings": {
        "region": { "rank": 5, "total": 11 },
        "global": { "rank": 33, "total": 193 }
      },
      "historical": [
        { "year": 2025, "crime_index": 6.57 },
        { "year": 2023, "crime_index": 6.63 },
        { "year": 2021, "crime_index": 6.84 }
      ]
    }
  },
  "Singapore": {
    "iso3": "SGP",
    "year": 2025,
    "crime_index": {
      "indicator": "criminality",
      "selected_year": 2025,
      "previous_year": 2023,
      "crime_index": 3.72,
      "crime_level": "medium",
      "variation": 0.25,
      "rankings": {
        "region": { "rank": 10, "total": 11 },
        "global": { "rank": 163, "total": 193 }
      },
      "historical": [
        { "year": 2025, "crime_index": 3.72 },
        { "year": 2023, "crime_index": 3.47 },
        { "year": 2021, "crime_index": 3.13 }
      ]
    }
  },
  "Thailand": {
    "iso3": "THA",
    "year": 2025,
    "crime_index": {
      "indicator": "criminality",
      "selected_year": 2025,
      "previous_year": 2023,
      "crime_index": 6.37,
      "crime_level": "medium",
      "variation": 0.19,
      "rankings": {
        "region": { "rank": 7, "total": 11 },
        "global": { "rank": 39, "total": 193 }
      },
      "historical": [
        { "year": 2025, "crime_index": 6.37 },
        { "year": 2023, "crime_index": 6.18 },
        { "year": 2021, "crime_index": 5.76 }
      ]
    }
  },
  "Vietnam": {
    "iso3": "VNM",
    "year": 2025,
    "crime_index": {
      "indicator": "criminality",
      "selected_year": 2025,
      "previous_year": 2023,
      "crime_index": 6.58,
      "crime_level": "medium",
      "variation": 0.03,
      "rankings": {
        "region": { "rank": 4, "total": 11 },
        "global": { "rank": 32, "total": 193 }
      },
      "historical": [
        { "year": 2025, "crime_index": 6.58 },
        { "year": 2023, "crime_index": 6.55 },
        { "year": 2021, "crime_index": 6.28 }
      ]
    }
  },
  "Timor-Leste": {
    "iso3": "TLS",
    "year": 2025,
    "crime_index": {
      "indicator": "criminality",
      "selected_year": 2025,
      "previous_year": 2023,
      "crime_index": 3.98,
      "crime_level": "medium",
      "variation": -0.1,
      "rankings": {
        "region": { "rank": 9, "total": 11 },
        "global": { "rank": 155, "total": 193 }
      },
      "historical": [
        { "year": 2025, "crime_index": 3.98 },
        { "year": 2023, "crime_index": 4.08 },
        { "year": 2021, "crime_index": 3.96 }
      ]
    }
  },
  "Saudi Arabia": {
    "iso3": "SAU",
    "year": 2025,
    "crime_index": {
      "indicator": "criminality",
      "selected_year": 2025,
      "previous_year": 2023,
      "crime_index": 6.33,
      "crime_level": "medium",
      "variation": 0.1,
      "rankings": {
        "region": { "rank": 8, "total": 14 },
        "global": { "rank": 43, "total": 193 }
      },
      "historical": [
        { "year": 2025, "crime_index": 6.33 },
        { "year": 2023, "crime_index": 6.23 },
        { "year": 2021, "crime_index": 6.01 }
      ]
    }
  },
  "United Arab Emirates": {
    "iso3": "ARE",
    "year": 2025,
    "crime_index": {
      "indicator": "criminality",
      "selected_year": 2025,
      "previous_year": 2023,
      "crime_index": 6.35,
      "crime_level": "medium",
      "variation": -0.02,
      "rankings": {
        "region": { "rank": 7, "total": 14 },
        "global": { "rank": 42, "total": 193 }
      },
      "historical": [
        { "year": 2025, "crime_index": 6.35 },
        { "year": 2023, "crime_index": 6.37 },
        { "year": 2021, "crime_index": 5.75 }
      ]
    }
  },
  "China": {
    "iso3": "CHN",
    "year": 2025,
    "crime_index": {
      "indicator": "criminality",
      "selected_year": 2025,
      "previous_year": 2023,
      "crime_index": 6.32,
      "crime_level": "medium",
      "variation": -0.05,
      "rankings": {
        "region": { "rank": 1, "total": 5 },
        "global": { "rank": 45, "total": 193 }
      },
      "historical": [
        { "year": 2025, "crime_index": 6.32 },
        { "year": 2023, "crime_index": 6.37 },
        { "year": 2021, "crime_index": 6.01 }
      ]
    }
  },
  "Japan": {
    "iso3": "JPN",
    "year": 2025,
    "crime_index": {
      "indicator": "criminality",
      "selected_year": 2025,
      "previous_year": 2023,
      "crime_index": 4.25,
      "crime_level": "medium",
      "variation": -0.03,
      "rankings": {
        "region": { "rank": 4, "total": 5 },
        "global": { "rank": 141, "total": 193 }
      },
      "historical": [
        { "year": 2025, "crime_index": 4.25 },
        { "year": 2023, "crime_index": 4.28 },
        { "year": 2021, "crime_index": 4.53 }
      ]
    }
  },
  "South Korea": {
    "iso3": "KOR",
    "year": 2025,
    "crime_index": {
      "indicator": "criminality",
      "selected_year": 2025,
      "previous_year": 2023,
      "crime_index": 4.42,
      "crime_level": "medium",
      "variation": -0.01,
      "rankings": {
        "region": { "rank": 3, "total": 5 },
        "global": { "rank": 134, "total": 193 }
      },
      "historical": [
        { "year": 2025, "crime_index": 4.42 },
        { "year": 2023, "crime_index": 4.43 },
        { "year": 2021, "crime_index": 4.91 }
      ]
    }
  },
  "Turkey": {
    "iso3": "TUR",
    "year": 2025,
    "crime_index": {
      "indicator": "criminality",
      "selected_year": 2025,
      "previous_year": 2023,
      "crime_index": 7.2,
      "crime_level": "high",
      "variation": 0.17,
      "rankings": {
        "region": { "rank": 2, "total": 14 },
        "global": { "rank": 10, "total": 193 }
      },
      "historical": [
        { "year": 2025, "crime_index": 7.2 },
        { "year": 2023, "crime_index": 7.03 },
        { "year": 2021, "crime_index": 6.89 }
      ]
    }
  },
  "Italy": {
    "iso3": "ITA",
    "year": 2025,
    "crime_index": {
      "indicator": "criminality",
      "selected_year": 2025,
      "previous_year": 2023,
      "crime_index": 6.37,
      "crime_level": "medium",
      "variation": 0.15,
      "rankings": {
        "region": { "rank": 1, "total": 8 },
        "global": { "rank": 39, "total": 193 }
      },
      "historical": [
        { "year": 2025, "crime_index": 6.37 },
        { "year": 2023, "crime_index": 6.22 },
        { "year": 2021, "crime_index": 5.81 }
      ]
    }
  },
  "Hong Kong": { // dummy
    "iso3": "HKG",
    "year": 2025,
    "crime_index": {
      "indicator": "criminality",
      "selected_year": 2025,
      "previous_year": 2023,
      "crime_index": 2.15,
      "crime_level": "low",
      "variation": -0.05,
      "rankings": {
        "region": { "rank": 6, "total": 7 },
        "global": { "rank": 140, "total": 193 }
      },
      "historical": [
        { "year": 2025, "crime_index": 2.15 },
        { "year": 2023, "crime_index": 2.2 },
        { "year": 2021, "crime_index": 2.3 }
      ]
    },
    "source_note": "Hong Kong is filled using external proxy data from Numbeo Crime Index by Country 2025, where it boasts extremely low crime rates and high safety levels, normalized to a 0-10 scale."
  },
  "Taiwan": {
    "iso3": "TWN",
    "year": 2025,
    "crime_index": {
      "indicator": "criminality",
      "selected_year": 2025,
      "previous_year": 2024,
      "crime_index": 1.71,
      "crime_level": "low",
      "variation": -0.01,
      "rankings": {
        "region": { "rank": 7, "total": 7 },
        "global": { "rank": 144, "total": 147 }
      },
      "historical": [
        { "year": 2025, "crime_index": 1.71 },
        { "year": 2024, "crime_index": 1.72 }
      ]
    },
    "source_note": "Taiwan is not available in the OCIndex JSON. The crime_index field and regional ranking are filled with external proxy data from Numbeo Crime Index by Country 2025. Regional ranking uses Numbeo Eastern Asia, where Taiwan ranks 7 out of 7 by crime index. Values are normalized to a 0-10 scale to match the existing contract."
  }
};
