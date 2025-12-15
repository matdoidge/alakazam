import {
  getAuth,
  createConnection,
  subscribeEntities,
  ERR_HASS_HOST_REQUIRED,
  type Auth,
  type Connection,
  type HassEntities
} from 'home-assistant-js-websocket';
import { writable, type Writable } from 'svelte/store';

// Configuration - Replace these with your actual details or use environment variables
export const HASS_URL = 'http://192.168.4.198:8123'; 
// In a real app, use an auth flow or a long-lived token carefully.
// For a personal dashboard, a token is often hardcoded or loaded from env.
const HASS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI5MGUyMmI1ZjM5MzE0YjAwYjExMmIwYjIyOWQzMGU2ZSIsImlhdCI6MTc2NTM3NzAxMSwiZXhwIjoyMDgwNzM3MDExfQ.IYC-J2dChOGDq18zbtuj-q7ljJwfyQ12SDKFZUobn2k'; 

export const entities: Writable<HassEntities> = writable({});
export const connection: Writable<Connection | null> = writable(null);
export const connected: Writable<boolean> = writable(false);
export const connectionError: Writable<string | null> = writable(null);

let conn: Connection;

async function loadTokens() {
    // Simple mock for token storage. In production, use localStorage or similar.
    return {
        access_token: HASS_TOKEN,
        expires: Date.now() + 1e11, // Far future
        hassUrl: HASS_URL,
        clientId: null,
        expires_in: 1e11,
        refresh_token: ''
    };
}

async function saveTokens(tokens: any) {
    // Save tokens if needed
}

export async function connectToHA() {
  try {
    const auth = await getAuth({
      hassUrl: HASS_URL,
      loadTokens,
      saveTokens
    });

    conn = await createConnection({ auth });
    
    // Set connected immediately as createConnection resolves when connected
    console.log('Connection established via createConnection');
    connected.set(true);
    connection.set(conn);
    connectionError.set(null);
    
    // Subscribe to entity updates
    subscribeEntities(conn, (updates) => {
      console.log('Received entity updates', Object.keys(updates).length);
      entities.set(updates);
    });

    conn.addEventListener('ready', () => {
        console.log('Connection ready event');
        connected.set(true);
        connection.set(conn);
        connectionError.set(null);
    });

    conn.addEventListener('disconnected', () => {
        console.log('Disconnected from Home Assistant');
        connected.set(false);
        connection.set(null);
        connectionError.set('Disconnected');
    });
    
    conn.addEventListener('reconnect-error', () => {
        console.error('Reconnect error');
        connectionError.set('Reconnecting...');
    });

  } catch (err: any) {
    console.error('Connection failed', err);
    connected.set(false);
    if (err === ERR_HASS_HOST_REQUIRED) {
        connectionError.set('Host required');
    } else {
        // Try to get a readable error message
        connectionError.set(err.message || 'Connection failed - Check console');
    }
  }
}

/**
 * Fetch calendar events from Home Assistant
 * Works with any calendar integration (CalDAV, Google Calendar, iCal, etc.)
 * @param entityId - Calendar entity ID (e.g., "calendar.caldav_my_calendar" or "calendar.google_calendar")
 * @param startDate - Start date for events (defaults to now)
 * @param endDate - End date for events (defaults to 7 days from now)
 */
