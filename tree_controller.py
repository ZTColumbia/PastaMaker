from flask import Blueprint
from flask import render_template, request, jsonify
import json


tree_controller = Blueprint("tree_controller", __name__)

with open('tree.json') as f:
    tree = json.load(f)

with open('recipe.json') as f:
    recipe = json.load(f)



# global variables
nodes_info = {
    "visited": [],
    "cur": 0
}

def render_recipe_helper(recipe_id, tmp, allow_quiz, parent):
    global nodes_info

    # update
    recipe_name = tree[str(recipe_id)]['title']
    recipe_image = tree[str(recipe_id)]['image']
    recipe_text = recipe[str(recipe_id)]['text']

    ingredient_names = []
    ingredient_images = []

    for item in recipe[str(recipe_id)]['igredients']:
        ingredient_names.append(tree[str(item)]['title'])
        ingredient_images.append(tree[str(item)]['image'])

    return render_template(tmp,
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


@tree_controller.route("/init_tree", methods=['GET', 'POST'])
def init_tree():
    data = request.get_json()
    id = data['id']
    return jsonify(dict(redirect=f'/create_tree_node/{id}'))

@tree_controller.route('/create_tree_node/<id>')
def create_tree_node(id):
    global nodes_info

    if id not in nodes_info['visited']:
        nodes_info['visited'].append(id)

    nodes_info['cur'] = id
    parent = tree[id]
    children = parent['children']

    if parent['is_recipe']:
        return render_recipe_helper(id, 'recipe.html', True, parent)

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

@tree_controller.route('/recipe/<recipe_id>')
def render_recipe(recipe_id):
    parent = dict()
    parent['parent_id'] = 0
    return render_recipe_helper(recipe_id, 'recipe_for_quiz.html', False, parent)