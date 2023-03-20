const apiKey = "K89915586188957";
const fileInput = document.getElementById("fileInput");
const extractBtn = document.getElementById("extractBtn");
const uploadedImage = document.getElementById("uploadedImage");
const extractedText = document.getElementById("extractedText");
const resetBtn = document.getElementById("resetBtn");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");

extractBtn.addEventListener("click", () => {
  if (fileInput.files.length === 0) {
    errorMessage.innerHTML = "Please select an image";
    errorMessage.style.color = "red";
  } else if (fileInput.files[0].size > 1000000) {
    errorMessage.innerHTML = "File size should be less than 1MB";
    errorMessage.style.color = "red";
  } else if (!['pdf', 'png', 'jpeg', 'jpg'].includes(fileInput.files[0].type.split('/')[1])) {
    errorMessage.innerHTML = "Unsupported image format. Please upload a pdf, png, jpeg, or jpg file.";
    errorMessage.style.color = "red";
  } else {
    loading.style.display = "block";
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("apikey", apiKey);
    formData.append("file", file);
    formData.append("OCREngine", "2");
    fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      body: formData
    })
    .then(response => response.json())
    .then(result => {
      if (result.IsErroredOnProcessing) {
        alert("Error processing image. Please try again.");
        loading.style.display = "none";
      } else {
        uploadedImage.src = URL.createObjectURL(file);
        extractedText.value = result.ParsedResults[0].ParsedText;
        loading.style.display = "none";
        errorMessage.innerHTML = "";
      }
    })
    .catch(error => {
      alert("Error processing image. Please try again.");
      loading.style.display = "none";
      const errorText = document.createElement("p");
      errorText.textContent = "Error: " + error.message;
      errorText.style.color = "red";
      extractBtn.parentNode.appendChild(errorText);
      });
      }
      });

      