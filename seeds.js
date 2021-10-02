const mongoose = require("mongoose");
const Guest = require("./models/guest")
const Gift = require("./models/gifts")
const Question = require("./models/questions")

mongoose.connect("mongodb://localhost:27017/wedding-site", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const names = ["Matthew", "Mark", "Luke", "John", "Peter", "Paul", "Mary", "Titus", "Philemon", "Onesimus", "Timothy", "Chloe", "Phoebe", "Apollos", "Anna", "James", "Jude", "Benjamin"];
const attending = ["yes", "no", "unknown"];
const admin = [true, false];

let randomNum = Math.floor(Math.random()*names.length);
const seedDB = async () => {
    await Guest.deleteMany({});
    await Gift.deleteMany({});
    await Question.deleteMany({});
    for(let i=0; i <17; i++){
        const randomThree = Math.floor(Math.random()*4)+2;
        const randomTwo = Math.floor(Math.random()*4)+2;
        const guest = new Guest({
                    username: names[i],
                    attending: attending[randomThree],
                    isAdmin: admin[randomThree],
        });
        Guest.register(guest, "password")
        await guest.save();
    };
};

// seedDB().then(() => {
//     mongoose.connection.close()
// });

