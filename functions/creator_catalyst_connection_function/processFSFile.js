/*
 * This microservice fetches a file from File Store, parses it and pumps rows into 
 * the Creator form. This is a sample microservice which can be invoked from the back end to push data into creator.
 *
 */
const fs = require('fs');
const axios = require('axios');
const catalyst = require('zcatalyst-sdk-node');
const FOLDERID = ID_OF_THE_CREATED_FOLDER;
const FILEID = ID_OF_THE_UPLOADED_FILE;
const CREDENTIALS = {
    CreatorConnector: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        auth_url: 'https://accounts.zoho.com/oauth/v2/auth',
        refresh_url: 'https://accounts.zoho.com/oauth/v2/token',
        refresh_token: REFRESH_TOKEN
    }
};

/**
 * 
 * @param data -The data to add to Creator
 * @param access token - The accessToken for API call
 */
async function insertRecordsInCreator(data, accessToken) {
    try {
        const config = {
            method: 'POST',
            url: 'https://creator.zoho.com/api/v2/{REPLACE_THIS_WITH_YOUR_APP_NAME_AND_FORM_NAME}',
            headers: {
                'Authorization': `Zoho-oauthtoken ${accessToken}`,
                'Content-Type': 'application/json',
            },
            data: { "data": data }
        };
        const response = await axios(config);
        if (response.status != 200) {
            console.log("Failure updating record in Creator", response.status);
        }
    } catch (e) {
        console.log("Failure updating record in Creator", e);
    }
}

module.exports = async (context, basicIO) => {

    const catalystApp = catalyst.initialize(context);
    const fileData = await catalystApp.filestore().folder(FOLDERID).downloadFile(FILEID);
    await fs.promises.writeFile('feedbacks.txt', fileData);
    const accessToken = await catalystApp.connection(CREDENTIALS).getConnector('CreatorConnector').getAccessToken();
    const fileDetails = (await fs.promises.readFile('./feedbacks.txt', 'utf-8')).toString().split(/\r?\n/);

    for (const fileData of fileDetails) {
        const tempLine = fileData.split('-');
        await insertRecordsInCreator({
            "Email": tempLine[0],
            "MovieName": tempLine[1],
            "Feedback": tempLine[2]
        }, accessToken);
    }
    basicIO.write({ "status": "success" });
    context.close();
};