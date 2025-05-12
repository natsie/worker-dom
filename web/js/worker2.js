import dom from "./worker-dom/worker-dom-w.js";

// Define styles for consistency and easy maintenance
const styles = {
  root: {
    padding: "20px",
    backgroundColor: "#f9f9f9",
    fontFamily: "Arial, sans-serif",
  },
  current: {
    fontSize: "32px",
    display: "block",
    textAlign: "center",
    color: "#007bff",
  },
  log: {
    marginTop: "20px",
    border: "1px solid #ccc",
    padding: "10px",
    backgroundColor: "#fff",
    maxHeight: "200px",
    overflowY: "auto",
  },
  logEntry: {
    margin: "5px 0",
    color: "#333",
  },
};

async function init() {
  const rootRef = 0; // Root reference as per WorkerDOM convention
  const currentRef = (await dom.create("strong"))[0];
  const logRef = (await dom.create("div"))[0];

  // Append elements to the root
  await dom.appendChild(rootRef, currentRef);
  await dom.appendChild(rootRef, logRef);

  // Apply styles to root, current number, and log
  await dom.setStyle(rootRef, styles.root);
  await dom.setStyle(currentRef, styles.current);
  await dom.setStyle(logRef, styles.log);

  async function generateNumber() {
    const min = 1000;
    const max = 10000;
    const num = Math.floor(Math.random() * (max - min + 1)) + min;

    // Update current number display
    await dom.textContent(currentRef, num.toString());

    // Create and style a new log entry
    const pRef = (await dom.create("p"))[0];
    await dom.textContent(pRef, num.toString());
    await dom.setStyle(pRef, styles.logEntry);
    await dom.appendChild(logRef, pRef);

    // Schedule the next number generation
    setTimeout(generateNumber, 500);
  }

  // Start generating numbers
  generateNumber();
}

init();
