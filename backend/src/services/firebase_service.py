import firebase_admin
from firebase_admin import credentials, firestore, auth
from src.config import Config

db = None

def init_firebase():
    global db
    if Config.FIREBASE_CREDENTIALS_JSON:
        cred = credentials.Certificate(Config.FIREBASE_CREDENTIALS_JSON)
        # Avoid re-initialization error
        if not firebase_admin._apps:
            firebase_admin.initialize_app(cred)
        db = firestore.client()
    else:
        print("Warning: Firebase credentials not found in env.")

init_firebase()
