from flask import Blueprint
from flask import render_template, request, jsonify, redirect
from functools import wraps, update_wrapper
from flask import make_response
from datetime import datetime
import json


quiz_controller = Blueprint("quiz_controller", __name__)

with open('questions.json') as f:
    quiz_data = json.load(f)

def nocache(view):
    @wraps(view)
    def no_cache(*args, **kwargs):
        response = make_response(view(*args, **kwargs))
        response.headers['Last-Modified'] = datetime.now()
        response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '-1'
        return response
    return update_wrapper(no_cache, view)

flag = 0
question_wise = {}
# -2 will be updated with the number of "questions" with instructions
number_of_questions = len(quiz_data) - 2
@quiz_controller.route('/quiz_home')
@nocache
def main():
    global flag
    global question_wise
    global quiz_data
    # reset the selections when quiz is done
    for i in range(1, len(quiz_data)):
        if "selected" in quiz_data[str(i)]:
            quiz_data[str(i)]["selected"] = -1
    question_wise = {}
    if flag == 0:
        return render_template('quiz_home.html', data=quiz_data)
    else:
        return redirect("/question/0")

@quiz_controller.route('/question/<id>')
@nocache
def question(id=0):
    global quiz_data
    global flag
    question_id = id
    question_data = quiz_data[question_id]
    flag = 1
    tmp = 'question.html'
    if question_data["type"] == "2_ingredients":
        tmp = 'question.html'
    elif question_data["type"] == "3_ingredients":
        tmp = 'question_3.html'
    elif question_data["type"] == "fill_the_blanks":
        tmp = 'question_fill_the_gaps.html'
    elif question_data["type"] == "question_instructions":
        tmp = 'question_instructions.html'

    return render_template(
        tmp,
        item=question_data,
        n_questions=number_of_questions,
        total=len(quiz_data))


score = 0
@quiz_controller.route('/question/update_score', methods=['GET', 'POST'])
def update_score():
    global score
    num = request.get_json()
    score += float(num["correct"])
    if num["id"] not in question_wise:
        question_wise[num["id"]] = float(num["correct"])
    print(question_wise)
    return jsonify(url="/quiz_home")

@quiz_controller.route('/question/store_answer', methods=['GET', 'POST'])
def store_answer():
    global quiz_data
    item = request.get_json()
    question_id = str(item["id"])
    quiz_data[question_id] = item
    return jsonify(url="/quiz_home")


@quiz_controller.route('/end')
@nocache
def end():
    global quiz_data
    global question_wise
    global flag
    global score
    flag = 0
    score_tmp = sum(question_wise.values())
    score = 0
    return render_template('quiz_end.html', s=score_tmp, n_questions=number_of_questions, total=len(quiz_data))