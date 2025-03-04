// Function to handle commands
function checkCommand(event) {
    if (event.key === "Enter") {
        let command = document.getElementById("command-input").value.trim();
        let errorMessage = document.getElementById("error-message-command");

        errorMessage.innerHTML = '';

        if (command.startsWith("school test delete")) {
            const parts = command.split(" ");
            if (parts.length < 4) {
                errorMessage.innerHTML = "ERROR: Please provide a class and date to delete.";
                return;
            }
            const className = parts[3];
            const date = parts[4];
            let tests = loadData("tests");

            let filteredTests = tests.filter(test => !(test.className === className && test.date === date));

            if (filteredTests.length === tests.length) {
                errorMessage.innerHTML = `ERROR: No test found for ${className} on ${date}.`;
            } else {
                saveData("tests", filteredTests);
                errorMessage.innerHTML = `Test for ${className} on ${date} deleted.`;
            }
        } else if (command.startsWith("school assignment delete")) {
            const parts = command.split(" ");
            if (parts.length < 4) {
                errorMessage.innerHTML = "ERROR: Please provide a class and date to delete.";
                return;
            }
            const className = parts[3];
            const dueDate = parts[4];
            let assignments = loadData("assignments");

            let filteredAssignments = assignments.filter(a => !(a.className === className && a.dueDate === dueDate));

            if (filteredAssignments.length === assignments.length) {
                errorMessage.innerHTML = `ERROR: No assignment found for ${className} due on ${dueDate}.`;
            } else {
                saveData("assignments", filteredAssignments);
                errorMessage.innerHTML = `Assignment for ${className} due on ${dueDate} deleted.`;
            }
        } else {
            errorMessage.innerHTML = "ERROR: Command not recognized.";
        }

        document.getElementById("command-input").value = "";
    }
}
