$(function() {
  $("#add-content").focus();

  //add todo
  $("#add-btn").on("click", function() {
    let addContent = $("#add-content").text().trim();
    let date = new Date();

    if (addContent != "") {
      db.collection("todos").add({
        content: addContent,
        checked: false,
        date: date
      });

      $("#add-content").text("");
    }
  });

  //check todo
  $(document).on("click", ".fa-check", function() {
    let that = $(this);
    let id = that.parents(".todo-item").attr("data-id");
    let selectedBtnId = $(".selected").attr("id");

    db.collection("todos").doc(id).get().then(function(doc) {
      let checked = !doc.data().checked;
      db.collection("todos").doc(id).update({
        checked: checked
      });

      if (checked) {
        that.addClass("checked");

        if (selectedBtnId == "show-undone-btn") {
          that.parents(".todo-item").fadeOut(1000);
        }
      } else {
        that.removeClass("checked");

        if (selectedBtnId == "show-done-btn") {
          that.parents(".todo-item").fadeOut(1000);
        }
      }
    });
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
      if (event.target.id == "add-content") {
        $("#add-btn").click();
      } else {
        $(this).blur();
      }
    }
  });

  //show all todos
  $("#show-all-btn").on("click", function() {
    $(".delete-all-btn").text("Delete All Todos");
    $(".selected").removeClass("selected");
    $(this).addClass("selected");

    db.collection("todos").orderBy("date").get().then(function(snapshot) {
      $("#todo-list").empty();
      snapshot.docs.forEach(function(doc) {
        renderTodo(doc);
      });
    });
  });

  //show undone todos
  $("#show-undone-btn").on("click", function() {
    $(".delete-all-btn").text("Delete All Undone Todos");
    $(".selected").removeClass("selected");
    $(this).addClass("selected");

    db.collection("todos").where("checked", "==", false).orderBy("date").get().then(function(snapshot) {
      $("#todo-list").empty();
      snapshot.docs.forEach(function(doc) {
        renderTodo(doc);
      });
    });
  });

  //show done todos
  $("#show-done-btn").on("click", function() {
    $(".delete-all-btn").text("Delete All Done Todos");
    $(".selected").removeClass("selected");
    $(this).addClass("selected");

    db.collection("todos").where("checked", "==", true).orderBy("date").get().then(function(snapshot) {
      $("#todo-list").empty();
      snapshot.docs.forEach(function(doc) {
        renderTodo(doc);
      });
    });
  });

  //delete all todos in specific section
  $(".delete-all-btn").on("click", function() {
    $(".todo-item").each(function() {
      db.collection("todos").doc($(this).attr("data-id")).delete();

      $(`.todo-item[data-id=${$(this).attr("data-id")}]`).remove();
    })
  });
});

//render todo-item html
function renderTodo(doc) {
  let todoItem = "";
  todoItem += `<div class="todo-item" data-id="${doc.id}">`;
  todoItem += '<div class="row">';
  todoItem += '<div class="col-2 d-flex align-items-center text-center">';
  if (doc.data().checked) {
    todoItem += '<i class="fas fa-check checked"></i>';
  } else {
    todoItem += '<i class="fas fa-check"></i>';
  }
  todoItem += '</div>';
  todoItem += '<div class="col-7 d-flex align-items-center">';
  todoItem += '<div class="todo-content" contenteditable="false">';
  todoItem += doc.data().content;
  todoItem += '</div>';
  todoItem += '</div>';
  todoItem += '<div class="col-2 d-flex align-items-center justify-content-end text-center">';
  todoItem += '<i class="fas fa-pen"></i>';
  todoItem += '</div>';
  todoItem += '<div class="col-1 d-flex align-items-center justify-content-end text-right">';
  todoItem += '<i class="fas fa-trash"></i>';
  todoItem += '</div>';
  todoItem += '</div>';
  todoItem += '</div>';

  $("#todo-list").append(todoItem);
}

//db real-time listener
db.collection("todos").orderBy("date").onSnapshot(function(snapshot) {
  let changes = snapshot.docChanges();
  changes.forEach(function(change) {
    if (change.type == "added") {
      if ($(".selected").attr("id") !== "show-done-btn") {
        renderTodo(change.doc);
      }
    }
  });
});