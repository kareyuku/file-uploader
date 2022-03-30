# Sample File Uploader

Sample File Uploader is a website where you can upload your files.

That website is using a express.js for backend and mongodb as database.

## How to run
To run that site you need to have installed [nodejs](https://nodejs.org/en/) and then install npm modules by using command npm install
```bash
cmd ./src
npm install
node index.js
```

## URL
```
localhost:3000                    # Index Page with upload file option
localhost:3000/files/:id          # File Page where you can see file name and download a file
localhost:3000/api/v1/file/:id    # API Which sending requsted file to client
localhost:3000/api/v1/upload      # API Which saving uploaded file to server
```

## Libraries
This source is using [express.js](https://github.com/expressjs/express), [express-fileupload](https://github.com/richardgirges/express-fileupload), [mongoose](https://github.com/Automattic/mongoose), [hbs](https://github.com/pillarjs/hbs), [shortid](https://github.com/dylang/shortid)

## License
[MIT](https://choosealicense.com/licenses/mit/)