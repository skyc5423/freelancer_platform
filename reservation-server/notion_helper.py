from notion_client import Client
import json
import datetime
from custom_dataclasses.schedule import Schedule
from utils import log_function_call


with open('credentials/notion_api_key.json') as f:
    notion_secret_key = json.load(f)['api_key']


class NotionHelper:
    def __init__(self):
        self.notion = Client(auth=notion_secret_key)
        self.cache_database_list = None
        self.cache_database_id = None

    @log_function_call
    def _get_all_database_list(self):
        self.cache_database_list = self.notion.search(
            filter={"property": "object", "value": "database"})['results']
        return self.cache_database_list

    @log_function_call
    def _get_database_id(self, database_title: str):
        if not self.cache_database_id or database_title not in self.cache_database_id.keys():
            self.cache_database_id = {database['title'][0]['text']['content']: database['id']
                                      for database in self._get_all_database_list()}
        return self.cache_database_id[database_title]

    @log_function_call
    def get_database_with_date(self, date: str):

        year = date[:4]
        month = date[4:6]
        database_title = f'{year}-{month}'

        filters = {
            "property": "날짜",
            "rich_text": {
                        "contains": f"{date}"
            }
        }
        return self.notion.databases.query(database_id=self._get_database_id(database_title),
                                           filter=filters)

    def convert_string_to_datetime(self, date: str) -> datetime.datetime:
        return datetime.datetime.strptime(date, '%Y-%m-%dT%H:%M:%S.%f%z')

    @log_function_call
    def parse_schedule(self, schedule):
        schedule = {
            'date': schedule['properties']['날짜']['rich_text'][0]['plain_text'],
            'class_song': schedule['properties']['수업곡']['title'][0]['plain_text'],
            'class_type': schedule['properties']['수업 종류']['select']['name'],
            'start_time': schedule['properties']['시작 시간']['rich_text'][0]['plain_text'],
            'end_time': schedule['properties']['종료 시간']['rich_text'][0]['plain_text'],
            'location_name': schedule['properties']['위치']['rich_text'][0]['plain_text'],
            'max_user_num': schedule['properties']['최대 인원']['number'],
            'user_id_list': [d['id'] for d in schedule['properties']['참가자']['relation']]
        }
        return schedule

    def get_schedule_by_date(self, date: str):
        database = self.get_database_with_date(date)
        schedule_list = []
        for schedule in database['results']:
            parsed_schedule = self.parse_schedule(schedule)
            schedule_list.append(Schedule(**parsed_schedule))
        return schedule_list


notion_helper = NotionHelper()
