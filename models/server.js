const express = require('express');
const cors = require('cors');

class Server {
 
    constructor() {
        this.app = express()
        this.port = process.env.PORT || 3000;
        this.paths = {
            items: '/api/items'
        };
        this.middleware();
        this.routes();
    }

    routes() {
        this.app.use(this.paths.items,require('../routes/items'));
    }

    middleware() {
        this.app.use(cors());
        this.app.use(express.json());
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }

}

module.exports = Server;
    