const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');

const windows = new Set();

app.on('ready', () => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform === 'darwin') {
        return false;
    }
});

app.on('activate', (event, hasVisibleWindows) => {
    if (!hasVisibleWindows) { createWindow(); }
});

app.on('will-finish-launching', () => {
    app.on('open-file', (event, file) => {
        const win = createWindow();
        win.once('ready-to-show', () => {
            openFile(win, file)
        })
    })
});

const createWindow = exports.createWindow = () => {
    let x, y;

    const currentWindow = BrowserWindow.getFocusedWindow();

    if (currentWindow) {
        const [currentWindowX, currentWindowY] = currentWindow.getPosition();
        x = currentWindowX + 10;
        y = currentWindowY + 10;
    }

    let newWindow = new BrowserWindow({
        x, y,
        show: false,
        webPreferences: {
            nodeIntegration: true,
        }
    });

    newWindow.loadFile('index.html');

    newWindow.once('ready-to-show', () => {
        newWindow.show();
    });

    newWindow.on('closed', () => {
        windows.delete(newWindow);
        newWindow = null;
    });

    windows.add(newWindow);
    return newWindow;
};

const getFileFromUser = exports.getFileFromUser = (targetWindow) => {
    dialog.showOpenDialog(targetWindow, {
        properties: ['openFile'],
        filters: [
            { name: 'Text Files', extensions: ['txt', 'text'] },
            { name: 'Markdown Files', extensions: ['md', 'markdown'] }
        ]
    }).then(result => {
        const fileDir = result.filePaths;
        openFile(targetWindow, `${fileDir}`);
    }).catch(err => {
        return;
        console.log(err)
    });

};

const openFile = exports.openFile = (targetWindow, file) => {
    const content = fs.readFileSync(file).toString();//
    app.addRecentDocument(file);
    targetWindow.setRepresentedFilename(file);//
    targetWindow.webContents.send('file-opened', file, content);
};

const saveHtml = exports.saveHtml = (targetWindow, content) => {
    dialog.showSaveDialog(targetWindow, {
        title: 'Save HTML',
        defaultPath: app.getPath('documents'),
        filters: [
            { name: 'HTML Files', extensions: ['html', 'html'] }
        ]
    }).then(result => {
        const fileDir = result.filePath
        fs.writeFileSync(`${fileDir}`, `${content}`);
    }).catch(err => {
        return;
        //console.log(err.canceled)
    });
}
