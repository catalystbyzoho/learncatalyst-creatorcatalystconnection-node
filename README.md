A code sample for connection between Creator and Catalyst and vice versa.

API Requirements :

Kindly visit the Zoho Developer Console(api-console.zoho.com), enable self client and generate a code with the scopes ZohoCreator.form.CREATE,ZohoCreator.report.UPDATE,ZohoCRM.modules.ALL. Generate a refresh token with the code(https://catalyst.zoho.com/help/api/introduction/access-and-refresh.html).

Catalyst Requirements : 

Kindly create a Folder in the Catalyst Console named "File_Storage" and replace the Folder ID value constant in the code wherever required.

After creating the folder, upload the feedbacks.txt file present in the creator_catalyst_connection_function folder to the Catalyst Console and replace the File ID value constant in the code wherever required.

Once the above process is complete, clone the code and replace the constants wherever required. Also, replace the Client ID, Client Secret and Refresh Token generated in the API Requirements step in the code wherever necessary.

Once the replacements are completed, deploy the code using the command "catalyst deploy" to the Catalyst Console. You will be creating 3 functions in the process.

Creator Requirements :

After cloning the code, there will be a file named Customer_Feedbacks.ds which you can use to import and create the Creator Application. After creating the application in Creator, you need to edit the custom functions present in it and change the domain of the Catalyst functions to your domain. You can find the same in the Environments tab of the settings section in your Catalyst Console.

Once the above process is completed, the Creator Catalyst Connection is completed and good to go !

Usage of Catalyst Functions :

get_feedback_sentiment - Get the sentiment of the feedback provided by the customer and update it in creator and CRM.
get_Movie_Trailer - Gets the trailer of the movie that you have specified.
creator_catalyst_connection_function - This is a standalone microservice which fetches a file from File Store, parses it and pushes rows into the Creator form. This is a sample microservice which can be invoked from the back end to push data into creator. You can invoke this function using it's URL to push data into creator.

Catalyst Help Documentation : https://catalyst.zoho.com/help/
Catalyst Tutorials : https://catalyst.zoho.com/help/tutorials/index.html
Catalyst Quick Start Guide : https://catalyst.zoho.com/help/quick-start-guide.html