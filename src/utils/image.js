// code from: https://www.geeksforgeeks.org/how-to-convert-image-into-base64-string-using-javascript/
let base64String = "";

function imageUploaded() {
  var file = document.querySelector(
      'input[type=file]')['files'][0];

  var reader = new FileReader();
  console.log("next");

  reader.onload = function () {
    base64String = reader.result.replace("data:", "")
    .replace(/^.+,/, "");
  }
  reader.readAsDataURL(file);
}

function getBase64String () {
  return base64String;
}

export default {imageUploaded, getBase64String}