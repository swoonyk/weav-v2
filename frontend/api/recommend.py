from http.server import BaseHTTPRequestHandler
import json
import os
import requests
import pandas as pd
from bs4 import BeautifulSoup
import re
import google.generativeai as genai
import time
from googleapiclient.discovery import build
from datetime import datetime
import pytz

# Environment variables for API keys
OAUTH_TOKEN = os.environ.get('EVENTBRITE_OAUTH_TOKEN')
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY')

genai.configure(api_key=GEMINI_API_KEY)

def get_event_info(event_id):
    url = f'https://www.eventbriteapi.com/v3/events/{event_id}/'
    headers = {'Authorization': f'Bearer {OAUTH_TOKEN}'}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        event_data = response.json()
        return [
            event_data.get("url"),
            event_data.get("start", {}).get("utc"),
            event_data.get("end", {}).get("utc")
        ]
    return None

def get_event_description(event_id):
    url = f'https://www.eventbriteapi.com/v3/events/{event_id}/'
    headers = {'Authorization': f'Bearer {OAUTH_TOKEN}'}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        event_data = response.json()
        return [
            event_data.get("name", {}).get("text"),
            event_data.get("description", {}).get("text")
        ]
    return None

def get_from_url(pg):
    url = f'https://www.eventbrite.com/d/ma--worcester/all-events/?page={pg}'
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        pattern = re.compile(r'/e/.+-tickets-(\d+)')
        links = soup.find_all('a', href=pattern)
        return [match.group(1) for link in links if (match := pattern.search(link['href']))]
    return []

def get_full_list_of_ids():
    full_list = []
    for i in range(1, 7): # Limit pages to avoid long runs
        ids = get_from_url(i)
        if not ids:
            break
        full_list.extend(ids)
    return list(set(full_list))

def return_csv_data():
    event_ids = get_full_list_of_ids()
    event_info_list = [get_event_info(id) for id in event_ids]
    return [info for info in event_info_list if info and all(info)]

def find_free_time_slots(events, overall_start, overall_end):
    free_slots = []
    current_time = overall_start
    
    sorted_events = sorted(events, key=lambda x: x['start']['dateTime'])

    for event in sorted_events:
        event_start = datetime.fromisoformat(event['start']['dateTime'].replace('Z', '+00:00'))
        event_end = datetime.fromisoformat(event['end']['dateTime'].replace('Z', '+00:00'))
        if current_time < event_start:
            free_slots.append({"start": current_time, "end": event_start})
        current_time = max(current_time, event_end)

    if current_time < overall_end:
        free_slots.append({"start": current_time, "end": overall_end})

    return free_slots

def is_event_in_free_slot(event_start_str, event_end_str, free_slots):
    event_start = datetime.fromisoformat(event_start_str.replace('Z', '+00:00'))
    event_end = datetime.fromisoformat(event_end_str.replace('Z', '+00:00'))
    for slot in free_slots:
        if slot['start'] <= event_start and event_end <= slot['end']:
            return True
    return False

def pub_cal_events(calendar_id):
    service = build("calendar", "v3", developerKey=GOOGLE_API_KEY)
    now = datetime.utcnow().isoformat() + 'Z'
    events_result = service.events().list(
        calendarId=calendar_id, timeMin=now,
        maxResults=50, singleEvents=True,
        orderBy="startTime"
    ).execute()
    return events_result.get("items", [])

def main_handler(json_data):
    calendars = json_data.get('calendars', [])
    preferences = json_data.get('preferences', {})
    
    # Define overall time window for event search (e.g., next 7 days)
    overall_start = datetime.now(pytz.utc)
    overall_end = overall_start + pd.Timedelta(days=7)

    all_calendar_events = []
    for cal_id in calendars:
        all_calendar_events.extend(pub_cal_events(cal_id))
    
    free_slots = find_free_time_slots(all_calendar_events, overall_start, overall_end)
    
    eventbrite_events = return_csv_data()
    
    suitable_events = []
    for event in eventbrite_events:
        if is_event_in_free_slot(event[1], event[2], free_slots):
            suitable_events.append(event[0]) # event[0] is the URL
            
    # AI-based scoring would go here if preferences are provided
    # For now, just returning events that fit the schedule
    
    return {"recommended_events": suitable_events[:5]} # Return top 5

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        json_data = json.loads(post_data)
        
        try:
            result = main_handler(json_data)
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode('utf-8'))
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8')) 