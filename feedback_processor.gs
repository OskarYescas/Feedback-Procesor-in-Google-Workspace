/**
 * @fileoverview This Google Apps Script acts as a webhook endpoint to process
 * feedback submissions from an AppSheet application. The feedback originates
 * from a Google Form. Based on the rating provided, this script sends a
 * conditional email: either a "low feedback" alert to a designated manager or a
 * "thank you" email to the person who submitted the form.
 *
 * @version 1.2
 * @author Oskar Yescas
 */

/**
 * Handles HTTP POST requests sent to the script's deployment URL. This is the
 * primary function triggered by the AppSheet webhook.
 *
 * @param {object} e The event parameter object provided by Google Apps Script,
 * containing details about the incoming POST request, including the payload.
 * @returns {ContentService.TextOutput} A JSON object indicating the success or
 * failure of the operation, which is sent back to the AppSheet application.
 */
function doPost(e) {
  // --- Configuration ---
  // Set the email address for manager alerts when feedback scores are low.
  // IMPORTANT: Replace with a valid email address before deployment.
  const MANAGER_EMAIL = "email";
  
  // Set the numerical threshold for what is considered a "low" rating.
  // Any rating strictly less than this value will trigger the manager alert.
  const RATING_THRESHOLD = 3;

  try {
    // Log the incoming request payload for debugging purposes. This is visible
    // in the Apps Script project's "Executions" log.
    console.log("Webhook triggered. Raw data received:");
    console.log(e.postData.contents);

    // Parse the JSON string from the request body into a JavaScript object.
    const requestData = JSON.parse(e.postData.contents);
    console.log("Data successfully parsed.");

    // Extract data from the parsed object. The keys (e.g., "What's your name?")
    // must exactly match the column names from your Google Form data source in AppSheet.
    const attendeeName = requestData["What's your name?"];
    const attendeeEmail = requestData["What is your email?"];
    const topic = requestData["Training topic"];
    // Convert the rating string to an integer for numerical comparison.
    const rating = parseInt(requestData["Overall rating"], 10);
    const comments = requestData["Comments"];

    let emailSubject = "";
    let emailBody = "";

    // Conditional logic to determine which email to send.
    if (rating < RATING_THRESHOLD) {
      // Logic for low rating: construct and send an alert to the manager.
      emailSubject = `Low Feedback Alert for Training: ${topic}`;
      emailBody = `A low feedback rating of ${rating}/5 was received for the training session "${topic}".\n\n` +
                  `Attendee: ${attendeeName}\n` +
                  `Email: ${attendeeEmail}\n` +
                  `Comments: ${comments || "No comments provided."}`; // Use a fallback for empty comments.

      MailApp.sendEmail(MANAGER_EMAIL, emailSubject, emailBody);
      console.log(`Low rating alert sent to ${MANAGER_EMAIL}`);

    } else {
      // Logic for good rating: construct and send a thank you email to the attendee.
      emailSubject = `Thank You for Your Feedback on ${topic}!`;
      emailBody = `Hi ${attendeeName},\n\n` +
                  `Thank you for providing your feedback on the "${topic}" training session. We appreciate your input!\n\n` +
                  `Best regards,\nThe Training Team`;

      MailApp.sendEmail(attendeeEmail, emailSubject, emailBody);
      console.log(`Thank you email sent to ${attendeeEmail}`);
    }

    // Prepare a success response to send back to AppSheet.
    const response = {
      status: "success",
      message: "Webhook processed and email sent successfully."
    };

    // Return the response as a JSON string.
    // setXFrameOptionsMode is a best practice to prevent potential cross-domain issues.
    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON)
      .setXFrameOptionsMode(ContentService.XFrameOptionsMode.ALLOWALL);

  } catch (error) {
    // If any part of the `try` block fails, this `catch` block will execute.
    console.error(`Webhook Error: ${error.toString()}`);

    // Prepare an error response to send back to AppSheet. This helps in debugging
    // by making the error visible in the AppSheet Audit History.
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
      .setXFrameOptionsMode(ContentService.XFrameOptionsMode.ALLOWALL);
  }
}

