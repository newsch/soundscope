var model = (function() {
  var URL = obj.webkitURL || obj.mozURL || obj.URL;

  return {
    getEntries : function(file, onend) {
      zip.createReader(new zip.BlobReader(file), function(zipReader) {
        zipReader.getEntries(onend);
      }, onerror);
    },
    getEntryFile : function(entry, creationMethod, onend, onprogress) {
      var writer, zipFileEntry;

      function getData() {
        entry.getData(writer, function(blob) {
          var blobURL = creationMethod == "Blob" ? URL.createObjectURL(blob) : zipFileEntry.toURL();
          onend(blobURL);
        }, onprogress);
      }

      if (creationMethod == "Blob") {
        writer = new zip.BlobWriter();
        getData();
      } else {
        createTempFile(function(fileEntry) {
          zipFileEntry = fileEntry;
          writer = new zip.FileWriter(zipFileEntry);
          getData();
        });
      }
    }
  };
})();

function createTempFile(callback) {
  var tmpFilename = "tmp.dat";
  requestFileSystem(TEMPORARY, 20 * 1024 * 1024, function(filesystem) {
    function create() {
      filesystem.root.getFile(tmpFilename, {
        create : true
      }, function(zipFile) {
        callback(zipFile);
      });
    }

    filesystem.root.getFile(tmpFilename, null, function(entry) {
      entry.remove(create, create);
    }, create);
  });

  
function populateAudio(file){
  var requestFileSystem = obj.webkitRequestFileSystem || obj.mozRequestFileSystem || obj.requestFileSystem;


	}

  var fileList = document.getElementById("file-list");

  model.getEntries(fileInput.files[0], function(entries) {
    entries.forEach(function(entry) {
      var li = document.createElement("li");
      var audio = document.createElement("audio");
      audio.src = entry.filename;
      // audio.type = "audio/ogg";

      li.appendChild(audio);
      fileList.appendChild(li);
    });
  });
}


populateAudio("/webapp/static/sounds.zip")
