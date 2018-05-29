var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
  lineNumbers: true,
  styleActiveLine: true,
  matchBrackets: true
});

function readFile(evt) {
  var file = document.getElementById('file').files[0];
}