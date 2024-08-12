import os
from dotenv import load_dotenv
load_dotenv()
print("DJANGO_SETTINGS_MODULE:", os.environ.get('DJANGO_SETTINGS_MODULE'))