export async function getCalendarEvents(
  entityId: string,
  startDate?: Date,
  endDate?: Date
): Promise<any[]> {
  const start = startDate || new Date();
  const end = endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

  console.log('Fetching calendar events:', {
    entityId,
    start: start.toISOString(),
    end: end.toISOString(),
    startDate: start.toLocaleString(),
    endDate: end.toLocaleString(),
  });

  // Try using sendMessagePromise directly (calendar.get_events requires return_response)
  if (conn) {
    try {
      // Use sendMessagePromise to call the service with return_response=True
      // Note: Some versions of HA might expect different date formats
      const result = await conn.sendMessagePromise({
        type: 'call_service',
        domain: 'calendar',
        service: 'get_events',
        service_data: {
          entity_id: entityId,
          start_date_time: start.toISOString(),
          end_date_time: end.toISOString(),
        },
        return_response: true,
      });
      
      console.log('Calendar service result:', JSON.stringify(result, null, 2));
      console.log('Result type:', typeof result);
      console.log('Is array:', Array.isArray(result));
      console.log('Entity ID:', entityId);
      
      // Helper function to recursively find arrays that look like event arrays
      function findEventArray(obj: any, path: string = ''): any[] | null {
        if (!obj) return null;
        
        // If it's an array, check if items look like events
        if (Array.isArray(obj)) {
          if (obj.length === 0) return null;
          // Check if first item looks like an event (has summary, start, or end)
          const firstItem = obj[0];
          if (firstItem && typeof firstItem === 'object' && 
              (firstItem.summary || firstItem.start || firstItem.end || firstItem.title)) {
            console.log(`Found event array at path: ${path} with ${obj.length} events`);
            return obj;
          }
          return null;
        }
        
        // If it's an object, recursively search
        if (typeof obj === 'object') {
          for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
              const found = findEventArray(obj[key], path ? `${path}.${key}` : key);
              if (found) return found;
            }
          }
        }
        
        return null;
      }
      
      // Try to find events array recursively
      const foundEvents = findEventArray(result);
      if (foundEvents) {
        console.log(`Found ${foundEvents.length} events recursively`);
        return foundEvents;
      }
      
      // Fallback: Manual checks of common structures
      let events = null;
      
      // Check result.response first
      if (result?.response) {
        const response = result.response;
        console.log('Found result.response:', typeof response, Array.isArray(response));
        
        // Check if response is an array
        if (Array.isArray(response)) {
          events = response;
          console.log('Response is array with', events.length, 'events');
        }
        // Check if response is an object with entity_id as key
        else if (response && typeof response === 'object') {
          // Try the entity_id as a key
          if (response[entityId] && Array.isArray(response[entityId])) {
            events = response[entityId];
            console.log(`Found events in response.${entityId}:`, events.length, 'events');
          }
          // Try common keys
          else if (response.events && Array.isArray(response.events)) {
            events = response.events;
            console.log('Found events in response.events:', events.length, 'events');
          }
          // Check all keys to see if any contain arrays
          else {
            const keys = Object.keys(response);
            console.log('Response keys:', keys);
            for (const key of keys) {
              if (Array.isArray(response[key]) && response[key].length > 0) {
                // Verify it looks like events
                const firstItem = response[key][0];
                if (firstItem && typeof firstItem === 'object' && 
                    (firstItem.summary || firstItem.start || firstItem.end || firstItem.title)) {
                  events = response[key];
                  console.log(`Found event array in response.${key}:`, events.length, 'events');
                  break;
                }
              }
            }
          }
        }
      }
      // Check if result is directly an array
      else if (Array.isArray(result) && result.length > 0) {
        // Verify it looks like events
        const firstItem = result[0];
        if (firstItem && typeof firstItem === 'object' && 
            (firstItem.summary || firstItem.start || firstItem.end || firstItem.title)) {
          events = result;
          console.log('Result is directly an array:', events.length, 'events');
        }
      }
      // Check if result has events property
      else if (result?.events && Array.isArray(result.events)) {
        events = result.events;
        console.log('Found events in result.events:', events.length, 'events');
      }
      // Check if result has entity_id as key
      else if (result && typeof result === 'object' && result[entityId] && Array.isArray(result[entityId])) {
        events = result[entityId];
        console.log(`Found events in result.${entityId}:`, events.length, 'events');
      }
      
      // Ensure we return an array
      if (Array.isArray(events) && events.length > 0) {
        console.log(`Returning ${events.length} events`);
        // Log first event structure for debugging
        if (events[0]) {
          console.log('First event structure:', Object.keys(events[0]));
        }
        return events;
      }
      
      console.log('No events found in result structure');
      console.log('Result keys:', result ? Object.keys(result) : 'null');
      if (result?.response && typeof result.response === 'object') {
        console.log('Response keys:', Object.keys(result.response));
      }
      return [];
    } catch (serviceErr: any) {
      console.error('Service call failed:', serviceErr);
      throw new Error(`Calendar service error: ${serviceErr.message || serviceErr.code || 'Unknown error'}`);
    }
  }

  // If no connection, we can't fetch calendar events
  // (REST API has CORS issues from browser, so we rely on websocket)
  throw new Error('Not connected to Home Assistant. Calendar events require a websocket connection.');
}

