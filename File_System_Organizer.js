
var readline = require("readline-sync");
var fs = require("fs");
var path = require("path");
var chalk = require("chalk");

var types = {
    media : ["mkv", "mp4"],
    archives : ["zip", "rar", "tar", "7z", "ar", "iso", "xz"],
    documents : ["docx", "doc", "pdf", "xlxs", "xls", "odt", "ods", "odp", " ods", "odf", "txt"],
    apps : ["exe", "pkg", "deb"]
}
console.log("Enter the Choice : ");

var input = readline.question();

if(input == "Organize" || input == "organize"){
    console.log("Enter the source path");
    var src = String(readline.question());
    Organize(src);
}else if(input == "Help" || input == "help"){
    Help();
}else if(input == "Tree" || input == "tree"){
    console.log("Enter Source Path");
    var src = readline.question();
    tree(src);
}else{
    console.log("❌Enter valid choice❌");
}

//call Help
function Help(){
    //display all commands available
    var choice = ["1.Help", "2.Organize", "3.Tree"]
    for(var i in choice){
        console.log(choice[i]);
    }
    return;
}


function Organize(src){
    if(src == undefined){
        organizeHelper(process.cwd());
        return;
    }
    if(fs.existsSync(src)){
        organizeHelper(src);
    }else{
        console.log("❌Path given is not defined.❌");
    }
    return;
}
function getCategory(src, filename){
    var ext = path.extname(filename);
    ext = ext.slice(1);       
    for(var i in types){
        var tmp = types[i];
        for(var j in tmp){
            if(tmp[j] == ext) return i;
        }
    }
    return "others";
}

//helper
function organizeHelper(src){
    //make a directory containing folders of diff files.
    var dirPath = path.join(src,"ORGANIZED FOLDER");
    if(fs.existsSync(dirPath) == false){
        fs.mkdirSync(dirPath);
    }
    var filesAtSource = fs.readdirSync(src);
    for(var i in filesAtSource){
        var srcfilepath = path.join(src,filesAtSource[i]);
        var dest = path.join(dirPath, filesAtSource[i]);
        var check = fs.lstatSync(srcfilepath);
        if(check.isFile()){
            //get category name
            var category = getCategory(src, filesAtSource[i]);
            var enddir = path.join(dirPath, category);
            if(fs.existsSync(enddir) == false) fs.mkdirSync(enddir);
            fs.copyFileSync(srcfilepath,path.join(enddir,filesAtSource[i]));
        }
    }
    return;
}

//tree
function treeHelper(src, indent){
    if(fs.lstatSync(src).isFile()){
        console.log(indent + "|---" + path.basename(src));
        return;
    }else{
        var children = fs.readdirSync(src);
        console.log(indent+"|___"+path.basename(src));
        for(var i = 0; i < children.length; i++){
            var tmp = path.join(src,children[i]);
            treeHelper(tmp, indent+"\t");
        }
    }
}
function tree(src){
    if(src.length == 0){
        treeHelper(__dirname,"");
        return;
    }
    if(fs.existsSync(src)){
        treeHelper(src,"");
    }
    return;
}