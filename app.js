var path = require('path');
var fs = require('fs');

window.ondragover = window.ondrop = function(e) { e.preventDefault(); return false; }

var el = document.querySelector('#drop');
el.ondragover = function() {
    this.className = "hover";
    this.innerHTML = "Drop the files";
    return false;
}

el.ondragleave = function() {
    this.className = "";
    this.innerHTML = "Drop your files here";
    return false;
}

el.ondrop = function(e) {
    e.preventDefault();
    for (var i = 0; i < e.dataTransfer.files.length; i++) {
        var file = e.dataTransfer.files[i].path;
        var dir = path.parse(file).dir;
        var name = path.parse(file).name;
        var ext = path.parse(file).ext;
        // Enleve [Cpasbien]
        name = name.replace(/\[.+?\]\s?/, "");
        if (!/\(([0-9]{4})\)/.test(name)) {
            // Recup l'annee
            /([0-9]{4})/.exec(name);
            var year = RegExp.$1;
            name = name.replace(/[0-9]{4}/, "");
        } else {
            var year = null;
        }
        // Enleve la fin
        name = name.replace(/\.?(?:TRUEFRENCH|FRENCH).+$/, "");
        // Enleve les points
        name = name.replace(/\./g, " ");
        // Met les majuscules
        if (/^[a-z]/.test(name) || /\s[a-z]/.test(name)) {
            name = name.replace(/^[a-z]/, function(c){return c.toUpperCase();});
            name = name.replace(/\s[a-z]/, function(c){return c.toUpperCase();});
        }
        if (year) {
            var nameout = name + '(' + year + ')';
        } else {
            var nameout = name;
        }
        if (confirm("It's okay ? \n" + nameout)) {
            var fileout = dir + path.sep + nameout + ext;
        } else {
            nameout = prompt("Please enter the new name", nameout);
            if (nameout === null) {
                nameout = path.parse(file).name;
            };
            var fileout = dir + path.sep + nameout + ext;
        }
         // Rename
         fs.rename(file, fileout, function(err) {
             if (err) throw err;
             console.log('Renamed !');
        });
    };
    this.className = "";
    this.innerHTML = "Finished !!!";
    window.close();
    return false;
}

var but = document.querySelector('#close');

but.onclick = function(e) {
    e.preventDefault();
    window.close();
}
