let remaining_answers = []
let number_of_filled_blanks = 0
let correct_blanks = 0
let correct_wrong = []
let blank_to_sentence = []
let caption_type = []
let new_answer_item = []
let next_q = ""

function submitquestion(next_item, total){
    if (next_item > total){
        $("#nextq").append("<button type='button' id='next_button' class='next_button'><a href='/end' style='color:#fff'>Submit Quiz</button>");
        $('.next_button').addClass("enabled_yellow");
    }
    else{
        $("#nextq").append("<button type='button' id='next_button' class='next_button'><a href='/question/"+next_item+"' style='color:#fff'>Get Started</button>");
        $('.next_button').addClass("enabled_yellow");
    }
}


function add_gif(url){
    let gif = "<img src='" + url + "' width='100%' height='80'/>"
    $("#gif").html(gif)
}

$(document).ready(function(){
    $("#gif").html("<img src='../static/images/" + item["gif_link"] + "' width='180%'/>")
    console.log("h")
    let part = Number(item["id"] != 0) + 1
    $("#title").append(item["title"]);
    $("#howtocomplete").append("Instructions to answer Part "+part)
    $("#instructions").append("<p>" + item["description"] + "</p>");
    $("#tutorial").append("Please watch the following example:");
    
    let next_item = item["id"] + 1
    submitquestion(next_item, total)
    
});
