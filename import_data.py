import csv
import os
import pandas as pd
import string
import sys
import random
import time

from datetime import datetime
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from ibmcloudant.cloudant_v1 import CloudantV1
from dotenv import load_dotenv


load_dotenv()

composite_index_created = False

def generate_random_id():
    return ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(32))


def upload_csv_to_cloudant(client, db_name, csv_path, date):
    global composite_index_created
    ticker = os.path.basename(csv_path).split('.')[0]

    composite_index_definition = {
        "index": {"fields": ["date", "ticker", "timestamp", "price", "size", "suspicious"]},
        "name": "composite-index",
        "type": "json"
    }

    if not composite_index_created:  # Only create the index if not done already
        try:
            res = client.post_index(
                db=db_name,
                # ddoc=None, not required explicitly
                name=composite_index_definition['name'],
                type=composite_index_definition['type'],
                index=composite_index_definition['index']
            ).get_result()
            print(f"Index creation response: {res}")
            composite_index_created = True
        except Exception as e:
            print(f"An error occurred when creating the composite index: {e}")
            sys.exit(1)
        
    with open(csv_path, 'r') as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            doc = {
                "id": generate_random_id(),
                "date": date,
                "ticker": ticker,
                "timestamp": int(row[0]),
                "price": int(row[1]),
                "size": int(row[2]),
                "exchange": row[3],
                "sale_condition": row[4],
                "suspicious": int(row[5])
            }

            res = client.post_document(db=db_name, document=doc)
                
            # Wait a bit to avoid exceeding the rate limit
            time.sleep(0.11)

            print(f'Successfully uploaded {csv_path} to Cloudant database.')


def create_db(client, db_name):
    try:
        res = client.delete_database(db=db_name).get_result()
        print(f"Database deletion response: {res}")
    except Exception as e:
        print(f"Failed to delete database '{db_name}': {e}")
        sys.exit(1)

    try:
        res = client.put_database(db=db_name).get_result()
        print(f"Database creation response: {res}")
    except Exception as e:
        print(f"Failed to create database '{db_name}': {e}")
        sys.exit(1)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python script.py <folder_path>")
        sys.exit(1)
    folder_path = sys.argv[1]

    api_key = os.getenv('CLOUDANT_API_KEY')
    url = os.getenv('CLOUDANT_URL')

    authenticator = IAMAuthenticator(api_key)
    client = CloudantV1(authenticator=authenticator)
    client.set_service_url(url)

    db_name = os.getenv('CLOUDANT_DB_NAME')
    for date_folder in os.listdir(folder_path):
        date_path = os.path.join(folder_path, date_folder)
        if os.path.isdir(date_path):
            try:
                datetime.strptime(date_folder, '%Y%m%d')
                for file_name in os.listdir(date_path):
                    if file_name.endswith('.csv'):
                        csv_path = os.path.join(date_path, file_name)
                        create_db(client, db_name)
                        upload_csv_to_cloudant(client, db_name, csv_path, date_folder)
            except ValueError:
                pass

    client.disconnect()

