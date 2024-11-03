from notion_client import Client
import json
import datetime
from custom_dataclasses.schedule import Schedule
from custom_dataclasses.user import User
from utils import log_function_call
import os


with open(f'{os.environ.get("CREDENTIALS_PATH", "credentials")}/notion_api_key.json') as f:
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
        return self.cache_database_id.get(database_title, None)

    @log_function_call
    def get_user_database_id(self):
        database_title = '유저'
        user_database_id = self._get_database_id(database_title)
        return user_database_id

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

        sorts = [
            {
                "property": "시작 시간",
                "direction": "ascending"
            }
        ]
        return self.notion.databases.query(database_id=self._get_database_id(database_title),
                                           filter=filters,
                                           sorts=sorts) if self._get_database_id(database_title) else {'results': []}

    def convert_string_to_datetime(self, date: str) -> datetime.datetime:
        return datetime.datetime.strptime(date, '%Y-%m-%dT%H:%M:%S.%f%z')

    @log_function_call
    def parse_user(self, user):
        user = {
            'user_database_id': user['id'],
            'name': user['properties']['Name']['title'][0]['plain_text'],
            'phone_number': user['properties']['전화번호']['phone_number'],
        }
        return user

    @log_function_call
    def parse_schedule(self, schedule):
        schedule = {
            'database_id': schedule['id'],
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

    def get_or_create_user_by_user_dict(self, user_dict: dict):
        user_database_id = self.get_user_database_id()
        filters = {
            "property": "전화번호",
            "phone_number": {
                        "contains": f"{user_dict['phoneNumber']}"
            }
        }
        user_database = self.notion.databases.query(
            database_id=user_database_id, filter=filters)
        if user_database['results']:
            return User(**self.parse_user(user_database['results'][0]))
        else:
            user_id = self.create_user(user_dict, user_database_id)
            return User(user_database_id=user_id, name=user_dict['name'], phone_number=user_dict['phoneNumber'])

    def create_user(self, user_dict: dict, user_database_id: str):
        properties = {
            "Name": {
                "title": [
                    {
                        "text": {
                            "content": user_dict['name']
                        }
                    }
                ]
            },
            "전화번호": {
                "phone_number": user_dict['phoneNumber']
            }
        }
        try:
            response = self.notion.pages.create(
                parent={"database_id": user_database_id},
                properties=properties
            )
            return response['id']
        except Exception as e:
            print(f"유저 생성 중 오류 발생: {str(e)}")
            return None

    @log_function_call
    def update_database(self, reservation_data):
        try:
            subject = reservation_data['subject']
            client = reservation_data['clientInfo']
            # Get user id by phone number
            # if not exist, create new user
            user = self.get_or_create_user_by_user_dict(client)

            # Add user_id to subject's relation

            # 현재 페이지의 참가자 목록 가져오기
            current_page = self.notion.pages.retrieve(
                page_id=reservation_data['subject']['database_id'])
            properties = current_page['properties']
            properties['참가자']['relation'].append({"id": user.user_database_id})
            self.notion.pages.update(
                page_id=subject['database_id'],
                properties=properties
            )

            return True
        except Exception as e:
            print(f"데이터베이스 업데이트 중 오류 발생: {str(e)}")
            return False


notion_helper = NotionHelper()
