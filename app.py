from flask import Flask, render_template, request, url_for, redirect, session, logging, flash
from sqlalchemy import create_engine
import data
import flask_mysqldb
import mysql
from flask_mysqldb import MySQL
from wtforms import Form, StringField, TextAreaField, PasswordField, validators
from passlib.hash import sha256_crypt
from sqlalchemy.orm import scoped_session, sessionmaker
import pickle
import numpy as np
import json
from functools import wraps
import hashlib
from flask_cors import CORS

engine = create_engine

app = Flask(__name__)
CORS(app)

#config mysql
# app.config['MYSQL_HOST'] = 'HeartApp.mysql.pythonanywhere-services.com'
# app.config['MYSQL_USER'] = 'HeartApp'
# app.config['MYSQL_PASSWORD'] = 'Heart@121'
# app.config['MYSQL_DB'] = 'HeartApp$demo'
# app.config['MYSQL_CURSORCLASS'] = 'DictCursor'


app.config['MYSQL_HOST'] = '127.0.0.1'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'HeartApp$demo'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'



# init mysql
mysql = MySQL(app)

@app.route('/')
def main_page():
    return render_template('homepage.html')

class RegisterForm(Form):
    name = StringField('Name', [validators.Length(min=1, max=50)])
    username = StringField('Userame', [validators.Length(min=4, max=25)])
    email = StringField('Email', [validators.Length(min=6, max=50)])
    password = PasswordField('Password', [
        validators.DataRequired(),
        validators.EqualTo('confirm', message='Passwords do not match')
    ])
    confirm = PasswordField('Confirm Password')


@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm(request.form)
    if request.method == 'POST' and form.validate():
        name = form.name.data
        email = form.email.data
        username = form.username.data
        password = sha256_crypt.encrypt(str(form.password.data))
        # Create cursor
        cur = mysql.connection.cursor()
        # Execute query
        cur.execute("INSERT INTO users(name, email, username, password) VALUES(%s, %s, %s, %s)", (name, email, username, password))
        # Commit to DB
        mysql.connection.commit()
        # Close connection
        cur.close()

        flash('You are now registered and can log in', 'success')

        return redirect(url_for('main_page'))
    return render_template('register.html', form=form)


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Get Form Fields
        username = request.form['username']
        password_candidate = request.form['password']
        # Create cursor
        cur = mysql.connection.cursor()
        # Get user by username
        result = cur.execute("SELECT * FROM users WHERE username = %s", [username])
        if result > 0:
            # Get stored hash
            data = cur.fetchone()
            password = data['password']
            # Compare Passwords
            if sha256_crypt.verify(password_candidate, password):
                # Passed
                session['logged_in'] = True
                session['username'] = username
                flash('You are now logged in', 'success')
                return redirect(url_for('dashboard'))
            else:
                error = 'Invalid login'
                return render_template('login.html', error=error)
            # Close connection
            cur.close()
        else:
            error = 'Username not found'
            return render_template('login.html', error=error)

    return render_template('login.html')


def is_logged_in(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if 'logged_in' in session:
            return f(*args, **kwargs)
        else:
            flash('Unauthorized, please login', 'danger')
            return redirect(url_for('login'))
    return wrap


@app.route('/logout')
@is_logged_in
def logout():
    session.clear()
    flash('You are now logged out', 'success')
    return redirect(url_for('login'))


@app.route('/dashboard')
@is_logged_in
def dashboard():
    return render_template('dashboard.html')


@app.route('/predict',methods=['GET','POST'])
def predict():
    return render_template('index.html')


@app.route('/result',methods=['POST'])
def result():

    if request.method == 'POST':
        data = request.get_json()
        test_list = []
        l1 = data["age_name"]
        l2 = data["sex_name"]
        l3 = data["chestpaintype_name"]
        l4 = data["restingbp_name"]
        l5 = data["cholestrol_name"]
        l6 = data["fastingbs_name"]
        l7 = data["restingecg_name"]
        l8 = data["maxhr_name"]
        l9 = data["exerciseangina_name"]
        l10 = data["oldpeak_name"]
        l11 = data["st_slope_name"]
        test_list = [l1, l2, l3, l4, l5, l6, l7, l8, l9, l10, l11]

    loaded_model = pickle.load(open('models/heart_prediction_model.sav', 'rb'))
    result = loaded_model.predict(np.array(test_list).reshape(1,-1))
    print(result)
    return str(result[[0]])

app.secret_key = 'secret123'

if __name__ == '__main__':
    app.secret_key = 'secret123'
    app.run('host=0.0.0.0')