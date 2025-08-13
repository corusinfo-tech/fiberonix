const STORAGE_PREFIX = "recentActivities::";
const EVENT_PREFIX = "recent-activity::";
const MAX_ACTIVITIES = 50;

export function getCurrentUserKey() {
  // Prefer stable identity (name/email/userId), fallback to token, else anonymous
  const name = localStorage.getItem("authName");
  const token = localStorage.getItem("authToken");
  return name || token || "anonymous";
}

function getStorageKey(userKey) {
  const key = userKey || getCurrentUserKey();
  return `${STORAGE_PREFIX}${key}`;
}

function getEventName(userKey) {
  const key = userKey || getCurrentUserKey();
  return `${EVENT_PREFIX}${key}`;
}

function load(userKey) {
  try {
    const raw = localStorage.getItem(getStorageKey(userKey));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(list, userKey) {
  try {
    localStorage.setItem(getStorageKey(userKey), JSON.stringify(list));
  } catch {
    // ignore
  }
}

export function getRecentActivities(userKey) {
  const list = load(userKey);
  return Array.isArray(list)
    ? list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
    : [];
}

export function recordActivity(activity, userKey) {
  const entry = {
    id: activity.id ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    type: activity.type || "system",
    action: activity.action || "info",
    title: activity.title || "Activity",
    description: activity.description || "",
    status: activity.status || inferStatus(activity.action),
    user: activity.user || "System",
    timestamp: activity.timestamp || Date.now(),
  };

  const list = load(userKey);
  const updated = [entry, ...list].slice(0, MAX_ACTIVITIES);
  save(updated, userKey);

  if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
    window.dispatchEvent(new CustomEvent(getEventName(userKey), { detail: entry }));
  }
}

export function subscribeToRecentActivity(callback, userKey) {
  const eventName = getEventName(userKey);
  const handler = (e) => callback(e.detail);
  window.addEventListener(eventName, handler);
  return () => window.removeEventListener(eventName, handler);
}

function inferStatus(action) {
  switch ((action || "").toLowerCase()) {
    case "added":
    case "created":
      return "success";
    case "deleted":
      return "warning";
    case "updated":
    default:
      return "info";
  }
} 