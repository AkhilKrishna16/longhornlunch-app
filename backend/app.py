from flask import Flask, jsonify
from flask_cors import CORS
import boto3
import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

app = Flask(__name__)
cors = CORS(app)

TABLE_NAME = os.environ['TABLE_NAME']
url: str = os.environ['SUPABASE_URL']
key: str = os.environ['SUPABASE_KEY']
supabase: Client = create_client(url, key)  
  
@app.route('/')
def home():
  return jsonify({'message': 'Hello World!'})

@app.route('/return_dates/<string:dining_hall>', methods=['GET'])
def return_dates(dining_hall):
  try:
    dates = []
    response = supabase.table(TABLE_NAME).select('day').eq('hall', dining_hall).execute()
    response = response.data

    for val in response:
      if val['day'] not in dates:
        dates.append(val['day'])
    
    return jsonify(dates)
  except Exception as e:
    print(str(e))
    return jsonify({'error': str(e)})
  


@app.route('/return_location_halls', methods=['GET'])
def return_location_halls():
  response = supabase.table(TABLE_NAME).select('hall').execute()
  response = response.data
  dining_halls = list(set( val for dict in response for val in dict.values()))
  return jsonify(dining_halls)


@app.route('/return_meals/<string:dining_hall>/<string:date>', methods=['GET'])
def return_meals(dining_hall, date):
  response = supabase.table(TABLE_NAME).select('id', 'name', 'meal_type','votes', 'category').eq('hall', dining_hall).eq('day', date).execute()
  response = response.data
  return jsonify(response)

@app.route('/handle_upvote/<int:id>', methods=['POST', 'GET'])
def handle_upvote(id):
  vote_count = supabase.table(TABLE_NAME).select('votes').eq('id', id).execute().data[0]['votes']
  supabase.table(TABLE_NAME).update({'votes': vote_count + 1}).eq('id', id).execute()
  return jsonify({'vote_count': vote_count + 1})

@app.route('/handle_downvote/<int:id>', methods=['POST', 'GET'])
def handle_downvote(id):
  vote_count = supabase.table(TABLE_NAME).select('votes').eq('id', id).execute().data[0]['votes']
  supabase.table(TABLE_NAME).update({'votes': vote_count - 1}).eq('id', id).execute()
  return jsonify({'vote_count': vote_count - 1})


if __name__ == '__main__':
  app.run(debug=True)
