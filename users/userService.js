const fs = require ('node:fs/promises');
const path = require ('node:path');

const db_path = path.join(process.cwd(), 'Users', 'users.json');

const reader = async () => {
    const buffer = await fs.readFile(db_path);
    const data = buffer.toString()
    return data ? JSON.parse(data) : [];
};

const writer = async (users) => {
    await fs.writeFile(db_path, JSON.stringify(users));
};


module.exports = {
    reader,
    writer,
};