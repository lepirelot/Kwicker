import image from "../../utils/image";

const html = `
  <form>
    <input type="file" name="" id="fileId">
    <input type="submit">
  </form>
`;
const test = () => {
  const page = document.querySelector("#page");
  page.innerHTML = html;
  const fileId = document.querySelector("#fileId")
  fileId.addEventListener("change", (e) => {
    image.imageUploaded();
  });
}

export default test;