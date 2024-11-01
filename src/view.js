const { app, BrowserWindow } = require('electron');
const path = require('node:path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration:true,
      contextIsolation:false,
    },
  });
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

  

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
async function loadCountry() {
    const pathName = path.join(__dirname, 'Files');
    if (!fs.existsSync(pathName)) {
        fs.mkdirSync(pathName); 
    }

    const countryName = document.getElementById('country1-input').value;
    const filePath = path.join(pathName, `${countryName}.txt`);

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            alert(`No saved data found for ${countryName}`);
            console.error("Error reading file:", err);
        } else {
            // Split each line and parse key-value pairs
            const lines = data.split('\n');
            lines.forEach(line => {
                const [key, value] = line.split(': ').map(item => item.trim());

                if (key && value !== undefined) {
                    // Map the key to the corresponding HTML element ID (all lowercase)
                    const elementId = key.toLowerCase();

                    // Display text or set the href/src attribute for specific elements
                    if (elementId === "mapslink") {
                        document.getElementById("maps").innerHTML = `<a href="${value}" target="_blank">View Map</a>`;
                    } else if (elementId === "flags" || elementId === "coatofarms") {
                        document.getElementById(elementId).src = value;
                    } else {
                        document.getElementById(elementId).textContent = value;
                    }
                }
            });
            alert(`Loaded data for ${countryName}`);
        }
    });
}
function homepage() {
    window.location.href = "index.html"; // Replace with your actual page URL
}
var btnCreate = document.getElementById('btnCreate');
var btnRead = document.getElementById('btnRead');
var btnDelete = document.getElementById('btnDelete');
var btnSave = document.getElementById('btnSave');
var btnLoad = document.getElementById('btnLoad');
var fileName = document.getElementById('fileName');
var fileContents = document.getElementById('fileContents');

// Directory to store files
let pathName = path.join(__dirname, 'Files');
if (!fs.existsSync(pathName)) {
    fs.mkdirSync(pathName);
}

// Create File
btnCreate.addEventListener('click', function () {
    let filePath = path.join(pathName, fileName.value);
    let content = fileContents.value;

    fs.writeFile(filePath, content, function (err) {
        if (err) {
            alert("Error: " + err.message);
            return;
        }
        alert(`${fileName.value} created successfully!`);
    });
});

// Read File
btnRead.addEventListener('click', function () {
    let filePath = path.join(pathName, fileName.value);

    fs.readFile(filePath, 'utf-8', function (err, data) {
        if (err) {
            alert("Error: " + err.message);
            return;
        }
        fileContents.value = data;
        alert(`${fileName.value} read successfully!`);
    });
});

// Delete File
btnDelete.addEventListener('click', function () {
    let filePath = path.join(pathName, fileName.value);

    fs.unlink(filePath, function (err) {
        if (err) {
            alert("Error: " + err.message);
            return;
        }
        fileName.value = '';
        fileContents.value = '';
        alert(`${fileName.value} deleted successfully!`);
    });
});
  
