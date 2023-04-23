var readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

var fs = require("fs");
var path = require("path");

var types = {
  media: ["mkv", "mp4"],
  archives: ["zip", "rar", "tar", "7z", "ar", "iso", "xz"],
  docx: ["docx", "doc", "odt", "ods"],
  pdf: ["pdf"],
  xml: ["xlxs", "xls", "xml", "xslt"],
  txt: ["txt"],
  cpp: ["cpp"],
  java: ["java"],
  js: ["js"],
  html: ["html", "htm"],
  style: ["css"],
  apps: ["exe", "pkg", "deb"],
};
readline.question("Enter choice", (input) => {
  if (input.trim().toLowerCase() == "organize") {
    readline.question("Enter path", (src) => {
      src = src.trim();
      Organize(String(src));
      readline.close();
    });
  } else if (input.trim().toLowerCase() == "help") {
    Help();
    readline.close();
  } else if (input.trim().toLowerCase() == "tree") {
    readline.question("Enter path", (src) => {
      src = src.trim();
      console.log(src);
      tree(String(src));
      readline.close();
    });
  } else {
    console.log("❌Enter valid choice❌");
    readline.close();
  }
});
//call Help
function Help() {
  //display all commands available
  var choice = ["1.Help", "2.Organize", "3.Tree"];
  for (var i in choice) {
    console.log(choice[i]);
  }

  return;
}

function Organize(src) {
  console.log(src);
  if (src == undefined) {
    organizeHelper(process.cwd());
    return;
  }
  if (fs.existsSync(src)) {
    organizeHelper(src);
  } else {
    console.log("❌Path given is not defined.❌");
  }
  return;
}
function getCategory(src, filename) {
  var ext = path.extname(filename);
  ext = ext.slice(1);
  for (var i in types) {
    var tmp = types[i];
    for (var j in tmp) {
      if (tmp[j] == ext) return i;
    }
  }
  return "others";
}

//helper
function organizeHelper(src) {
  //make a directory containing folders of diff files.
  var dirPath = path.join(src, "ORGANIZED FOLDER");
  if (fs.existsSync(dirPath) == false) {
    fs.mkdirSync(dirPath);
  }
  var filesAtSource = fs.readdirSync(src);
  for (var i in filesAtSource) {
    console.log(filesAtSource[i]);
    var srcfilepath = path.join(src, filesAtSource[i]);
    var dest = path.join(dirPath, filesAtSource[i]);
    var check = fs.lstatSync(srcfilepath);
    if (check.isFile()) {
      //get category name
      var category = getCategory(src, filesAtSource[i]);
      var enddir = path.join(dirPath, category);
      if (fs.existsSync(enddir) == false) fs.mkdirSync(enddir);
      fs.copyFileSync(srcfilepath, path.join(enddir, filesAtSource[i]));
    }
  }
  return;
}

//tree
function treeHelper(src, indent) {
  if (fs.lstatSync(src).isFile()) {
    console.log(indent + "|---" + path.basename(src));
    return;
  } else {
    var children = fs.readdirSync(src);
    console.log(indent + "|___" + path.basename(src));
    for (var i = 0; i < children.length; i++) {
      var tmp = path.join(src, children[i]);
      treeHelper(tmp, indent + "\t");
    }
  }
}
function tree(src) {
  if (src.length == 0) {
    treeHelper(__dirname, "");
    return;
  }
  if (fs.existsSync(src)) {
    treeHelper(src, "");
  }
  return;
}
