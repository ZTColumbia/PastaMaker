function fillIngredients(obj, idx) {
	console.log(idx);
	if (idx == null) {
		return "";
	}
	str = "";
	str += fillIngredients(obj, tree_structure[idx].parent_id);
	str +=
		"<img src = '../static/images/" +
		tree_structure[idx].image +
		"' width = '80px' height = '80px'> <br>" +
		tree_structure[idx].title +
		"<hr>";
	return str;
}
function fillBasket() {
	obj = $("#ingredients");
	obj.empty();
	obj.append("<h3>Your Basket</h3>");
	obj.append("<hr>");
	str = fillIngredients(obj, present);
	obj.append(str);
}
$(document).ready(function () {
	fillBasket();
});
