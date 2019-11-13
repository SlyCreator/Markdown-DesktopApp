    case 1 //a callback funcntion
then(result => {
    const filepath = result.filePaths
    console.log(filepath)//'/home/slycreator/Desktop/node.txt'
    const filename = path.basename(filepath);
    console.log(filename)//TypeError [ERR_INVALID_ARG_TYPE]: The "path" argument must be of type string. Received type object

}).catch(err => {
    console.log(err)
});

    case 2
const filepath = '/home/slycreator/Desktop/node.txt'
console.log(filepath) //home/slycreator/Desktop/node.txt
const filename = path.basename(filepath);
console.log(filename) //node.txt