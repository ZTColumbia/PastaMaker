function fillIngredients(obj, idx) {
	if (idx == null) {
		return "";
	}
	str = "";
	str += fillIngredients(obj, tree[idx].parent_id);
	str +=
		"<img src = '../static/images/" +
		tree[idx].image +
		"' width = '80px' height = '80px'> <br>" +
		tree[idx].title +
		"<hr>";
	return str;
}
function fillChoices() {
	obj = $("#ingredients");
	obj.empty();
	obj.append("<h3>Your Choices</h3>");
	obj.append("<hr>");
	str = fillIngredients(obj, present);
	obj.append(str);
}
$(document).ready(function () {
	fillChoices();
});
