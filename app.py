from flask import Flask, url_for, render_template, redirect
from tree_controller import tree_controller
from quiz_controller import quiz_controller


app = Flask(__name__)
app.register_blueprint(tree_controller)
app.register_blueprint(quiz_controller)

@app.route('/')
def hello_world():
    return redirect(url_for('homepage'))

@app.route('/homepage')
def homepage():
    return render_template('homepage.html')


if __name__ == '__main__':
    app.run()
