from pymongo import MongoClient

client = MongoClient('mongodb+srv://alonzojp:<password>@chrisjlo.cua8pzj.mongodb.net/?retryWrites=true&w=majority&appName=chrisjlo')

db = client['BroncoHacks2025']
collection = db['users']

mydict = { "email": "test@gmail.com", "password": "password123" }
x = collection.insert_one(mydict)

