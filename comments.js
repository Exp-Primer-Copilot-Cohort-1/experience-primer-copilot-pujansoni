const http = require('http');
const fs = require('fs');

// Create web server
// Create a web server that listens on port 3000. When you visit the root URL, it should display a list of comments from the comments.json file. If you visit /post, it should display a form that submits a POST request to /post. When you submit a comment, it should be added to the list of comments.
function createServer() {
    const server = http.createServer((req, res) => {
        if (req.url === '/') {
            // Read comments from comments.json file
            fs.readFile('/workspaces/experience-primer-copilot-pujansoni/comments.json', 'utf8', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                    return;
                }

                const comments = JSON.parse(data);

                // Display list of comments
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write('<h1>Comments</h1>');
                res.write('<ul>');
                comments.forEach(comment => {
                    res.write(`<li>${comment}</li>`);
                });
                res.write('</ul>');
                res.end();
            });
        } else if (req.url === '/post') {
            // Display form to submit a comment
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write('<h1>Post a Comment</h1>');
            res.write('<form method="POST" action="/post">');
            res.write('<input type="text" name="comment" placeholder="Enter your comment" required>');
            res.write('<button type="submit">Submit</button>');
            res.write('</form>');
            res.end();
        } else if (req.method === 'POST' && req.url === '/post') {
            let body = '';

            req.on('data', chunk => {
                body += chunk;
            });

            req.on('end', () => {
                // Add comment to the list of comments
                const comment = decodeURIComponent(body.split('=')[1]);
                fs.readFile('/workspaces/experience-primer-copilot-pujansoni/comments.json', 'utf8', (err, data) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Internal Server Error');
                        return;
                    }

                    const comments = JSON.parse(data);
                    comments.push(comment);

                    // Save updated comments to comments.json file
                    fs.writeFile('/workspaces/experience-primer-copilot-pujansoni/comments.json', JSON.stringify(comments), 'utf8', (err) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'text/plain' });
                            res.end('Internal Server Error');
                            return;
                        }

                        // Redirect to root URL after adding comment
                        res.writeHead(302, { 'Location': '/' });
                        res.end();
                    });
                });
            });
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
    });

    server.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}