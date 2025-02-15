function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchData() {
    console.log("Fetching data...");
    await delay(2000); // Wait for 2 seconds
    console.log("Data received! ✅");
}

fetchData();
