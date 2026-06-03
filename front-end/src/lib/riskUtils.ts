export const getRiskColor = (level?: string | null): string => {
  if (!level) return "text-text-muted bg-brand-surface border-border-main";
  const map: Record<string, string> = {
    low:      "text-risk-low bg-risk-low/10 border-risk-low/30",
    medium:   "text-risk-medium bg-risk-medium/10 border-risk-medium/30",
    high:     "text-risk-high bg-risk-high/10 border-risk-high/30",
    critical: "text-risk-high bg-risk-high/10 border-risk-high/30",
  };
  return map[level.toLowerCase()] ?? "text-text-muted bg-brand-surface border-border-main";
};

export const getRiskLabel = (level?: string | null): string => {
  if (!level) return "Tidak Diketahui";
  const map: Record<string, string> = {
    low:      "Risiko Rendah",
    medium:   "Risiko Sedang",
    high:     "Risiko Tinggi",
    critical: "Risiko Tinggi",
  };
  return map[level.toLowerCase()] ?? "Tidak Diketahui";
};

export const getRiskIcon = (level?: string | null): string => {
  if (!level) return "?";
  const map: Record<string, string> = {
    low:      "OK",
    medium:   "!",
    high:     "!!",
    critical: "!!",
  };
  return map[level.toLowerCase()] ?? "?";
};

export const formatIDR = (amount?: number | null): string | null => {
  return amount != null
    ? new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(amount)
    : null;
};

export const formatPct = (prob?: number | null): string | null => {
  return prob != null ? `${Math.round(prob * 100)}%` : null;
};

// Format a percentage value already in 0-100 range (from FastAPI hybrid response)
export const formatPctDirect = (pct?: number | null): string | null => {
   return pct != null ? `${Math.round(pct * 10) / 10}%` : null;
};

