var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
  lineNumbers: true,
  styleActiveLine: true,
  matchBrackets: true
});

var data = [];
var bytes;
var outArray;
var blob;







function readFile(evt) {
  var file = document.getElementById('file').files[0];
  var reader = new FileReader();
  data = reader.readAsArrayBuffer(file);
  reader.onload = dataLoaded;
}

function dataLoaded(evt) {
  data = evt.target.result;
  bytes = new Uint8Array(data);

  var methodBegin = "<?xml version";
  var methodEnd = "</InstrumentSetupMethod>";

  var methodBeginIndex = find_csa(bytes, convertToIntArray(methodBegin));
  var methodEndIndex = find_csa(bytes, convertToIntArray(methodEnd)) + 46;

  var methodContent = "";
  for(var i=methodBeginIndex; i<=methodEndIndex; i++) {
    if(bytes[i] !== 0) {
      methodContent += String.fromCharCode(bytes[i]);
    }
  }
  editor.setValue(methodContent);
}

function exportMethod() {
  var methodBegin = "<?xml version";
  var methodEnd = "</InstrumentSetupMethod>";

  var methodBeginIndex = find_csa(bytes, convertToIntArray(methodBegin));
  var methodEndIndex = find_csa(bytes, convertToIntArray(methodEnd)) + 46;

  var methodContent = editor.getValue();

  outArray = [];
  for(var i=0; i<methodBeginIndex; i++) {
    outArray.push(bytes[i]);
  }
  var methodToInsert = convertToIntArray(methodContent);
  for(var i=0; i<methodToInsert.length; i++) {
    outArray.push(methodToInsert[i]);
  }
  for(var i=methodEndIndex+1; i<bytes.length; i++) {
    outArray.push(bytes[i]);
  }

  blob = new Blob([new Uint8Array(outArray)], {type: "application/octet-stream"});
  var objectUrl = URL.createObjectURL(blob);
  window.open(objectUrl);
}

function find_csa(arr, subarr, from_index) {
  if (typeof from_index === 'undefined') {
    from_index = 0;
  }
  
  var i, found, j;
  for (i = from_index; i < 1 + (arr.length - subarr.length); ++i) {
    found = true;
    for (j = 0; j < subarr.length; ++j) {
      if (arr[i + j] !== subarr[j]) {
        found = false;
        break;
      }
    }
    if (found) return i;
  }
  return -1;
}
  
function convertToIntArray(s) {
  var arr = [];
  for(var i=0; i<s.length; i++) {
    var code = s[i].charCodeAt(0);
    if(code==10) {
      //arr.push(code);
      //arr.push(0);
    }
    arr.push(code);
    arr.push(0);
  }
  //arr.pop();
  return arr;
}