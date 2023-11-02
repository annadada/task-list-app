// Get references to HTML elements
const inputTextBox = document.getElementById("input-text-box");
const listContainer = document.getElementById("list-container");
const addButton = document.querySelector("button");
const countValue = document.querySelector(".count-value");
const pendingTasks = document.getElementById("pending-tasks");

// Initialize task counters
let taskCount = 0;
let checkedTaskCount = 0;

// Function to add a new task
function addTask() {
    if (inputTextBox.value === '') {
        alert("You must enter a task.");
    } else {
        // Create a new list element
        let listElement = document.createElement("li");
        listContainer.appendChild(listElement);

        // Create a text element for the task description
        let textListElement = document.createElement("span");
        textListElement.textContent = inputTextBox.value;
        listElement.appendChild(textListElement);

        // Create an icon container
        let iconContainer = document.createElement("div");
        iconContainer.className = "icon-container";
        listElement.appendChild(iconContainer);

        // Create an arrow-down icon
        let arrowDownFaIcon = document.createElement("i");
        arrowDownFaIcon.className = "fa-solid fa-arrow-down";
        iconContainer.appendChild(arrowDownFaIcon);

        // Create an arrow-up icon
        let arrowUpFaIcon = document.createElement("i");
        arrowUpFaIcon.className = "fa-solid fa-arrow-up";
        iconContainer.appendChild(arrowUpFaIcon);

        // Create an edit button (icon)
        let editFaIcon = document.createElement("i");
        editFaIcon.className = "fa-solid fa-pen-to-square";
        iconContainer.appendChild(editFaIcon);

        // Create a delete button (icon)
        let deleteFaIcon = document.createElement("i");
        deleteFaIcon.className = "fa-solid fa-trash";
        iconContainer.appendChild(deleteFaIcon);

        // Add event listeners to arrow icons for task movement
        arrowUpFaIcon.addEventListener("click", moveTaskUp);
        arrowDownFaIcon.addEventListener("click", moveTaskDown);

        // Increment the task count and update the display
        taskCount++;
        updateTaskCount();

        // Save the task data
        saveData();
    }

    // Clear the input text box
    inputTextBox.value = "";
}

// Event listener for the "Add" button
addButton.addEventListener("click", addTask);

// Event listener for clicks on the task list container
listContainer.addEventListener("click", function (event) {
    const listItem = event.target.closest("li");
    const textElement = listItem.querySelector("span");

    if (event.target.classList.contains("fa-pen-to-square")) {
        // Switch to edit mode
        listItem.classList.add("editing");
        textElement.contentEditable = true;
        textElement.focus();
        event.target.classList.remove("fa-pen-to-square");
        event.target.classList.add("fa-floppy-disk");
        saveData();
    } else if (event.target.classList.contains("fa-floppy-disk")) {
        // Save changes
        listItem.classList.remove("editing");
        textElement.contentEditable = false;
        event.target.classList.remove("fa-floppy-disk");
        event.target.classList.add("fa-pen-to-square");
        saveData();
    } else if (event.target.classList.contains("fa-trash")) {
        // Remove the task
        listItem.remove();
        taskCount--;
        if (listItem.classList.contains("checked")) {
            checkedTaskCount--;
        }
        updateTaskCount();
        saveData();
    } else if (event.target.tagName === "LI") {
        // Toggle task completion status
        listItem.classList.toggle("checked");
        if (listItem.classList.contains("checked")) {
            checkedTaskCount++;
        } else {
            checkedTaskCount--;
        }
        updateTaskCount();
        saveData();
    }
});

// Function to update the task count display
function updateTaskCount() {
    countValue.textContent = taskCount - checkedTaskCount;
    let taskWord = (countValue.textContent === '1') ? 'task' : 'tasks';
    pendingTasks.innerHTML = `You have <span class="count-value">${countValue.textContent}</span> ${taskWord} to complete.`;
}

// Function to move a task up
function moveTaskUp(event) {
    const listItem = event.target.closest("li");
    const prevListItem = listItem.previousElementSibling;

    if (prevListItem) {
        listContainer.insertBefore(listItem, prevListItem);
        saveData();
    }
}

// Function to move a task down
function moveTaskDown(event) {
    const listItem = event.target.closest("li");
    const nextListItem = listItem.nextElementSibling;

    if (nextListItem) {
        listContainer.insertBefore(nextListItem, listItem);
        saveData();
    }
}

// Function to save task data to local storage
function saveData() {
    const data = {
        taskCount,
        checkedTaskCount,
        listHtml: listContainer.innerHTML
    };
    localStorage.setItem("appData", JSON.stringify(data));
}

// Function to load and display saved tasks
function showTask() {
    const data = JSON.parse(localStorage.getItem("appData"));
    if (data) {
        taskCount = data.taskCount || 0;
        checkedTaskCount = data.checkedTaskCount || 0;
        listContainer.innerHTML = data.listHtml || "";
        updateTaskCount();

        // Attach event listeners to the arrow icons for all tasks
        const arrowUpIcons = document.querySelectorAll(".fa-arrow-up");
        const arrowDownIcons = document.querySelectorAll(".fa-arrow-down");

        arrowUpIcons.forEach((icon) => {
            icon.addEventListener("click", moveTaskUp);
        });

        arrowDownIcons.forEach((icon) => {
            icon.addEventListener("click", moveTaskDown);
        });
    }
}

showTask();

// Function to clear all tasks and local storage
function clearData() {
    localStorage.removeItem("appData");
    taskCount = 0;
    checkedTaskCount = 0;
    listContainer.innerHTML = "";
    updateTaskCount();
}

// You can call this function to clear all tasks and data from local storage
// clearData();