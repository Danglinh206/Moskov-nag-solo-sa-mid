document.getElementById('fileInput').addEventListener('change', function() {
    const fileInput = this;
    const fileNameDisplay = document.getElementById('fileName');
    const label = fileInput.nextElementSibling; 

    if (fileInput.files.length > 0) {
        label.textContent = fileInput.files[0].name;
    } else {
        label.textContent = 'Choose file';
    }

    fileNameDisplay.textContent = `Selected File: ${fileInput.files[0].name}`;
});

document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const uploadButton = document.getElementById('uploadButton');
    const loader = document.getElementById('loader');
    const resultDiv = document.getElementById('result');
    const uploadInfoDiv = document.getElementById('uploadInfo');
    const fileNameDisplay = document.getElementById('fileName');
    const fileLinkDisplay = document.getElementById('fileLink');
    const copyLinkButton = document.getElementById('copyLinkButton');

    uploadButton.disabled = true;
    loader.classList.remove('d-none');
    resultDiv.innerHTML = '';
    uploadInfoDiv.classList.add('d-none');

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        const data = await response.text();
        const webViewLink = data.trim();
        fileNameDisplay.textContent = `Uploaded File: ${file.name}`;
        fileLinkDisplay.textContent = webViewLink;
        fileLinkDisplay.setAttribute('href', webViewLink);
        uploadInfoDiv.classList.remove('d-none');
    } catch (error) {
        resultDiv.innerHTML = `<div class="alert alert-danger" role="alert">
            Error uploading file: ${error.message}
        </div>`;
    } finally {
        uploadButton.disabled = false;
        loader.classList.add('d-none');
        fileInput.value = ''; // Clear the file input
        document.getElementById('fileInput').nextElementSibling.textContent = 'Choose file'; 
    }

    copyLinkButton.addEventListener('click', () => {
        const tempInput = document.createElement('input');
        tempInput.style.position = 'absolute';
        tempInput.style.left = '-9999px';
        tempInput.value = fileLinkDisplay.textContent;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        alert('Link copied to clipboard!');
    });
});
