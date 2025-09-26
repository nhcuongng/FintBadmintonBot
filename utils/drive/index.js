const { google } = require('googleapis');
const path = require('node:path');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

// auth
//     .getAccessToken()
//     .then((token) => console.log('token...', token))
//     .catch((err) => console.log('err...', err));

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
async function listUser(sheetId) {
    const userFunded = [];
    const allUser = [];
    // Authenticate with Google and get an authorized client.
    const auth = new google.auth.GoogleAuth({
        keyFile: path.join(__dirname, './credentials.json'),
        scopes: SCOPES
    });
  
    // Create a new Sheets API client.
    const sheets = google.sheets({ version: 'v4', auth });
    // Get the values from the spreadsheet.
    const result = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: 'Thành viên!A2:E'
    });
    const rows = result.data.values;
    if (!rows || rows.length === 0) {
        console.log('No data found.');
        return;
    }
    
    // Print the name and major of each student.
    rows.forEach((row) => {
        const danhDinhKy = row[3];
        const funded =  row[4];
        const username = row[2];

        if (danhDinhKy === 'TRUE') {
            if (funded !== 'TRUE') {
                userFunded.push(username);
            }

            allUser.push(username);
        }
    });

    return [userFunded, allUser];
}

module.exports = {
    listUser
};