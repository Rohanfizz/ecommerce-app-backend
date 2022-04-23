const dotenv = require("dotenv");
const mongoose = require("mongoose");

const app = require("./app");
dotenv.config({ path: "./config.env" });

const DB = (
    process.env.NODE_ENV === "development"
        ? process.env.DATABASE_DEV
        : process.env.DATABASE_PROD
).replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
    // useNewUrlparser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
}).then(con=>{
    // console.log(con.connections);
    console.log('DB CONNECTION SUCCESSFUL💞')
});

const port = process.env.PORT || 5501;

const server = app.listen(port, () => {
    console.log(`App running on port ${port} ✔️`);
});
