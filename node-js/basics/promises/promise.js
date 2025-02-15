const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        let success = true;
        if (success) {
            resolve("Promise Resolved! 🎉");
        } else {
            reject("Promise Rejected! ❌");
        }
    }, 2000);
});

myPromise
.then((message) => console.log(message))
.catch((error) => console.log(error));
console.log(myPromise);
