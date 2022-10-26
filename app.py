import flask
import json

from flask import Flask, url_for, render_template

app = Flask(__name__)


@app.route('/')
def init():
    return flask.redirect(url_for('welcome'))


@app.route('/welcome')
def welcome():
    return render_template('welcome.html')


if __name__ == '__main__':
    app.run()
