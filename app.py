import flask
import json

from flask import Flask, url_for, render_template, request, jsonify

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
    return flask.redirect(url_for('welcome'))


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


if __name__ == '__main__':
    app.run()
