const fs = require('fs');
const path = require('path');

class JsonDatabase {
    #urlPath = './db/chat.json';

    constructor(filePath) {
        if (filePath) {
            this.#urlPath = filePath;
        }
    }

    setFilePath(urlPath) {
        this.#urlPath = `./db/${urlPath}.json`;
    }

    readData() {
        const data = fs.readFileSync(this.#urlPath, 'utf8');
        const jsonData = JSON.parse(data);
        return jsonData;
    }

    writeData(data) {
        try {
            if (!fs.existsSync(this.#urlPath)) {
                fs.writeFileSync(this.#urlPath, JSON.stringify(data, null, 2));
                console.log(`Data saved to ${this.#urlPath}`);
                return true;
            } else {
                console.log(`File ${this.#urlPath} already exists, not overwriting.`);
                return false;
            }
        } catch (error) {
            console.error(`Error saving data to ${this.#urlPath}:`, error);
            throw new Error(`Error saving data to file: ${error}`);
        }
    }

    updateData(data) {
        try {
            fs.writeFileSync(this.#urlPath, JSON.stringify(data, null, 2));
            console.log(`Data updated in ${this.#urlPath}`);
            return true;
        } catch (error) {
            console.error(`Error updating data in ${this.#urlPath}:`, error);
            throw new Error(`Error updating data in file: ${error}`);
        }
    }

    removeFile() {
        try {
            if (fs.existsSync(this.#urlPath)) {
                fs.unlinkSync(this.#urlPath);
                console.log(`File ${this.#urlPath} removed`);
                return true;
            }
            return false;
        } catch (error) {
            console.error(`Error removing ${this.#urlPath}:`, error);
            return false;
        }
    }

    fileExists() {
        return fs.existsSync(this.#urlPath);
    }

    readAllData() {
        try {
            const dbDir = path.dirname(this.#urlPath);
            
            if (!fs.existsSync(dbDir)) {
                return {};
            }

            const files = fs.readdirSync(dbDir);
            const jsonFiles = files.filter(file => file.endsWith('.json'));
            const allData = {};

            jsonFiles.forEach(file => {
                try {
                    const filePath = path.join(dbDir, file);
                    const data = fs.readFileSync(filePath, 'utf8');
                    const jsonData = JSON.parse(data);
                    const fileName = path.basename(file, '.json');
                    allData[fileName] = jsonData;
                } catch (error) {
                    console.error(`Error reading file ${file}:`, error);
                }
            });

            return allData;
        } catch (error) {
            console.error('Error reading all data:', error);
            return {};
        }
    }
}

module.exports = JsonDatabase;