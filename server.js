const http=require('http');
const url=require('url');
const fs=require('fs');
const path=require('path');

const port=process.argv[2] || 8000;


const fileType={
    '.icon': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpeg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'imnage/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.eot': 'application/vnd.ms-fontobject',
    '.ttf': 'application/font-sfnt'
}

// console.log('fileType: ', fileType);

http.createServer(function (req,res){
    console.log('request method and url: ', req.method, req.url);
    const parsedUrl=url.parse(req.url);
    const sanitizePath=path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/, '');
    let pathName=path.join(__dirname, sanitizePath);

    fs.exists(pathName, function (exist){
        if(!exist){
            //respond 404
            res.statusCode=404;
            res.end(`File${pathName} not found`);

            return 
        }
        //if is a directory 
        if(fs.statSync(pathName).isDirectory())pathName+='/index.html';
        //read file 
        fs.readFile(pathName,function (err,data){
            if(err){
                res.statusCode=500;
                res.end(`Error getting the file`);
                console.log('error getting file: ', err);
                
            }else{
                //base on file extension, extract data from file
                let ext=path.parse(pathName).ext;
                res.setHeader('Content-type', fileType[ext] || 'text/html');
                res.end(data);
            }
        })
    })
}).listen(parseInt(port));

console.log(`Server is listening on port ${port}`);
