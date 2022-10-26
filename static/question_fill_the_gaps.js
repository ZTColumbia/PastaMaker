let remaining_answers = []
let number_of_filled_blanks = 0
let correct_blanks = 0
let correct_wrong = []
let blank_to_sentence = []
let caption_type = []
let new_answer_item = []
let next_q = ""

function send_correct(is_correct) {
    $.ajax({
        type: "POST",
        url: "update_score",
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(is_correct),
        success: function (response) {
            console.log("success");
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
}

function submitquestion(next_item, total, is_correct, instructions_list){
    $("#recipe").append("<button type='button' id='rcp_button' class='rcp_button'>See recipe for " + item["recipe_name"] + "</button>");
    $('.rcp_button').addClass("enabled_light_yellow");
    $("#correctanswers").append("<button type='button' id='corr_button' class='corr_button'>Show correct answers</button>");
    $('.corr_button').addClass("enabled_light_yellow");

    correctanswers
    if (next_item >= total){
        $("#nextq").append("<button type='button' id='next_button' class='next_button'><a href='/end' style='color:#fff'>Submit Quiz</button>");
        $('.next_button').addClass("enabled_yellow");
        send_correct(is_correct);
    }
    else{
        $("#nextq").append("<button type='button' id='next_button' class='next_button'><a href='/question/"+next_item+"' style='color:#fff'>Next Question</button>");
        $('.next_button').addClass("enabled_yellow");
        send_correct(is_correct);
    }
    
    for (let i = 0; i < caption_type.length; i++){
        let anwser_html = new_answer_item[i].html()
        let split_anwser_html = anwser_html.split("caption_1");
        new_answer_item[i].html(split_anwser_html[0] + caption_type[i] + split_anwser_html[1])
    }
}

function showresetbutton(){
    $("#reset").append("<button id='rst_button' class='rst_button'>Reset question</button>");
    $('.rst_button').addClass("enabled_light_yellow");
}

function showsubmitbutton(){
    $("#submit").append("<button type='button' id='sbt_button' class='sbt_button'>Submit</button>");
    $('#sbt_button').prop("disabled", true);
    $('#sbt_button').addClass("disabled_grey");
}

function make_answers(remaining_answers){
    $("#answers").empty()
    let counter = 0
    $.each(remaining_answers, function(index, answer){
      let label = answer["label"]
      let image = answer["image"]
      caption_type[counter] = "caption_1"

      new_answer_item[counter] = $("<div class='ui-widget-content answer_items'>")
      new_answer_item[counter].html("<img src='../static/images/" + image + "' width='100%' height='80'/><br/><figcaption class='" + caption_type[counter] + "'>" + label)
      new_answer_item[counter].data("name", label)
      new_answer_item[counter].data("image", image)
      new_answer_item[counter].data("id", index)

      $("#answers").append(new_answer_item[counter])
  
      $(".answer_items").draggable({
        cursor: "all-scroll",
        start: function( event, ui ) {
          $(this).addClass("drag")
        },
        stop: function( event, ui ) {
          $(this).removeClass("drag")
        },
        revert: function(droppableObj){
          if (droppableObj === false) {
            return true
          }
          else{
            return false
          }
        }
      })
      $(".answer_items").hover(function() {
        $(this).addClass('hover');
      },function() {
        $(this).removeClass('hover');
      }); 
      counter++
    })
}

function make_instructions(instructions_list){
    $("#instructions").empty()
    let counter = 0
    let sentence_id = 0
    $.each(instructions_list, function(index, instruction){
        let new_instruction_item = $("<div class='instruction_items'>")
        if (instruction.includes("____")){
            let text_parts = instruction.split("____");
            new_instruction_item.append("<p>")
            new_instruction_item.append(text_parts[0])
            $.each(text_parts.slice(1), function(index, text_part){
                new_instruction_item.append("<div id='drop_text" + counter + "'class='drop_text_items'>")
                blank_to_sentence.push(sentence_id)
                counter = counter + 1
                new_instruction_item.append(text_part)
            })
            new_instruction_item.append("</p>")
        }
        else {
            new_instruction_item.html(instruction)
        }
        $("#instructions").append(new_instruction_item)
        correct_wrong.push("")
        sentence_id++
    })
}

function make_instructions_with_answers(instructions_list){
    $("#instructions").empty()
    let correct_order = item["correct_order"]
    let label_list = item["label_list"]
    let counter = 0
    $.each(instructions_list, function(index, instruction){
        let new_instruction_item = $("<div class='instruction_items_with_answers'>")
        if (instruction.includes("____")){
            let text_parts = instruction.split("____");
            new_instruction_item.append("<p>")
            new_instruction_item.append(text_parts[0])
            $.each(text_parts.slice(1), function(index, text_part){
                new_instruction_item.append("<div id='instr_answer" + counter + "' class='instruction_answer'>"+label_list[correct_order[counter]])
                new_answer_item[counter].html("")
                new_instruction_item.append(text_part)
                counter++
            })
            new_instruction_item.append("</p>")
        }
        else {
            new_instruction_item.html(instruction)
        }
        $("#instructions").append(new_instruction_item)
    })
}

function create_template(remaining_answers, instructions_list, next_item) {
    make_answers(remaining_answers)
    make_instructions(instructions_list)
    
    for (let i = 0; i < item["number_of_ingredients"]; i++) {
        $("#drop_text" + i).droppable({
            accept: ".answer_items",
            hoverClass: "hover-active",
            drop: function(event, ui){
                $(this).append(ui.draggable.css('position','static'))
                $(ui.draggable[0]).hover(function() {
                    $(this).removeClass('hover');
                  }); 
                $("#drop_text" + i).droppable('disable')
                let answer_item_name = $(ui.draggable[0]).data("name")
                let answer_item_id = $(ui.draggable[0]).data("id")
                number_of_filled_blanks++ 
                if (answer_item_id == item["correct_order"][i]) {
                    correct_blanks++
                    if (correct_wrong[blank_to_sentence[i]] == ""){
                        correct_wrong[blank_to_sentence[i]] = "Correct"
                    }
                    caption_type[answer_item_id] = "caption_correct"
                }
                else {
                    correct_wrong[blank_to_sentence[i]] = "Wrong"
                    caption_type[answer_item_id] = "caption_wrong"
                }
                if (number_of_filled_blanks == item["number_of_ingredients"]){
                    $('.sbt_button').prop("disabled", false);
                    $('.sbt_button').removeClass("disabled_grey");
                    $('.sbt_button').addClass("enabled_yellow");
                }
            }
        })
    }
}

$(document).ready(function(){
    let images = item["image_list"]
    let labels = item["label_list"]
    let instructions_list = item["text_list"]
    let next_item = item["id"] + 1
    for (let i = 0; i < images.length; i++) {
        remaining_answers.push({"image": images[i], "label": labels[i]})
    }
    showresetbutton()
    showsubmitbutton()
    console.log(100*parseInt(item["id"])/total)
    $("#title").append(item["title"]);
    $("#question").append("<p>Fill in the steps for making " + "<strong>" + item["recipe_name"] + "</strong></p>");
    $( "#progressbar" ).progressbar({
        value: Math.round(100*parseInt(item["question_number"]-1)/n_questions)
    });
    $( ".progress-label" ).text($( "#progressbar" ).progressbar( "value") + "%");
    create_template(remaining_answers, instructions_list, next_item)

    $("#reset").click(function(){
        number_of_filled_blanks = 0
        correct_blanks = 0
        correct_wrong = []
        blank_to_sentence = []
        caption_type = []
        new_answer_item = []
        create_template(remaining_answers, instructions_list, next_item)
        $('#sbt_button').prop("disabled", true);
        $('.sbt_button').removeClass("enabled_yellow");
        $('#sbt_button').addClass("disabled_grey");
    })

    $("#submit").click(function(){
        $("#reset").empty()
        $("#submit").empty()
        let is_correct = {"correct": (correct_blanks / number_of_filled_blanks).toString(), "id": item["question_number"]};
        submitquestion(next_item, total, is_correct, instructions_list)
    })
    
    $("#recipe").click(function(){
        let url = "/recipe/"+item["recipe_id"]
        window.open(url, '_blank');
        //window.open(url, "popupWindow", "width=1500,height=600,scrollbars=yes");
    })

    $("#correctanswers").click(function(){
        $("#correctanswers").empty()
        make_instructions_with_answers(instructions_list)
    })
    
});