import { google } from 'googleapis';
import { decryptToken } from './encryption';

export function getGoogleOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

export async function getCalendarClient(refreshToken: string) {
  const oauth2Client = getGoogleOAuth2Client();
  oauth2Client.setCredentials({
    refresh_token: decryptToken(refreshToken)
  });
  
  return google.calendar({ version: 'v3', auth: oauth2Client });
}

export async function getFreeBusy(businessId: string, refreshToken: string, calendarId: string = 'primary', timeMin: Date, timeMax: Date) {
  const calendar = await getCalendarClient(refreshToken);
  
  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      items: [{ id: calendarId }],
    },
  });
  
  return response.data.calendars?.[calendarId]?.busy || [];
}

export async function createCalendarEvent(refreshToken: string, details: {
  summary: string;
  description: string;
  startTime: Date;
  endTime: Date;
  calendarId?: string;
}) {
  const calendar = await getCalendarClient(refreshToken);
  
  const response = await calendar.events.insert({
    calendarId: details.calendarId || 'primary',
    requestBody: {
      summary: details.summary,
      description: details.description,
      start: { dateTime: details.startTime.toISOString() },
      end: { dateTime: details.endTime.toISOString() },
    },
  });
  
  return response.data;
}
