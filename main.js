// let d = new Date();
// let dateString = d.toLocaleString();
//
// function Todo(checked, content, date) {
//   this.checked = checked;
//   this.content = content;
//   this.date = date;
// }

$(function() {
  $("#add-content").focus();

  //add todo
  $("#add-btn").on("click", function() {
    let addContent = $("#add-content").text().trim();

    if (addContent !== "") {
      $("#todo-list").append(generateTodo(addContent));
      $("#add-content").text("");
    }
  });

  //check todo
  $(document).on("click", ".fa-check", function() {
    let checked = $(this).data("checked");

    if (checked) {
      $(this).css("color", "var(--white)");
    } else {
      $(this).css("color", "var(--black)");
    }

    $(this).data("checked", !checked);
    $(this).attr("data-checked", !checked);
  });

  //edit todo
  $(document).on("click", ".fa-pen", function() {
    let editContent = $(this).parent().siblings(".content-block");

    editContent.attr("contenteditable", true);
    editContent.css("cursor", "text");
    editContent.focus();
  });

  //finish-editing todo
  $(document).on("blur", ".content-block", function() {
    $(this).text($(this).text());
    $(this).attr("contenteditable", false);
    $(this).css("cursor", "default");
  });

  //delete todo
  $(document).on("click", ".fa-trash", function() {
    $(this).parents(".todo").remove();
  });
});

function generateTodo(content) {
  let todoHtml = "";

  todoHtml += '<div class="todo">';
  todoHtml += '<div class="icon-block text-center">';
  todoHtml += '<i class="fas fa-check" data-checked="false"></i>';
  todoHtml += '</div>';
  todoHtml += '<div class="content-block" contenteditable="false">'
  todoHtml += content;
  todoHtml += '</div>';
  todoHtml += '<div class="icon-block text-right">';
  todoHtml += '<i class="fas fa-pen"></i>';
  todoHtml += '</div>';
  todoHtml += '<div class="icon-block text-center">';
  todoHtml += '<i class="fas fa-trash"></i>';
  todoHtml += '</div>';
  todoHtml += '</div>';

  return todoHtml;
}