// Map triggered_rules internal codes to Indonesian labels
// Covers: internal codes, dynamic patterns, English & Indonesian keywords from pmi_rules.py
export const formatTriggeredRule = (rule: string): string => {
  // --- Filter out non-display entries ---
  if (rule.startsWith('legit_signal_count')) return '';

  // --- Dynamic pattern: free email domain ---
  if (rule.startsWith('free_email:')) return 'Kontak menggunakan email pribadi (tidak resmi)';

  // --- Internal code rules ---
  const codeMap: Record<string, string> = {
    no_company_logo:         'Tidak ada logo perusahaan resmi',
    no_screening_questions:  'Tidak ada seleksi/pertanyaan penyaringan pelamar',
    company_profile_empty:   'Profil perusahaan tidak tersedia',
  };
  if (codeMap[rule]) return codeMap[rule];

  // --- Keyword-based rules (grouped by topic for cleaner UI) ---
  const keywordMap: Record<string, string> = {
    // Visa ilegal
    'visa turis':                  'Menggunakan visa turis, bukan visa kerja resmi',
    'visa wisata':                 'Menggunakan visa wisata, bukan visa kerja resmi',
    'visa ziarah':                 'Menggunakan visa ziarah untuk bekerja',
    'visa umroh':                  'Menggunakan visa umroh untuk bekerja',
    'tourist visa':                'Menggunakan visa turis, bukan visa kerja resmi',
    'visa on arrival':             'Menggunakan visa on arrival (tidak sah untuk bekerja)',

    // Paspor & dokumen
    'send passport':               'Diminta mengirimkan/menyerahkan paspor',
    'kirim paspor':                'Diminta mengirimkan/menyerahkan paspor',
    'paspor disimpan':             'Paspor/dokumen diminta untuk ditahan',
    'paspor ditahan':              'Paspor/dokumen diminta untuk ditahan',
    'paspor dipegang agen':        'Paspor/dokumen diminta untuk ditahan',
    'menyerahkan paspor':          'Paspor/dokumen diminta untuk ditahan',
    'paspor asli':                 'Paspor/dokumen asli diminta diserahkan',
    'dokumen asli':                'Dokumen asli diminta diserahkan',
    'data sensitif':               'Diminta data sensitif pribadi',
    'kode otp':                    'Diminta kode OTP atau PIN pribadi',
    'pin atm':                     'Diminta kode OTP atau PIN pribadi',
    'foto ktp selfie':             'Diminta foto KTP/selfie untuk keperluan mencurigakan',

    // Biaya di muka
    'bayar di muka':               'Ada biaya yang harus dibayar di muka',
    'dibayar di muka':             'Ada biaya yang harus dibayar di muka',
    'upfront payment':             'Ada biaya yang harus dibayar di muka',
    'advance payment':             'Ada biaya yang harus dibayar di muka',
    'biaya administrasi':          'Ada biaya administrasi yang mencurigakan',
    'administrative fee':          'Ada biaya administrasi yang mencurigakan',
    'biaya keberangkatan':         'Diminta membayar biaya keberangkatan sendiri',
    'uang muka':                   'Ada permintaan uang muka sebelum berangkat',
    'dp dulu':                     'Ada permintaan uang muka sebelum berangkat',
    'biaya admin':                 'Ada biaya administrasi yang mencurigakan',
    'transfer uang':               'Ada permintaan transfer uang yang mencurigakan',
    'membayar biaya':              'Ada biaya yang harus dibayar di muka',
    'biaya di awal':               'Ada biaya yang harus dibayar di muka',

    // Proses terlalu cepat
    'langsung berangkat':          'Proses keberangkatan terlalu cepat/tidak prosedural',
    'immediate departure':         'Proses keberangkatan terlalu cepat/tidak prosedural',
    'berangkat hari ini':          'Proses keberangkatan terlalu cepat/tidak prosedural',
    'proses keberangkatan cepat':  'Proses keberangkatan terlalu cepat/tidak prosedural',
    'proses cepat':                'Proses penempatan terlalu cepat/tidak prosedural',
    'fast process':                'Proses penempatan terlalu cepat/tidak prosedural',
    'proses kilat':                'Proses penempatan terlalu cepat/tidak prosedural',

    // Kontrak & gaji mencurigakan
    'tanpa potong gaji':           'Klaim gaji tidak dipotong (patut dicurigai)',
    'gaji tidak dipotong':         'Klaim gaji tidak dipotong (patut dicurigai)',
    'kontrak tidak jelas':         'Kontrak kerja tidak jelas atau tidak transparan',
    'tanpa kontrak':               'Tidak ada kontrak kerja resmi',
    'kontrak tidak transparan':    'Kontrak kerja tidak jelas atau tidak transparan',

    // Kondisi kerja eksploitatif
    'jam kerja berlebihan':        'Jam kerja berlebihan/eksploitatif',
    '12 jam kerja':                'Jam kerja berlebihan/eksploitatif',
    '14 jam kerja':                'Jam kerja berlebihan/eksploitatif',
    '16 jam kerja':                'Jam kerja berlebihan/eksploitatif',
    'tidak boleh keluar':          'Kebebasan bergerak pekerja dibatasi',
    'dilarang keluar':             'Kebebasan bergerak pekerja dibatasi',
    'mess tertutup':               'Tempat tinggal dikontrol/tertutup oleh agen',
    'tinggal di mess':             'Tempat tinggal dikontrol/tertutup oleh agen',

    // Legalitas tidak jelas
    'izin operasional dalam proses': 'Legalitas/izin operasional belum jelas',
    'legalitas dalam proses':        'Legalitas/izin operasional belum jelas',
    'izin sedang diurus':            'Legalitas/izin operasional belum jelas',
    'tanpa prosedur resmi':          'Tidak melalui prosedur penempatan resmi',
    'tanpa tes resmi':               'Tidak melalui prosedur penempatan resmi',

    // Pekerjaan ilegal
    'casino online':               'Terkait pekerjaan kasino/judi online ilegal',
    'online gambling':             'Terkait pekerjaan kasino/judi online ilegal',
    'judi online':                 'Terkait pekerjaan kasino/judi online ilegal',
    'scam center':                 'Terindikasi penempatan di scam center',
    'live streaming ilegal':       'Terkait aktivitas live streaming ilegal',
    'operator situs':              'Pekerjaan terkait aktivitas online mencurigakan',
    'game online':                 'Pekerjaan terkait aktivitas online mencurigakan',

    // Negara berisiko tinggi
    'macau':                       'Negara tujuan berisiko tinggi (Macau)',
    'kamboja':                     'Negara tujuan berisiko tinggi trafficking (Kamboja)',
    'cambodia':                    'Negara tujuan berisiko tinggi trafficking (Kamboja)',
    'myanmar':                     'Negara tujuan berisiko tinggi trafficking (Myanmar)',
    'laos':                        'Negara tujuan berisiko tinggi trafficking (Laos)',

    // Gaji & benefit tidak realistis
    'gaji besar':                  'Penawaran gaji tidak realistis/wajar',
    'high salary':                 'Penawaran gaji tidak realistis/wajar',
    'penghasilan jutaan':          'Penawaran gaji tidak realistis/wajar',
    'gaji puluhan juta':           'Penawaran gaji tidak realistis/wajar',
    'gaji tinggi':                 'Penawaran gaji tidak realistis/wajar',
    'gaji fantastis':              'Penawaran gaji tidak realistis/wajar',
    'gaji tidak masuk akal':       'Penawaran gaji tidak realistis/wajar',
    'guaranteed income':           'Jaminan penghasilan yang tidak masuk akal',
    'bonus besar':                 'Klaim bonus besar yang tidak jelas dasarnya',
    'bonus harian':                'Klaim bonus besar yang tidak jelas dasarnya',
    'bonus target':                'Klaim bonus besar yang tidak jelas dasarnya',
    'berdasarkan target':          'Sistem gaji berbasis target yang tidak jelas',
    'fasilitas mewah':             'Klaim fasilitas berlebihan yang patut dicurigai',
    'apartemen gratis':            'Klaim fasilitas berlebihan yang patut dicurigai',
    'akomodasi mewah':             'Klaim fasilitas berlebihan yang patut dicurigai',

    // Seleksi tidak transparan
    'langsung diterima':           'Proses seleksi tidak transparan (langsung diterima)',
    'tanpa seleksi':               'Tidak ada proses seleksi yang jelas',
    'tanpa interview':             'Tidak ada proses wawancara kerja',
    'interview mudah':             'Proses seleksi tidak transparan/terlalu mudah',
    'tanpa pengalaman':            'Tidak mensyaratkan pengalaman kerja apapun',
    'tidak perlu pengalaman':      'Tidak mensyaratkan pengalaman kerja apapun',
    'tidak memerlukan pengalaman': 'Tidak mensyaratkan pengalaman kerja apapun',
    'no experience':               'Tidak mensyaratkan pengalaman kerja apapun',
    'tanpa ijazah':                'Tidak mensyaratkan pendidikan formal',
    'tidak perlu pendidikan':      'Tidak mensyaratkan pendidikan formal',
    'no degree':                   'Tidak mensyaratkan pendidikan formal',
    'tanpa skill':                 'Tidak mensyaratkan keahlian apapun',
    'tanpa keahlian':              'Tidak mensyaratkan keahlian apapun',
    'pendidikan minimal rendah':   'Tidak mensyaratkan pendidikan formal',

    // Tekanan segera melamar
    'hubungi sekarang':            'Tekanan untuk segera melamar/menghubungi',
    'contact now':                 'Tekanan untuk segera melamar/menghubungi',
    'segera lamar':                'Tekanan untuk segera melamar/menghubungi',
    'apply immediately':           'Tekanan untuk segera melamar/menghubungi',
    'kuota terbatas':              'Tekanan batas waktu/kuota yang mencurigakan',
    'limited slots':               'Tekanan batas waktu/kuota yang mencurigakan',
    'urgent hiring':               'Tekanan batas waktu/kuota yang mencurigakan',

    // Rekrutmen tidak resmi
    'wa.me':                       'Rekrutmen melalui pesan pribadi (tidak resmi)',
    't.me':                        'Rekrutmen melalui pesan pribadi (tidak resmi)',
    'wa kami':                     'Rekrutmen melalui pesan pribadi (tidak resmi)',
    'chat wa':                     'Rekrutmen melalui pesan pribadi (tidak resmi)',
    'dm kami':                     'Rekrutmen melalui pesan pribadi (tidak resmi)',
    'telegram pribadi':            'Rekrutmen melalui pesan pribadi (tidak resmi)',
    'wa pribadi':                  'Rekrutmen melalui pesan pribadi (tidak resmi)',
    'nomor pribadi':               'Rekrutmen melalui kontak pribadi (tidak resmi)',

    // Alamat & profil tidak jelas
    'alamat tidak jelas':          'Alamat perusahaan tidak jelas atau tidak ada',
    'alamat kantor tidak jelas':   'Alamat perusahaan tidak jelas atau tidak ada',
    'tanpa alamat kantor':         'Alamat perusahaan tidak jelas atau tidak ada',
    'format tidak profesional':    'Format lowongan tidak profesional',
    'banyak typo':                 'Format lowongan tidak profesional (banyak kesalahan)',
    'tidak menjelaskan detail pekerjaan': 'Deskripsi pekerjaan tidak jelas/spesifik',
    'detail pekerjaan tidak jelas':       'Deskripsi pekerjaan tidak jelas/spesifik',
  };

  if (keywordMap[rule]) return keywordMap[rule];

  // Fallback: capitalize first letter, replace underscores
  return rule.charAt(0).toUpperCase() + rule.slice(1).replace(/_/g, ' ');
};
