function greet(name, callback) {
    console.log("Hello, " + name);
    callback();
}

greet("John", function() {
    console.log("Callback executed!");
});