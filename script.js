// Get references to HTML elements
const inputTextBox = document.querySelector("#input-text-box");
const listContainer = document.querySelector("#list-container");
const addButton = document.querySelector("button");
const countValue = document.querySelector(".count-value");
const pendingTasks = document.querySelector("#pending-tasks");

// Initialize task counters
let taskCount = 0;
let checkedTaskCount = 0;

// Function to create an icon element
function createIcon(className) {
    let icon = document.createElement("i");
    icon.className = `fa-solid ${className}`;
    return icon;
}

// Function to create an HTML element
function createElement(tag, className) {
    let element = document.createElement(tag);
    if (className) {
        element.className = className;
    }
    return element;
}

// Function to create a task element
function createTaskElement(description) {
    const listElement = createElement("li");

    const textListElement = createElement("span");
    textListElement.textContent = description;
    listElement.appendChild(textListElement);

    const iconContainer = createElement("div", "icon-container");
    listElement.appendChild(iconContainer);

    const arrowDownFaIcon = createIcon("fa-arrow-down");
    const arrowUpFaIcon = createIcon("fa-arrow-up");
    const editFaIcon = createIcon("fa-pen-to-square");
    const deleteFaIcon = createIcon("fa-trash");

    iconContainer.append(arrowDownFaIcon, arrowUpFaIcon, editFaIcon, deleteFaIcon);

    arrowUpFaIcon.addEventListener("click", moveTaskUp);
    arrowDownFaIcon.addEventListener("click", moveTaskDown);

    return listElement;
}


// Function to add a new task
function addTask() {
    if (inputTextBox.value === '') {
        alert("You must enter a task.");
    } else {
        // Create a new task element
        const listElement = createTaskElement(inputTextBox.value);
        listContainer.appendChild(listElement);

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
    const target = event.target;
    const listItem = target.closest("li");
    const textElement = listItem.querySelector("span");

    if (target.classList.contains("fa-pen-to-square")) {
        // Switch to edit mode
        listItem.classList.add("editing");
        textElement.contentEditable = true;
        textElement.focus();
        target.classList.remove("fa-pen-to-square");
        target.classList.add("fa-floppy-disk");
        saveData();
    } else if (target.classList.contains("fa-floppy-disk")) {
        // Save changes
        listItem.classList.remove("editing");
        textElement.contentEditable = false;
        target.classList.remove("fa-floppy-disk");
        target.classList.add("fa-pen-to-square");
        saveData();
    } else if (target.classList.contains("fa-trash")) {
        // Remove the task
        listItem.remove();
        taskCount--;

        if (listItem.classList.contains("checked")) {
            checkedTaskCount--;
        }

        // Update the task count display and save data
        updateTaskCount();
        saveData();
    } else if (target.tagName === "LI") {
        // Toggle task completion status
        listItem.classList.toggle("checked");

        if (listItem.classList.contains("checked")) {
            checkedTaskCount++;
        } else {
            checkedTaskCount--;
        }

        // Update the task count display and save data
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

// Call the function to load tasks and data on page load
showTask();

// Function to clear all tasks and local storage data
function clearData() {
    localStorage.removeItem("appData");
    taskCount = 0;
    checkedTaskCount = 0;
    listContainer.innerHTML = "";
    updateTaskCount();
}

// You can call this function to clear all tasks and data from local storage
// clearData();