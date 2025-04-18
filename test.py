from pymongo import MongoClient
from flask import Flask, render_template, request, url_for, redirect

client = MongoClient('mongodb+srv://alonzojp:<password>@chrisjlo.cua8pzj.mongodb.net/?retryWrites=true&w=majority&appName=chrisjlo')

db = client['BroncoHacks2025']
collection = db['users']

app = Flask(__name__)

@app.route("/", methods=('GET', 'POST'))
def home():
    if(request.method == 'POST'):
        email = request.form['email']
        password = request.form['password']

        if(collection.find_one({"email":email})):
            print("Email already exists.")
        else:
            print("Account created!")
            collection.insert_one({"email":email, "password":password})
            for document in collection.find({}):
                print(document)
            
        return redirect(url_for('home'))
    
    all_users = collection.find()
    return render_template('test.html', users = all_users)

@app.route("/login", methods=('GET', 'POST'))
def login():
    error_message = ''
    if(request.method == 'POST'):
        email = request.form['email']
        password = request.form['password']

        if(collection.find_one({"email":email})):
            found_user = collection.find_one({"email":email})
            if(password == found_user['password']):
                error_message = "Logged In!"
            else:
                error_message = "Incorrect Password."
        else:
            error_message = "User not found!"

    return render_template('login.html', error_message = error_message)

if __name__ == "__main__":
    app.run()