// Mocked Supabase client that uses localStorage instead
export const supabase = null;

const getLocal = (key: string) => {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
};

const setLocal = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export async function logEvent(eventType: string, eventData: any) {
  try {
    const events = getLocal("analytics_events");
    events.unshift({ id: Date.now().toString(), created_at: new Date().toISOString(), event_type: eventType, event_data: eventData });
    setLocal("analytics_events", events.slice(0, 100)); // Keep last 100
  } catch (err) {
    console.error("Local storage error:", err);
  }
}

export async function logUserSession(query: string, language: string, aiResponse: string, schemeId?: string) {
  try {
    const sessions = getLocal("user_sessions");
    sessions.unshift({
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      query,
      language,
      ai_response: aiResponse,
      current_state: schemeId || "general"
    });
    setLocal("user_sessions", sessions.slice(0, 100)); // Keep last 100
  } catch (err) {
    console.error("Local storage error:", err);
  }
}

export async function logApplication(schemeId: string, schemeName: string) {
  try {
    const apps = getLocal("scheme_applications");
    apps.unshift({
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      scheme_id: schemeId,
      scheme_name: schemeName,
      status: "pending"
    });
    setLocal("scheme_applications", apps.slice(0, 100)); // Keep last 100
  } catch (err) {
    console.error("Local storage error:", err);
  }
}
