const request = require('request')
const tough = require('tough-cookie');
const rp = require('request-promise');
const fs = require('fs');
const md5Hex = require('md5-hex');

var url = 'http://img.su.pe/ws.php?format=json'
var jar = request.jar();
var chunkSize = 500000;

function login() {
    console.log("logging in...")

    return new Promise(function(resolve, reject) {
        var postData = {
            method: 'pwg.session.login',
            username: process.env.PIWIGO_USERNAME,
            password: process.env.PIWIGO_PASSWORD
        }

        var options = {
            method: 'post',
            form: postData,
            url: url,
            jar: jar,
            resolveWithFullResponse: true
        }

        rp(options)
        .then(function (response) {
            //console.log(response);
            console.log(response.body)
            //console.log(response.headers['set-cookie'])
            setCookie(response.headers['set-cookie'].toString())
            console.log("login finished")
            resolve(response);
        })
        .catch(function (err) {
            reject(err);
        });
    })
}

function setCookie(cookieStr) {
    console.log('setting cookie: ' , cookieStr)
    var cookie = request.cookie(cookieStr)
    jar.setCookie(cookie)
}

function getStatus() {
    return new Promise(function(resolve, reject) {
        var postData = {
            method: 'pwg.session.getStatus'
        }

        var options = {
            method: 'post',
            form: postData,
            url: url,
            jar: jar
        }

        rp(options)
        .then(function (body) {
            console.log("getStatus:\n" + body);
            resolve(JSON.parse(body));
        })
        .catch(function (err) {
            reject(err);
        });
    })
}

function isAdmin() {
    return new Promise(function(resolve, reject) {
        getStatus()
        .then(function (response) {
            var status = response.result.status
            var isAdmin = (status == 'webmaster' || status == 'administrator');       
            console.log("isAdmin = " + isAdmin + "\n" + "status = " + status)
            resolve(isAdmin)
        })
        .catch(function (err) {
            reject(err)
        });
    })
}

// todo: this is garbage and doesn't work
function addChunks(filePath)
{
    var buffer = fs.readFileSync(filePath)
    var hash = md5Hex(buffer)
    console.log("md5hash = " + hash)

    var length = buffer.length
    console.log("length = " + length)


    var chunkCount = Math.ceil(length / chunkSize);
    console.log("chunks = " + chunkCount)

    var chunkPos = 0;
    var chunkID = 1;

    var content = buffer.toString('base64')

    while (chunkPos < length) {
        var chunk = content.substring(
            chunkPos,
            chunkSize
        );
        chunkPos += chunkSize;

        var postData = {
            method: 'pwg.images.addChunk',
            data: chunk,
            original_sum: hash,
            position: chunkID,
            type: 'file'
        }
    
        var options = {
            method: 'post',
            form: postData,
            url: url,
            jar: jar
        }

        request(options, function (err, res, body) {
            if (err) {
                console.error('addChunk error: ', err)
                throw err
            }
            var headers = res.headers
            var statusCode = res.statusCode
            console.log('addChunk headers: ', headers)
            console.log('addChunk statusCode: ', statusCode)
            console.log('addChunk body: ', body)
        })

        chunkID++;
    }
    addImage()
}

let uploadImage = function(url) {
    console.log("uploadImage: " + url)
    isAdmin()
    .then(function (isAdmin) {
        if (isAdmin) {
            console.log("uploading image")
            var filename = url.substring(url.lastIndexOf('/')+1);
            console.log('filename = ' + filename)
            request.get(url)
            .on('error', console.error)
            .pipe(fs.createWriteStream(filename))
            .on('finish', function (err) {
                console.log("downloaded file: " + filename)
                addChunks(filename)
            })
        }
        else {
            login()
            .then(function (response) {
                uploadImage(url);
            })
            .catch(function (err) {
                console.log("Error logging in.")
                reject(err)
            })
        }
    })
    .catch(function (err) {
        console.log("Unable to upload image.")
    })
}

module.exports = {
    uploadImage: function(url) {
        uploadImage(url)
    }
}