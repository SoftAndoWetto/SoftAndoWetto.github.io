document.addEventListener("DOMContentLoaded", () => {
    let output = document.getElementById("output");
    let prompt = document.getElementById("prompt");
    let inputField = document.getElementById("input");
    let cursor = document.createElement('span');
    cursor.id = 'cursor'; // This will be the blinking cursor

    function printText(text, callback) {
        let index = 0;
        let interval = setInterval(() => {
            output.textContent += text[index];
            index++;
            if (index === text.length) {
                clearInterval(interval);
                if (callback) callback();
            }
        }, 35);
    }

    function showInitializing() {
        const initText = ["Initializing.", "Initializing..", "Initializing..."];
        let count = 0;
        let interval = setInterval(() => {
            output.textContent = initText[count];
            count = (count + 1) % initText.length;
        }, 1000);

        setTimeout(() => {
            clearInterval(interval);
            output.textContent = ''; // Clear initialization
            showWelcomeText();
        }, 4000);
    }

    function showWelcomeText() {
        printText("Welcome to Git-Boy, My interactive portfolio", () => {
            printText("\nFor a list of commands, type \"help\"", () => {
                showPrompt();
            });
        });
    }

    function showPrompt() {
        prompt.style.display = 'flex';
        prompt.appendChild(cursor);  // Add cursor element
        inputField.focus();
    }

    // Trigger the initialization sequence
    showInitializing();
});
