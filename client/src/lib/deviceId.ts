/**
 * Device ID tracking - identifies users without wallet requirement
 * Generates unique device ID on first visit, persists in localStorage
 */

const DEVICE_ID_KEY = "cosmic-voyage-device-id";

export function getDeviceId(): string {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  
  if (!deviceId) {
    // Generate new device ID: timestamp + random string
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  
  return deviceId;
}

export function resetDeviceId(): string {
  localStorage.removeItem(DEVICE_ID_KEY);
  return getDeviceId();
}

export function getSessionInfo() {
  return {
    deviceId: getDeviceId(),
    sessionStart: Date.now(),
    userAgent: navigator.userAgent,
    language: navigator.language,
  };
}
