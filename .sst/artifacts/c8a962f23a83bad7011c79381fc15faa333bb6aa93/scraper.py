import requests
from bs4 import BeautifulSoup as bs
import os
from dotenv import load_dotenv
import json
import boto3
from botocore.errorfactory import ClientError
import uuid

# Load .env file
load_dotenv()

# Get the URLs from the environment variables
MAIN_URL = os.environ['MAIN_URL']
DINING_URL = os.environ['DINING_URL']
BUCKET_NAME = os.environ['BUCKET_NAME']
id = 1

# Configure logging

def scrape_specific_dates_with_menus(link, hall):

    """
    Scrape menus for specific dates from the given link.

    Args:
        link (str): URL to scrape menus from. 

    Returns:
        list: List of menus for each specific date containing different meal items from `get_dining_menus`
    """

    response = requests.get(link)
    soup = bs(response.content, 'html.parser')

    menu_dates_available = soup.find_all('span', attrs={'class': 'dateselections'})

    dates_need_to_scrape = []

    for menu_date in menu_dates_available:
        href_value = menu_date.find('a')
        if href_value:
            href_new_link = href_value['href']
            dates_need_to_scrape.append({href_value.get_text(strip=True): href_new_link})
    
    menus = []

    for mapped_date_and_link in dates_need_to_scrape:
        key = list(mapped_date_and_link.keys())[0]
        menu = get_dining_menus(key, f'{DINING_URL}{mapped_date_and_link[key]}', hall)
        menus.extend(menu)
    
    return menus
        



def get_dining_hall_links():
    """
    Get dining hall names and links from the main URL.

    Returns:
        tuple: A tuple containing a list of dining hall names and a list of links.
    """
   
    response = requests.get(MAIN_URL)
    if response.status_code != 200:
        raise Exception(f'Failed request! {MAIN_URL} not accessible!')

    soup = bs(response.content, 'html.parser')
    dining_halls = []
    links = []
    for dining_hall_tag in soup.find_all('span', class_='locationchoices'):
        a = dining_hall_tag.find('a')
        if a:
            dining_halls.append(a.get_text(strip=True))
            links.append(a.get('href'))
  
    return dining_halls, links

def get_all_menu_items(link):
    """
    This is a seperate sub-unit function that returns all menu items regardless of the specific categorization.

    Args:
        link (str): The link of the specific dining hall page to scrape.

    Returns:
        list: A list containing all the menu items from the page.
    """
    response = requests.get(link)
    soup = bs(response.content, 'html.parser')
    menu_values = []

    meal_items = soup.find_all('div', attrs={'class': 'shortmenurecipes'})
    for meal_item in meal_items:
      span = meal_item.find('span')
      menu_values.append(span.get_text(strip=True))

    return menu_values



def get_dining_menus(date, link, hall):
    """
    Get dining menus for a specific date from the given link.

    Args:
        date (str): Date for which to get the menus.
        link (str): URL to scrape the menus from.

    Returns:
        dict: Dictionary containing the menus for the specified date.
    """

    response = requests.get(link)
    if response.status_code != 200:
        return []
    soup = bs(response.content, "html.parser")
    menu_items = {}
    menu_table = soup.find("table", {"align": "center", "cellpadding": "10", "cellspacing": "10"})
    if not menu_table:
        return []
    
    seen_items = set()
    current_meal = None
    current_subsection = None
    global id

    for row in menu_table.find_all("tr"):
        meal_section = row.find('div', class_='shortmenumeals')
        if meal_section:
            current_meal = meal_section.text.strip()

        meal_subsection = row.find('div', class_='shortmenucats')
        if meal_subsection:
            current_subsection = meal_subsection.text.strip().replace('-- ', '').replace(' --', '')
        
        meal_item = row.find('div', class_='shortmenurecipes')
        if current_meal and meal_item and current_subsection:
            meal_item_text = meal_item.text.strip()

            item_key = (meal_item_text, current_meal, current_subsection)
            
            if item_key not in seen_items:
                menu_items[item_key] = ({
                    'id': id,
                    'name': meal_item_text,
                    'meal_type': current_meal,
                    'category': current_subsection,
                    'votes': 0,
                    'hall': hall, 
                    'day': date,
                })

                id += 1
                seen_items.add(item_key)
    return list(menu_items.values())


def scrape_all_menus():
    """
    Main function to scrape and process dining menus.
    """
    dining_hall_names, dining_hall_links = get_dining_hall_links()
    entire_menu = []
    for i, link in enumerate(dining_hall_links):
        link = f'{DINING_URL}{link}'
        menus = scrape_specific_dates_with_menus(link, dining_hall_names[i])
        entire_menu.extend(menus)

    return entire_menu

def handler(event, context):
    menu_data = scrape_all_menus()
        
    data_json = json.dumps(menu_data)
    s3_client = boto3.client('s3')

    try:
            s3_client.put_object(
                Bucket=BUCKET_NAME,
                Key=f'dining_menus{uuid.uuid4}.json',
                Body=data_json
            )

            print(data_json)
            print('Data successfully added to S3 Bucket!')
    except ClientError as e:
            print(f'Failed to upload to S3: {e}')    

