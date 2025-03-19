document.addEventListener("DOMContentLoaded", () => {
    const output = document.getElementById("output");
    const input = document.getElementById("commandInput");

    input.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            processCommand(input.value);
            input.value = "";
        }
    });

    function processCommand(command) {
        let response;
        switch (command.toLowerCase()) {
            case "help":
                response = "Available commands: HELP, LOGIN, CLEAR, TRACE";
                break;
            case "login":
                response = "Accessing secure server... Authentication required.";
                break;
            case "clear":
                output.innerHTML = "";
                return;
            case "trace":
                response = "Tracing IP... Connection secured through multiple relays.";
                break;
            default:
                response = "Unknown command. Type HELP for a list of commands.";
        }
        appendOutput(response);
    }

    function appendOutput(text) {
        const newLine = document.createElement("div");
        newLine.textContent = text;
        output.appendChild(newLine);
        output.scrollTop = output.scrollHeight;
    }
});
