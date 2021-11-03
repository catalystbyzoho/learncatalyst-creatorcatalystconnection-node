/*
 *  This file is a basicIO which receives data from Creator when a form is filled and submitted
 *  The data obtained are - Feedbacks and ID of the form submitted.
 *  Upon receiving the feedback, ZIA text analysis is invoked to obtain the Sentiment
 *  The sentiment is updated back to the Creator app
 *  Also a record gets added to CRM as a Lead
 */
const axios = require('axios');
const catalyst = require('zcatalyst-sdk-node');
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
 * @param data -The data to update to Creator
 * @param access token - The accessToken for API call
 */
async function updateRecordsInCreator(data, accessToken) {
    try {
        const url = `https://creator.zoho.com/api/v2/{REPLACE_THIS_WITH_YOUR_APP_NAME_AND_FORM_NAME}/${data.ID}`;
        const config = {
            method: 'PATCH',
            url: url,
            headers: {
                'Authorization': `Zoho-oauthtoken ${accessToken}`,
                'Content-Type': 'application/json',
            },
            data: { data }
        };
        const response = await axios(config);
        if (response.status != 200) {
            console.log("Failure updating record in Creator", response.status);
        }
    } catch (e) {
        console.log("Failure updating record in Creator", e);
    }
}

/**
 * 
 * @param email - The email of the person who gave the feedback 
 * @param access token - The accessToken for API call
 */
const addRecordsToCRMInLeads = async (email, accessToken) => {
    try {
        const config = {
            method: 'POST',
            url: 'https://www.zohoapis.com/crm/v2/Leads',
            headers: {
                'Authorization': `Zoho-oauthtoken ${accessToken}`,
                'Content-Type': 'application/json',
            },
            data: {
                data: [{
                    "Last_Name": 'JoyfulMovieWeekends-N',
                    "Email": email
                }]
            }
        };
        const response = await axios(config);
        if (response.status != 200) {
            console.log("Failure in adding Lead to CRM", response.status);
        }
    } catch (e) {
        console.log("Failure in adding Lead to CRM", e);
    }
}

module.exports = async (context, basicIO) => {
    try {
        const catalystApp = catalyst.initialize(context);
        const mailId = basicIO.getArgument("email");
        const ID = basicIO.getArgument("id");
        const textPromise = await catalystApp.zia().getTextAnalytics([basicIO.getArgument("feedback")]);
        const accessToken = await catalystApp.connection(CREDENTIALS).getConnector('CreatorConnector').getAccessToken();
        const Sentiment = textPromise[0].sentiment_prediction[0].document_sentiment;

        await updateRecordsInCreator({ Sentiment, ID }, accessToken);
        if (ID != null) {
            await addRecordsToCRMInLeads(mailId, accessToken);
        }
        basicIO.write(JSON.stringify({ "status": "success" }));
    } catch (e) {
        console.log("Failure in adding Lead to CRM", e);
        context.close();
    }
};