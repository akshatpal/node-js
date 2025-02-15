import fs from "fs";

// Synchronous (because readFileSync blocks the execution of the code)
console.log("Start Sync");
const data = fs.readFileSync("test.txt", "utf-8");
console.log(data);
console.log("End Sync");

// Asynchronous (because readFile doesn't blocks the execution of the code)
console.log("Start Async");
fs.readFile("test.txt", "utf-8", (err, data) => {
    if (err) {
        console.log("Error:", err);
        return;
    }
    console.log(data);
});
console.log("End Async");

