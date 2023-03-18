function processImage() {
    const apiKey = 'K89915586188957'; // replace with your own FREE API key from https://ocr.space/OCRAPI link in description too.
    const fileSizeLimit = 1024 * 1024; // 1MB
    const fileInput = document.getElementById('imageFile');
    const errorDiv = document.getElementById('error');
    const outputDiv = document.getElementById('output');
    const imagePreview = document.getElementById('image-preview');
    const loadingAnimation = document.getElementById('loading-animation');
    loadingAnimation.style.display = 'block';
    
    errorDiv.textContent = '';
    outputDiv.textContent = '';
    imagePreview.src = '#';
    
    if (fileInput.files)  if (fileInput.files.length === 0) {
        errorDiv.textContent = 'Please select an image file.';
        loadingAnimation.style.display = 'none';
        outputDiv.value = '';
        return;
    }

const file = fileInput.files[0];
if (file.size > fileSizeLimit) {
  errorDiv.textContent = 'File size is too big (max 1MB).';
  loadingAnimation.style.display = 'none';
  outputDiv.value = '';
  return;
}

const formData = new FormData();
formData.append('apikey', apiKey);
formData.append('language', 'eng');
formData.append('isOverlayRequired', 'false');
formData.append('file', file);

const xhr = new XMLHttpRequest();
xhr.open('POST', 'https://api.ocr.space/parse/image');
xhr.onload = function() {
  if (xhr.status === 200) {
    const response= JSON.parse(xhr.responseText);
    if (response.IsErroredOnProcessing) {
      errorDiv.textContent = 'Error processing image. Please try again later.';
    } else {
      const text = response.ParsedResults[0].ParsedText;
      outputDiv.value = text;
      imagePreview.src = URL.createObjectURL(file);
    }
  } else {
    errorDiv.textContent = 'Error processing image. Please try again later.';
  }
  loadingAnimation.style.display = 'none';
};
xhr.onerror = function() {
  errorDiv.textContent = 'Error processing image. Please try again later.';
  loadingAnimation.style.display = 'none';
};
xhr.send(formData);
}