// Function to fetch and display stories
function displayStories() {
    $.ajax({
      url: "https://usmanlive.com/wp-json/api/stories",
      method: "GET",
      dataType: "json",
      success: function (data) {
        var storiesList = $("#storiesList");
        storiesList.empty();
  
        $.each(data, function (index, story) {
          storiesList.append(
            `<tr>
                  <td>${story.id}</td>
                  <td>${story.title}</td>
                  <td>${story.content}</td>
                  <td>
                      <button class="btn btn-info btn-sm mr-2 btn-edit" data-id="${story.id}">Edit</button>
                      <button class="btn btn-danger btn-sm mr-2 btn-del" data-id="${story.id}">Delete</button>
                  </td>
              </tr>`
          );
        });
      },
      error: function (error) {
        console.error("Error fetching stories:", error);
      },
    });
  }
  // Function to delete a story
  function deleteStory() {
    let storyId = $(this).attr("data-id");

    // Show confirmation dialog before deleting
  
        $.ajax({
            url: "https://usmanlive.com/wp-json/api/stories/" + storyId,
            method: "DELETE",
            success: function () {
                displayStories(); // Refresh the list after deleting a story

                // Show success message
              
            },
            error: function (error) {
                console.error("Error deleting story:", error);
            },
        });
    
}


  function handleFormSubmission(event) {
    event.preventDefault();
    let storyId = $("#createBtn").attr("data-id");
    var title = $("#createTitle").val();
    var content = $("#createContent").val();
    if (storyId) {
      $.ajax({
        url: "https://usmanlive.com/wp-json/api/stories/" + storyId,
        method: "PUT",
  
        data: { title, content },
        success: function () {
          displayStories(); // Refresh the list after creating a new story
        },
        error: function (error) {
          console.error("Error creating story:", error);
        },
      });
    } else {
      $.ajax({
        url: "https://usmanlive.com/wp-json/api/stories",
        method: "POST",
        data: { title, content },
        success: function () {
          displayStories(); // Refresh the list after creating a new story
        },
        error: function (error) {
          console.error("Error creating story:", error);
        },
      });
    }
  }
  function editBtnClicked(event) {
    event.preventDefault();
    let storyId = $(this).attr("data-id");
    $.ajax({
      url: "https://usmanlive.com/wp-json/api/stories/" + storyId,
      method: "GET",
      success: function (data) {
        console.log(data);
        $("#clearBtn").show();
        $("#createTitle").val(data.title);
        $("#createContent").val(data.content);
        $("#createBtn").html("Update");
        $("#createBtn").attr("data-id", data.id);
        // Smooth scroll to the top of the screen
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

      },
      error: function (error) {
        console.error("Error deleting story:", error);
      },
    });
  }
  
  
  $(document).ready(function () {
    // Initial display of stories
  
    displayStories();
    $(document).on("click", ".btn-del", deleteStory);
    $(document).on("click", ".btn-edit", editBtnClicked);
    // Create Form Submission
    $("#createForm").submit(handleFormSubmission);
    $("#clearBtn").on("click", function (e) {
      e.preventDefault();
      $("#clearBtn").hide();
      $("#createBtn").removeAttr("data-id");
      $("#createBtn").html("Create");
      $("#createTitle").val("");
      $("#createContent").val("");
    });
  });
  