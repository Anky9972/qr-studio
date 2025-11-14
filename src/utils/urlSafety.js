// URL safety utilities for QR code scanning
// Checks for suspicious URLs, homograph attacks, and other security issues

const SUSPICIOUS_TLDS = [
  'tk', 'ml', 'ga', 'cf', 'gq', 'xyz', 'top', 'club', 'online', 'site', 'space',
  'website', 'tech', 'store', 'live', 'fun', 'host', 'icu', 'download', 'click'
];

const HIGH_RISK_TLDS = ['tk', 'ml', 'ga', 'cf', 'gq'];

export const checkURLSafety = (url) => {
  if (!url || typeof url !== 'string') {
    return { safe: true, warnings: [] };
  }

  const warnings = [];
  let safe = true;

  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.toLowerCase();

    // Check for suspicious TLDs
    const tld = domain.split('.').pop();
    if (SUSPICIOUS_TLDS.includes(tld)) {
      warnings.push({
        type: 'suspicious_tld',
        severity: HIGH_RISK_TLDS.includes(tld) ? 'high' : 'medium',
        message: `Suspicious top-level domain (.${tld})`,
        details: 'This domain uses a TLD commonly associated with spam or malicious sites.'
      });
      safe = false;
    }

    // Check for homograph attacks (similar looking characters)
    const homographIssues = checkHomographAttack(domain);
    if (homographIssues.length > 0) {
      warnings.push(...homographIssues);
      safe = false;
    }

    // Check for data URLs (can contain malicious content)
    if (url.startsWith('data:')) {
      warnings.push({
        type: 'data_url',
        severity: 'high',
        message: 'Data URL detected',
        details: 'Data URLs can contain embedded malicious content. Exercise caution.'
      });
      safe = false;
    }

    // Check for IP addresses (often used in malicious contexts)
    if (/^\d+\.\d+\.\d+\.\d+$/.test(domain)) {
      warnings.push({
        type: 'ip_address',
        severity: 'medium',
        message: 'IP address in URL',
        details: 'URLs with IP addresses instead of domain names can be suspicious.'
      });
      safe = false;
    }

    // Check for excessive subdomains
    const subdomainCount = domain.split('.').length - 2; // Subtract TLD and main domain
    if (subdomainCount > 3) {
      warnings.push({
        type: 'excessive_subdomains',
        severity: 'low',
        message: 'Many subdomains',
        details: 'URLs with many subdomains can be used to disguise malicious sites.'
      });
    }

    // Check for URL shorteners
    const urlShorteners = ['bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly', 'is.gd'];
    if (urlShorteners.some(shortener => domain.includes(shortener))) {
      warnings.push({
        type: 'url_shortener',
        severity: 'medium',
        message: 'URL shortener detected',
        details: 'Shortened URLs can hide the true destination. Consider the source.'
      });
      safe = false;
    }

  } catch (err) {
    // Invalid URL format
    warnings.push({
      type: 'invalid_url',
      severity: 'high',
      message: 'Invalid URL format',
      details: 'This does not appear to be a valid URL.'
    });
    safe = false;
  }

  return { safe, warnings };
};

const checkHomographAttack = (domain) => {
  const warnings = [];
  
  // Common character substitutions
  const homoglyphs = {
    'a': ['а', 'ɑ', 'α'], // Cyrillic a, Latin alpha, etc.
    'c': ['с', 'ϲ'],
    'e': ['е', 'ɛ'],
    'i': ['і', 'ɩ'],
    'o': ['о', 'ο', 'օ'],
    'p': ['р'],
    's': ['ѕ'],
    'x': ['х'],
    'y': ['у'],
    '0': ['о'],
    '1': ['і', 'ɩ'],
    '3': ['ɛ'],
    '5': ['ѕ']
  };

  // Check if domain contains suspicious unicode characters
  const hasUnicode = /[^\x00-\x7F]/.test(domain);
  if (hasUnicode) {
    warnings.push({
      type: 'unicode_characters',
      severity: 'medium',
      message: 'Unicode characters in domain',
      details: 'The domain contains non-ASCII characters that could be used for homograph attacks.'
    });
  }

  // Check for mixed scripts (e.g., Latin + Cyrillic)
  const latinChars = domain.match(/[a-zA-Z]/g) || [];
  const cyrillicChars = domain.match(/[а-яА-Я]/g) || [];
  
  if (latinChars.length > 0 && cyrillicChars.length > 0) {
    warnings.push({
      type: 'mixed_scripts',
      severity: 'high',
      message: 'Mixed character scripts',
      details: 'Domain mixes Latin and Cyrillic characters, a common homograph attack technique.'
    });
  }

  return warnings;
};

export const shouldShowConfirmation = (url, autoOpenEnabled) => {
  if (!autoOpenEnabled || !url) return false;
  
  const safety = checkURLSafety(url);
  return !safety.safe || safety.warnings.some(w => w.severity === 'high');
};

export const getSafetyColor = (warnings) => {
  if (warnings.some(w => w.severity === 'high')) return 'error';
  if (warnings.some(w => w.severity === 'medium')) return 'warning';
  return 'success';
};