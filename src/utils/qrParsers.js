// QR Code content parsers and action helpers
// Supports various URI schemes and formats

export const parseQRContent = (content) => {
  if (!content || typeof content !== 'string') {
    return { type: 'text', actions: [] };
  }

  const trimmed = content.trim();

  // URL patterns
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return {
      type: 'url',
      actions: [
        { type: 'open', label: 'Open URL', icon: 'open', handler: () => chrome.tabs.create({ url: trimmed }) },
        { type: 'copy', label: 'Copy URL', icon: 'copy', handler: () => navigator.clipboard.writeText(trimmed) }
      ]
    };
  }

  // Email patterns
  if (trimmed.startsWith('mailto:')) {
    const email = trimmed.substring(7);
    return {
      type: 'email',
      actions: [
        { type: 'compose', label: 'Compose Email', icon: 'email', handler: () => chrome.tabs.create({ url: trimmed }) },
        { type: 'copy', label: 'Copy Email', icon: 'copy', handler: () => navigator.clipboard.writeText(email) }
      ]
    };
  }

  // Phone patterns
  if (trimmed.startsWith('tel:')) {
    const phone = trimmed.substring(4);
    return {
      type: 'phone',
      actions: [
        { type: 'call', label: 'Call', icon: 'phone', handler: () => chrome.tabs.create({ url: trimmed }) },
        { type: 'copy', label: 'Copy Number', icon: 'copy', handler: () => navigator.clipboard.writeText(phone) }
      ]
    };
  }

  // SMS patterns
  if (trimmed.startsWith('sms:')) {
    const smsData = trimmed.substring(4);
    const [phone, message] = smsData.split('?body=');
    return {
      type: 'sms',
      actions: [
        { type: 'send', label: 'Send SMS', icon: 'sms', handler: () => chrome.tabs.create({ url: trimmed }) },
        { type: 'copy', label: 'Copy Number', icon: 'copy', handler: () => navigator.clipboard.writeText(phone) }
      ]
    };
  }

  // WiFi patterns
  if (trimmed.startsWith('WIFI:')) {
    const wifiData = parseWifiString(trimmed);
    return {
      type: 'wifi',
      data: wifiData,
      actions: [
        { type: 'connect', label: 'Connect to WiFi', icon: 'wifi', handler: () => showWifiCard(wifiData) },
        { type: 'copy', label: 'Copy Password', icon: 'copy', handler: () => navigator.clipboard.writeText(wifiData.password || '') }
      ]
    };
  }

  // Geo location patterns
  if (trimmed.startsWith('geo:')) {
    const geoData = parseGeoString(trimmed);
    return {
      type: 'geo',
      data: geoData,
      actions: [
        { type: 'open', label: 'Open in Maps', icon: 'location', handler: () => chrome.tabs.create({ url: `https://maps.google.com/?q=${geoData.lat},${geoData.lng}` }) },
        { type: 'copy', label: 'Copy Coordinates', icon: 'copy', handler: () => navigator.clipboard.writeText(`${geoData.lat},${geoData.lng}`) }
      ]
    };
  }

  // vCard patterns
  if (trimmed.includes('BEGIN:VCARD')) {
    const vcardData = parseVCard(trimmed);
    return {
      type: 'contact',
      data: vcardData,
      actions: [
        { type: 'save', label: 'Save Contact', icon: 'contact', handler: () => saveContact(vcardData) },
        { type: 'copy', label: 'Copy vCard', icon: 'copy', handler: () => navigator.clipboard.writeText(trimmed) }
      ]
    };
  }

  // Calendar event patterns
  if (trimmed.includes('BEGIN:VEVENT')) {
    const eventData = parseCalendarEvent(trimmed);
    return {
      type: 'calendar',
      data: eventData,
      actions: [
        { type: 'add', label: 'Add to Calendar', icon: 'calendar', handler: () => addToCalendar(eventData) },
        { type: 'copy', label: 'Copy Event', icon: 'copy', handler: () => navigator.clipboard.writeText(trimmed) }
      ]
    };
  }

  // Crypto URI patterns (Bitcoin, Ethereum, etc.)
  if (trimmed.match(/^(bitcoin|ethereum|litecoin):/)) {
    const cryptoData = parseCryptoURI(trimmed);
    return {
      type: 'crypto',
      data: cryptoData,
      actions: [
        { type: 'send', label: 'Send Payment', icon: 'crypto', handler: () => chrome.tabs.create({ url: trimmed }) },
        { type: 'copy', label: 'Copy Address', icon: 'copy', handler: () => navigator.clipboard.writeText(cryptoData.address) }
      ]
    };
  }

  // Default text
  return {
    type: 'text',
    actions: [
      { type: 'copy', label: 'Copy Text', icon: 'copy', handler: () => navigator.clipboard.writeText(trimmed) }
    ]
  };
};

// Helper functions for parsing specific formats

const parseWifiString = (wifiString) => {
  // WIFI:T:WPA;S:mynetwork;P:mypass;;
  const ssid = wifiString.match(/S:([^;]+)/)?.[1] || '';
  const password = wifiString.match(/P:([^;]+)/)?.[1] || '';
  const security = wifiString.match(/T:([^;]+)/)?.[1] || 'nopass';
  return { ssid, password, security };
};

const parseGeoString = (geoString) => {
  // geo:37.7749,-122.4194
  const coords = geoString.substring(4).split(',');
  return { lat: coords[0], lng: coords[1] };
};

const parseVCard = (vcardString) => {
  const lines = vcardString.split('\n');
  const data = {};
  lines.forEach(line => {
    if (line.startsWith('FN:')) data.name = line.substring(3);
    if (line.startsWith('TEL:')) data.phone = line.substring(4);
    if (line.startsWith('EMAIL:')) data.email = line.substring(6);
    if (line.startsWith('ORG:')) data.organization = line.substring(4);
    if (line.startsWith('TITLE:')) data.title = line.substring(6);
  });
  return data;
};

const parseCalendarEvent = (eventString) => {
  const lines = eventString.split('\n');
  const data = {};
  lines.forEach(line => {
    if (line.startsWith('SUMMARY:')) data.title = line.substring(8);
    if (line.startsWith('DTSTART:')) data.start = line.substring(8);
    if (line.startsWith('DTEND:')) data.end = line.substring(6);
    if (line.startsWith('LOCATION:')) data.location = line.substring(9);
  });
  return data;
};

const parseCryptoURI = (cryptoString) => {
  // bitcoin:1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2?amount=0.01
  const [scheme, address] = cryptoString.split(':');
  const [cleanAddress] = address.split('?');
  return { scheme, address: cleanAddress };
};

// Action handlers

const showWifiCard = (wifiData) => {
  alert(`WiFi Network:\nSSID: ${wifiData.ssid}\nPassword: ${wifiData.password}\nSecurity: ${wifiData.security}`);
};

const saveContact = (contactData) => {
  alert(`Contact Info:\nName: ${contactData.name}\nPhone: ${contactData.phone}\nEmail: ${contactData.email}\nOrganization: ${contactData.organization}`);
};

const addToCalendar = (eventData) => {
  alert(`Calendar Event:\nTitle: ${eventData.title}\nStart: ${eventData.start}\nEnd: ${eventData.end}\nLocation: ${eventData.location}`);
};