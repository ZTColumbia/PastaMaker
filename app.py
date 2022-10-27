import flask
import json

from flask import Flask, url_for, render_template, request, jsonify, redirect
from functools import wraps, update_wrapper
from flask import make_response
from datetime import datetime

app = Flask(__name__)



with open('tree.json') as f:
    tree = json.load(f)

with open('recipe.json') as f:
    recipe = json.load(f)

with open('questions.json') as f:
    quiz_data = json.load(f)

@app.route('/')
def hello_world():
    return redirect(url_for('homepage'))

@app.route('/homepage')
def homepage():
    return render_template('homepage.html')

@app.route("/init_tree", methods=['GET', 'POST'])
def init_tree():
    data = request.get_json()
    id = data['id']
    return jsonify(dict(redirect=f'/create_tree_node/{id}'))


# global variables
nodes_info = {
    "visited": [],
    "cur": 0
}

@app.route('/create_tree_node/<id>')
def create_tree_node(id):
    global nodes_info

    if id not in nodes_info['visited']:
        nodes_info['visited'].append(id)

    nodes_info['cur'] = id
    parent = tree[id]
    children = parent['children']

    allow_quiz = False
    if parent['is_recipe']:
        allow_quiz = True

        recipe_name = tree[str(id)]['title']
        recipe_image = tree[str(id)]['image']
        recipe_text = recipe[str(id)]['text']

        ingredient_names = []
        ingredient_images = []

        for item in recipe[str(id)]['igredients']:
            ingredient_names.append(tree[str(item)]['title'])
            ingredient_images.append(tree[str(item)]['image'])

        return render_template('recipe.html',
                               recipe_name=recipe_name,
                               recipe_image=recipe_image,
                               ingredient_names=ingredient_names,
                               ingredient_images=ingredient_images,
                               recipe_text=recipe_text,
                               parent_id=parent['parent_id'],
                               visited=nodes_info['visited'],
                               present=nodes_info['cur'],
                               tree=tree,
                               allow_quiz=allow_quiz
                               )

    else:
        children_data = []
        for child_id in children:
            children_data.append(tree[str(child_id)])

        # render new branch
        tmp = "create_tree_node_"
        if len(children) == 1:
            tmp = tmp + "1.html"
        if len(children) == 2:
            tmp = tmp + "2.html"
        if len(children) == 3:
            tmp = tmp + "3.html"

        return render_template(tmp,
                   parent=parent,
                   children=children_data,
                   visited=nodes_info['visited'],
                   present=nodes_info['cur'],
                   tree=tree
                   )


############### Quiz ##################
@app.route("/load_recipe_page", methods=['GET', 'POST'])
def load_recipe_page():
    package = request.get_json()

    recipe_id = package['recipe_id']
    question_id = package['question_id']

    return jsonify(dict(redirect=f'/render_recipe/{recipe_id}'))

@app.route('/recipe/<recipe_id>')
def render_recipe(recipe_id):
    global nodes_info

    # update state dict
    recipe_name = tree[str(recipe_id)]['title']
    recipe_image = tree[str(recipe_id)]['image']
    recipe_text = recipe[str(recipe_id)]['text']

    ingredient_names = []
    ingredient_images = []

    for item in recipe[str(recipe_id)]['igredients']:
        ingredient_names.append(tree[str(item)]['title'])
        ingredient_images.append(tree[str(item)]['image'])

    return render_template('recipe_for_quiz.html',
                           recipe_name=recipe_name,
                           recipe_image=recipe_image,
                           ingredient_names=ingredient_names,
                           ingredient_images=ingredient_images,
                           recipe_text=recipe_text,
                           visited=nodes_info['visited'],
                           present=nodes_info['cur'],
                           tree=tree
                           )

s = 0
c = 0
question_wise = {}
# -2 will be updated with the number of "questions" with instructions
number_of_questions = len(quiz_data) - 2

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

@app.route("/goto_quiz_home", methods=['GET', 'POST'])
def goto_quiz_home():
    return jsonify(dict(redirect=f'/quiz_home'))

@app.route('/quiz_home')
@nocache
def main():
    global c
    global question_wise
    global quiz_data
    # reset the selections when quiz is done
    for i in range(1, len(quiz_data)):
        if "selected" in quiz_data[str(i)]:
            quiz_data[str(i)]["selected"] = -1
    question_wise = {}
    if c == 0:
        return render_template('quiz_home.html', data=quiz_data)
    else:
        return redirect("/question/0")

@app.route('/question/<id>')
@nocache
def question(id=0):
    global quiz_data
    global c
    question_id = id
    question_data = quiz_data[question_id]
    c = 1
    if question_data["type"] == "2_ingredients":
        return render_template(
            'question.html',
            item=question_data,
            n_questions=number_of_questions,
            total=len(quiz_data))
    elif question_data["type"] == "3_ingredients":
        return render_template(
            'question_3.html',
            item=question_data,
            n_questions=number_of_questions,
            total=len(quiz_data))
    elif question_data["type"] == "fill_the_blanks":
        return render_template(
            'question_fill_the_gaps.html',
            item=question_data,
            n_questions=number_of_questions,
            total=len(quiz_data))
    elif question_data["type"] == "question_instructions":
        return render_template(
            'question_instructions.html',
            item=question_data,
            n_questions=number_of_questions,
            total=len(quiz_data))
    return render_template(
        'question.html',
        item=question_data,
        n_questions=number_of_questions,
        total=len(quiz_data))

@app.route('/question/update_score', methods=['GET', 'POST'])
def update_score():
    global s
    num = request.get_json()
    s += float(num["correct"])
    if num["id"] not in question_wise:
        question_wise[num["id"]] = float(num["correct"])
    print(question_wise)
    return jsonify(url="/quiz_home")

@app.route('/question/store_answer', methods=['GET', 'POST'])
def store_answer():
    global quiz_data
    item = request.get_json()
    question_id = str(item["id"])
    quiz_data[question_id] = item
    return jsonify(url="/quiz_home")

@app.route('/end')
@nocache
def end():
    global quiz_data
    global question_wise
    global c
    global s
    c = 0
    s_temp = sum(question_wise.values())
    s = 0
    return render_template('quiz_end.html', s=s_temp, n_questions=number_of_questions, total=len(quiz_data))


if __name__ == '__main__':
    app.run()
