import boto3
import json
import os
from dotenv import load_dotenv
import uuid
from botocore.errorfactory import ClientError
from supabase import create_client, Client

load_dotenv()



BUCKET_NAME = os.environ['BUCKET_NAME']
TABLE_NAME = os.environ['TABLE_NAME']
DOWNLOAD_PATH = os.environ['JSON_FILE_PATH']


def retrieve_data():
  # retrieve the most recent data from the s3 bucket
  s3_client = boto3.client('s3')
  data = s3_client.list_objects_v2(Bucket=BUCKET_NAME)

  if 'Contents' not in data:
    print('Contents not found')
    return

  objects = sorted(data['Contents'], key=lambda x: x['LastModified'], reverse=True)
  return objects[0]

def read_data(key, download_path):
  s3_client = boto3.client('s3')
  s3_client.download_file(BUCKET_NAME, key, download_path)
  print('File Downloaded!')

def organize_and_upload_data(data):
  try:
    url: str = os.environ['SUPABASE_URL']
    key: str = os.environ['SUPABASE_KEY']
    supabase: Client = create_client(url, key)  

    delete_data = supabase.table(TABLE_NAME).delete().neq('id', 0).execute()

    # bulk add data instead of for loop for each data add

    print(data)

    insert_data = supabase.table(TABLE_NAME).insert(data).execute()
    print(f'Finished data insertion {insert_data}')

  except Exception as e:
    print(f'Failed addition! {str(e)}')

def handler(): 
  # send data by calling `organize_data()`
  value = retrieve_data()
  data = None
  
  if value:
    read_data(value['Key'], DOWNLOAD_PATH)

    with open(DOWNLOAD_PATH, 'r') as file:
      data = json.load(file)
  organize_and_upload_data(data)

if __name__ == '__main__':
  handler()