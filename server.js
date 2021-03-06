//express server
const express = require('express');
const server = express();
const fs = require('fs');
const path = require('path');
//obtain bundle
const bundle =  require('./dist/server.bundle.js');
//get renderer from vue server renderer
const renderer = require('vue-server-renderer').createRenderer({
    //set template
    template: fs.readFileSync('./index.html', 'utf-8')
});

server.use('/dist', express.static(path.join(__dirname, './dist')));

//start server
server.get('*', (req, res) => { 
    
    var context = { url: req.url }
    bundle.default(context).then((app) => {    
        renderer.renderToString(app, context, (err, html) => {   
            if (err) {
                console.log(err)
                if (err.code === 404) {
                    res.status(404).end('Page not found')
                } else {
                    res.status(500).end('Internal Server Error')
                }
            } else {
                res.end(html)
            }
          });        
    }, (err) => {
        console.log(err);
    });  
});  

server.listen(8080);
