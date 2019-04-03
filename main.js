$(function() {
  $("#add-content").focus();

  //add todo
  $("#add-btn").on("click", function() {
    let addContent = $("#add-content").text().trim();

    if (addContent != "") {
      db.collection("todos").add({
        content: addContent,
        checked: false
      });
      $("#add-content").text("");
    }
  });

  //check todo
  $(document).on("click", ".fa-check", function() {
    let id = $(this).parents(".todo-item").attr("data-id");
    let checked = !JSON.parse($(this).attr("data-checked"));
    db.collection("todos").doc(id).update({
      checked: checked
    });

    if (checked) {
      $(this).addClass("checked");
    } else {
      $(this).removeClass("checked");
    }

    $(this).attr("data-checked", checked.toString());
  });

  //edit todo
  $(document).on("click", ".fa-pen", function() {
    let content = $(this).parents(".todo-item").find(".todo-content");
    content.attr("contenteditable", "true");
    content.css("cursor", "text");
    content.focus();
  });

  //finish editing todo
  $(document).on("blur", ".todo-content", function() {
    let id = $(this).parents(".todo-item").attr("data-id");
    let editContent = $(this).text().trim();
    db.collection("todos").doc(id).update({
      content: editContent
    });

    $(this).text(editContent);
    $(this).attr("contenteditable", "false");
    $(this).css("cursor", "default");
  });

  //delete todo
  $(document).on("click", ".fa-trash", function() {
    let id = $(this).parents(".todo-item").attr("data-id");
    db.collection("todos").doc(id).delete();

    $(`.todo-item[data-id=${id}]`).remove();
  });

  //disable change line in content
  $(document).on("keypress", "#add-content, .todo-content", function(event) {
    if (event.keyCode === 13) {
      return false;
    }
  });

  //press enter to send/finish editing todo
  $(document).on("keyup", "#add-content, .todo-content", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();

      if (event.target.id == "add-content") {
        $("#add-btn").click();
      } else {
        $(this).blur();
      }
    }
  });

  //show all todos
  $("#show-all-btn").on("click", function() {
    $(".selected").removeClass("selected");
    $(this).addClass("selected");

    db.collection("todos").get().then(function(snapshot) {
      $("#todo-list").empty();
      snapshot.docs.forEach(function(doc) {
        renderTodo(doc);
      });
    });
  });

  //show undone todos
  $("#show-undone-btn").on("click", function() {
    $(".selected").removeClass("selected");
    $(this).addClass("selected");

    db.collection("todos").where("checked", "==", false).get().then(function(snapshot) {
      $("#todo-list").empty();
      snapshot.docs.forEach(function(doc) {
        renderTodo(doc);
      });
    });
  });

  //show done todos
  $("#show-done-btn").on("click", function() {
    $(".selected").removeClass("selected");
    $(this).addClass("selected");

    db.collection("todos").where("checked", "==", true).get().then(function(snapshot) {
      $("#todo-list").empty();
      snapshot.docs.forEach(function(doc) {
        renderTodo(doc);
      });
    });
  });
});

function renderTodo(doc) {
  let todoHtml = "";
  todoHtml += `<div class="todo-item" data-id="${doc.id}">`;
  todoHtml += '<div class="row">';
  todoHtml += '<div class="col-2 d-flex align-items-center text-center">';
  if (doc.data().checked) {
    todoHtml += `<i class="fas fa-check checked" data-checked="${doc.data().checked}"></i>`;
  } else {
    todoHtml += `<i class="fas fa-check" data-checked="${doc.data().checked}"></i>`;
  }
  todoHtml += '</div>';
  todoHtml += '<div class="col-7 d-flex align-items-center">';
  todoHtml += '<div class="todo-content" contenteditable="false">';
  todoHtml += doc.data().content;
  todoHtml += '</div>';
  todoHtml += '</div>';
  todoHtml += '<div class="col-2 d-flex align-items-center justify-content-end text-center">';
  todoHtml += '<i class="fas fa-pen"></i>';
  todoHtml += '</div>';
  todoHtml += '<div class="col-1 d-flex align-items-center justify-content-end text-right">';
  todoHtml += '<i class="fas fa-trash"></i>';
  todoHtml += '</div>';
  todoHtml += '</div>';
  todoHtml += '</div>';

  $("#todo-list").prepend(todoHtml);
}

//db real-time listener
db.collection("todos").onSnapshot(function(snapshot) {
  let changes = snapshot.docChanges();
  changes.forEach(function(change) {
    if (change.type == "added") {
      renderTodo(change.doc);
    }
  });
});