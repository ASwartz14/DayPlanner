// set the date at the top of the page
let today = moment();
$("#currentDay").text(today.format("MMMM Do YYYY, h:mm a"));

// make jobs object.
let jobs = {
    "8": [],
    "9": [],
    "10": [],
    "11": [],
    "12": [],
    "13": [],
    "14": [],
    "15": [],
    "16": [],
    "17": [],
};
// createJobs func to create job in corresponding row
function createJobs(taskText, hourDiv) {
    let taskDiv = hourDiv.find(".task");
    let taskP = $("<p>")
        .addClass("description")
        .text(taskText)
    taskDiv.html(taskP);
}
// updateJobs func to update color of row to reflect past, present, future.
function updateJobs() {
  for (i = 1; i < 11; i++) {
    let updateTense = ".task" + i;
    let currentHour = moment().hour();
    $(".task-info").each( function() {
        let elementHour = parseInt($(this).attr("id"));

        if ( elementHour < currentHour ) {
            $(this).removeClass(["present", "future"]).addClass("past");
        }
        else if ( elementHour === currentHour ) {
            $(this).removeClass(["past", "future"]).addClass("present");
        }
        else {
            $(this).removeClass(["past", "present"]).addClass("future");
        }
    })
  } 
};
// getJobs func to load and create jobs in row
function getJobs() {
    let loadedTasks = JSON.parse(localStorage.getItem("jobs"));
    if (loadedTasks) {
        jobs = loadedTasks

        $.each(jobs, function(hour, task) {
            let hourDiv = $("#" + hour);
            createJobs(task, hourDiv);
        })
    }

    // make sure the past/current/future time is reflected
    updateJobs()
}
// setJobs func to add to local Storage
function setJobs() {
    localStorage.setItem("jobs", JSON.stringify(jobs));
}


//  replaceP func to make text entry a p element and persist data 

function replaceP (textareaElement) {
  
    let taskInfo = textareaElement.closest(".task-info");
    let textArea = taskInfo.find("textarea");
    let time = taskInfo.attr("id");
    let text = textArea.val().trim();

    jobs[time] = [text];
    setJobs();
    createJobs(text, taskInfo);
}

//CLICK HANDLERS 
$(".task").click(function() {
    $("textarea").each(function() {
        replaceP($(this));
    })

    let time = $(this).closest(".task-info").attr("id");
    if (parseInt(time) >= moment().hour()) {

        let text = $(this).text();
        let textInput = $("<textarea>")
            .addClass("form-control")
            .val(text);
        $(this).html(textInput);
        textInput.trigger("focus");
    }
})

// save button click handler
$(".saveBtn").click(function() {
    replaceP($(this));
})
// clear button click
$("#clear-button").on("click", function() {
    localStorage.removeItem("jobs");
    location.reload();
  });
getJobs();