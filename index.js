const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const user_service = require('./users/userService');
const emailRegex = /^\S+@\S+\.\S+$/g

app.get('/users', async(req, res) => {
    try {
        const users = await user_service.reader();
        res.json(users);
    } catch (e) {
        res.status(500).json(e.message);
    }
});

app.post('/users', async (req, res) => {
    try {
        const {name, email, password} = req.body;
        const users = await user_service.reader();

        if(!name){
            res.status(404).json("User name cannot be empty!");
        }else if (name.type !== "string"){
            res.status(404).json("User name must be string!");
        }else if (name.length < 3) {
            res.status(404).json("User name must be at least 3 characters long!");
        }else if (name.length > 20) {
            res.status(404).json("User name is too long!");
        }

        if (!email){
            res.status(404).json("Email cannot be empty");
        } else if (users.includes(email)) {
            res.status(404).json("Oops, looks like this email is already used!");
        } else if (!email.match(emailRegex)) {
            res.status(404).json("Email must match pattern: example@gmail.com");
        }

        if (!password){
            res.status(404).json("Password cannot be empty");
        } else if (password.length < 6) {
            res.status(404).json("Password must be at least 6 characters long!");
        } else if (password.length > 12) {
            res.status(404).json("Password is too long");
        }

        const id = users[users.length - 1].id + 1;
        const newUser = {id, name, email, password};
        users.push(newUser);
        await user_service.writer(users);
        res.status(201).json(newUser);
    } catch (e) {
        res.status(500).json(e.message);
    }
});

app.get('/users/:userId', async(req, res) => {
    try {
        const {userId} = Number(req.params)
        const users = await user_service.reader();
        const user = users.find(user => user.id === userId);

        if (!user) {
            return res.status(404).json('User not found');
        }
        res.json(user);
    } catch (e) {
        res.status(500).json(e.message);
    }
});

app.put('/users/:userId', async(req, res) => {
    try {
        const {userId} = Number(req.params);
        const {name, email, password} = req.body;

        const users = await user_service.reader();
        const userIndex = users.findIndex(user => user.id === userId);

        if (userIndex === -1) {
            return res.status(404).json('User not found');
        }

        if(!name){
            res.status(404).send("User name cannot be empty!");
        }else if (name.type !== "string"){
            res.status(404).send("User name must be string!");
        } else if (name.length < 3) {
            res.status(404).send("User name must be at least 3 characters long!");
        } else if (name.length > 20) {
            res.status(404).send("User name is too long!");
        }

        if (!email){
            res.status(404).send("Email cannot be empty");
        } else if (users.includes(email)) {
            res.status(404).send("Oops, looks like this email is already used");
        } else if (!email.match(emailRegex)) {
            res.status(404).send("Email must match pattern: example@gmail.com");
        }

        if (!password){
            res.status(404).send("Password cannot be empty");
        } else if (password.length < 6) {
            res.status(404).send("Password must be at least 6 characters long!");
        } else if (password.length > 12) {
            res.status(404).send("Password is too long");
        }

        users[userIndex] = {...users[userIndex], ...req.body};
        // users[userIndex].name = name;
        // users[userIndex].email = email;
        // users[userIndex].password = password;
        await user_service.writer(users);
        res.status(201).json(users[userIndex]);
    } catch (e) {
        res.status(500).json(e.message);
    }
});

app.delete('/users/:userId', async(req, res) => {
    try {
        const {userId} = Number(req.params);
        const users = await user_service.reader();

        const userIndex = users.findIndex(user => user.id === userId);
        if (userIndex === -1) {
            return res.status(404).json('User not found');
        }
        users.splice(userIndex, 1);
        await user_service.writer(users);

        res.sendStatus(204);
    } catch (e) {
        res.status(500).json(e.message);
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});