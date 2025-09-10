AppSheet to Apps Script Webhook Integration for Feedback Processing

Overview
This project demonstrates a robust, serverless workflow for processing user feedback submitted through a Google Form. It uses an AppSheet application to detect new form submissions and triggers a Google Apps Script webhook to perform an action—in this case, sending a conditional email based on the user's feedback rating.
This is a common and powerful pattern for extending the functionality of AppSheet applications with custom backend logic.

Core Technologies
- Google Forms: The user-facing interface for data entry.
- AppSheet: The no-code platform used to create an application that "listens" for new form submissions and triggers the automation.
- Google Apps Script: A serverless JavaScript platform that hosts the webhook. It contains the custom logic to parse the incoming data and send emails.

Prerequisites
Before you begin, ensure you have the following:
1. A Google Workspace Account: While this can work with a standard Gmail account, a Google Workspace account is recommended for better management, security, and integration capabilities.
2. An AppSheet Account: An AppSheet Core license (or higher) is required to deploy applications with automation features. An Enterprise plan is preferable for advanced security and governance.
3. Basic Knowledge: A foundational understanding of Google Forms, the AppSheet app editor, and basic JavaScript will be helpful.

Setup Instructions
Follow these steps to replicate the entire workflow.

1. Create the Google Form
This will be the starting point for your data.
Go to forms.google.com and create a new form.
Add the questions that will be sent to the script. For this project, we used:
- What's your name?
- What is your email?
- Training topic
- Overall rating
- Comments

2. Set Up the Google Apps Script Webhook
This script will act as the backend logic processor.
1. Go to script.google.com and create a new project.
2. Name the project Feedback Processor Webhook.
3. Delete the default Code.gs content and paste the code from the feedback_processor.gs file.
4. Crucial Step: Deploy the Web App.
  - Click Deploy > New deployment.
  - Click the gear icon and select Web app.
  - Configure the deployment with the following settings:
    > Description: Feedback Processor v1
    > Execute as: Me (Your Google Account)
    > Who has access: Anyone
  - Click Deploy.
  - Authorize the script to grant it permission to send emails on your behalf.
  - Copy the Web app URL. It will end in /exec. This is your webhook endpoint.
  - 
3. Configure the AppSheet Application
This app connects the form to the script.
1. Go to appsheet.com and create a new app.
2. Choose Start with existing data and select the Google Form you created in Step 1 as your data source.
3. In the AppSheet editor, go to the Automation tab 🤖.
4. Create a new Bot and name it Process New Feedback.
5. Configure the Event:
  - Set the Event Type to Data Change and the Table to your form's data table.
  - Set the Data Change Type to Adds only. This ensures the bot only runs for new entries.
6. Configure the Process Step:
  - Add a new step and choose Call a webhook.
  - URL: Paste the /exec URL you copied from the Apps Script deployment.
  - HTTP Verb: POST
  - Body: Paste the body.json template. Ensure the keys in the template exactly match your Google Form's column headers.
7. Save your bot.

How to Test
1. Open your live Google Form and submit a new entry.
2. If you submitted a rating of 3 or higher, check the "attendee" email inbox for a "Thank You" email.
3. If you submitted a rating of 1 or 2, check the "manager" email inbox for a "Low Feedback Alert".
4. You can also check the Manage > Monitor > Audit History in AppSheet to see a "Success" status for the webhook call.

