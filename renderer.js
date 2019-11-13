const { remote, ipcRenderer } = require('electron');

const mainProcess = remote.require('./main.js'); //this import everything form main.js
const currentWindow = remote.getCurrentWindow();

const path = require('path');

const marked = require('marked');

const markdownView = document.querySelector('#markdown');
const htmlView = document.querySelector('#html');
const newFileButton = document.querySelector('#new-file');
const openFileButton = document.querySelector('#open-file');
const saveMarkdownButton = document.querySelector('#save-markdown');
const revertButton = document.querySelector('#revert');
const saveHtmlButton = document.querySelector('#save-html');
const showFileButton = document.querySelector('#show-file');
const openInDefaultButton = document.querySelector('#open-in-default');


/**Takes a markdown and sanitize it then we assign it to the htmlView */
const renderMarkdownToHtml = (markdown) => {
    htmlView.innerHTML = marked(markdown, { sanitize: true });
};

markdownView.addEventListener('keyup', (event) => {
    const currentContent = event.target.value;
    renderMarkdownToHtml(currentContent);
    updateUserInterface(currentContent !== originalContent);
});

newFileButton.addEventListener('click', () => {
    mainProcess.createWindow();
});

saveMarkdownButton.addEventListener('click', () => {
    mainProcess.saveMarkdown(currentWindow, filePath, markdownView.value);
});

saveHtmlButton.addEventListener('click', () => {
    mainProcess.saveHtml(currentWindow, htmlView.innerHTML);
});

//on click fire the getFileFromUser that is in the mainprocess
openFileButton.addEventListener('click', () => {
    mainProcess.getFileFromUser(currentWindow);
});

ipcRenderer.on('file-opened', (event, file, content) => {
    filePath = file;
    originalContent = content;

    markdownView.value = content;

    renderMarkdownToHtml(content);
    updateUserInterface(false); //update userinterface with the file name
});

const updateUserInterface = (isEdited) => {
    let title = 'SlycreatorApp';

    if (filePath) { title = `${path.basename(filePath)} - ${title}`; }
    if (isEdited) { title = `${title} (Edited)`; }

    currentWindow.setTitle(title);
    currentWindow.setDocumentEdited(isEdited);

    saveMarkdownButton.disabled = !isEdited;
    revertButton.disabled = !isEdited;
};
