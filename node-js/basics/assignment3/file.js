import fs from "fs/promises";


// Using Promise 
console.log("Start Async");
const myPromise = new Promise((resolve,reject) => {
    fs.readFile("test.txt", "utf-8", (err, data) => {
        if (err) {
            reject(err);
            return;
        }
        resolve(data);
    });
})
myPromise
    .then((message) => console.log(message))
    .catch((error) => console.log(error));
console.log("End Async");

// Using Async Await
async function fetchData() {
    try {
        console.log("Fetching data...");
        const data = await fs.readFile("test.txt", "utf-8"); // Directly await readFile
        console.log("Data received! ✅");
        console.log(data);
    } catch (error) {
        console.error("Error reading file:", error);
    }
}
fetchData()