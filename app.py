import flask
import json

from flask import Flask, url_for, render_template, request, jsonify, redirect
from functools import wraps, update_wrapper
from flask import make_response
from datetime import datetime



app = Flask(__name__)


# global variables
state_tracker = {
    "nodes_visited": [],
    "current_node": 0
}

with open('tree_structure.json') as f:
    tree_structure = json.load(f)

with open('recipe_ingredients.json') as f:
    recipe_ingredients = json.load(f)

with open('questions.json') as f:
    quiz_data = json.load(f)

@app.route('/')
def init():
    return redirect(url_for('welcome'))


@app.route('/welcome')
def welcome():
    return render_template('welcome.html')

@app.route("/traverse_tree", methods=['GET', 'POST'])
def traverse_tree():
    package = request.get_json()

    id = package['id']

    return jsonify(dict(redirect=f'/render_branch/{id}'))

@app.route('/render_branch/<id>')
def render_branch(id):
    global state_tracker

    if id not in state_tracker['nodes_visited']:
        state_tracker['nodes_visited'].append(id)

    state_tracker['current_node'] = id

    parent = tree_structure[id]
    children = parent['children']

    allow_quiz = True
    if len(state_tracker['nodes_visited']) == 26:
        allow_quiz = True

    # render leaf node
    if parent['is_recipe']:

        recipe_name = tree_structure[str(id)]['title']
        recipe_image = tree_structure[str(id)]['image']
        recipe_text = recipe_ingredients[str(id)]['text']

        ingredient_names = []
        ingredient_images = []

        for item in recipe_ingredients[str(id)]['igredients']:
            ingredient_names.append(tree_structure[str(item)]['title'])
            ingredient_images.append(tree_structure[str(item)]['image'])

        return render_template('recipe_2.html',
                               recipe_name=recipe_name,
                               recipe_image=recipe_image,
                               ingredient_names=ingredient_names,
                               ingredient_images=ingredient_images,
                               recipe_text=recipe_text,
                               parent_id=parent['parent_id'],
                               visited=state_tracker['nodes_visited'],
                               present=state_tracker['current_node'],
                               tree_structure=tree_structure
                               )

    else:
        children_data = []
        for child_id in children:
            children_data.append(tree_structure[str(child_id)])

        # render new branch
        if len(children) == 1:
            return render_template('render_branch_1.html',
                                   parent=parent,
                                   child_1=children_data[0],
                                   visited=state_tracker['nodes_visited'],
                                   present=state_tracker['current_node'],
                                   tree_structure=tree_structure,
                                   allow_quiz=allow_quiz
                                   )

        elif len(children) == 2:
            return render_template('render_branch_2.html',
                                   parent=parent,
                                   child_1=children_data[0],
                                   child_2=children_data[1],
                                   visited=state_tracker['nodes_visited'],
                                   present=state_tracker['current_node'],
                                   tree_structure=tree_structure,
                                   allow_quiz=allow_quiz

                                   )

        elif len(children) == 3:
            return render_template('render_branch_3.html',
                                   parent=parent,
                                   child_1=children_data[0],
                                   child_2=children_data[1],
                                   child_3=children_data[2],
                                   visited=state_tracker['nodes_visited'],
                                   present=state_tracker['current_node'],
                                   tree_structure=tree_structure,
                                   allow_quiz=allow_quiz
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
    global state_tracker

    # update state dict
    recipe_name = tree_structure[str(recipe_id)]['title']
    recipe_image = tree_structure[str(recipe_id)]['image']
    recipe_text = recipe_ingredients[str(recipe_id)]['text']

    ingredient_names = []
    ingredient_images = []

    for item in recipe_ingredients[str(recipe_id)]['igredients']:
        ingredient_names.append(tree_structure[str(item)]['title'])
        ingredient_images.append(tree_structure[str(item)]['image'])

    return render_template('recipe_for_quiz.html',
                           recipe_name=recipe_name,
                           recipe_image=recipe_image,
                           ingredient_names=ingredient_names,
                           ingredient_images=ingredient_images,
                           recipe_text=recipe_text,
                           visited=state_tracker['nodes_visited'],
                           present=state_tracker['current_node'],
                           tree_structure=tree_structure
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


if __name__ == '__main__':
    app.run()
