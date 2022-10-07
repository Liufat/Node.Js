const http = require('http');
const fs = require('fs').promises;
const server = http.createServer(async(request, response) => {
    await fs.writeFile(__dirname + '/headers.txt', JSON.stringify(request.headers))
        .then(data => {
            console.log({ data });
            response.writeHead(200, {
                'content-type': 'text/html'
            });
            response.end(`<h2>${request.url}</h2>`);

        })


})

server.listen(3000);