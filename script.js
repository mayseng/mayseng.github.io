const output = document.getElementById("output");
const input = document.getElementById("command-input");

// Print to terminal
function printLine(text) {
  output.textContent += text + "\n";
  output.scrollTop = output.scrollHeight;
}

async function handleCommand(cmd) {
  switch(cmd.toLowerCase()) {
    case "help":
      printLine("Commands: help, hello, clear, ask <question>");
      break;

    case "hello":
      printLine("Hello user. Connected to AI system.");
      break;

    case "clear":
      output.textContent = "";
      break;

    default:
      if (cmd.startsWith("ask ")) {
        const question = cmd.slice(4);
        await askAI(question);
      } else {
        printLine("Unknown command. Type 'help'.");
      }
  }
}

async function askAI(question) {
  printLine("You asked: " + question);
  printLine("AI> (thinking...)");

  try {
    const res = await fetch("https://your-vercel-app.vercel.app/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });

    const data = await res.json();
    output.textContent = output.textContent.replace("(thinking...)", data.answer);
  } catch (err) {
    printLine("AI> Error: " + err.message);
  }
}

input.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const cmd = input.value.trim();
    if (cmd !== "") {
      printLine("> " + cmd);
      handleCommand(cmd);
    }
    input.value = "";
  }
});

printLine("Welcome to AI Terminal. Type 'help' for commands.");
