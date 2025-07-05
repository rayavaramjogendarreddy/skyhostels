// Google Apps Script for Hostel Admission Form with File Uploads
// Deploy this as a web app to handle form submissions

function doPost(e) {
  try {
    // Folder IDs for Aadhaar and Photo
    const aadhaarFolderId = '1MBt_d00dCwv2Dh5dS2ns8EYr4y3l27UP';
    const photoFolderId = '1uCYP_aRlsA6WiDRFEIXu91Niu4YkMkO3';
    const maxSize = 10 * 1024 * 1024; // 10MB
    const aadhaarTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const photoTypes = ['image/jpeg', 'image/png'];

    // Expected headers
    const HEADERS = [
      'Timestamp',
      'First Name',
      'Last Name',
      'Date of Birth',
      'Gender',
      'Email',
      'Mobile',
      'Address',
      'Institution',
      'Course',
      'Year of Study',
      'Student ID',
      'Meal Plan',
      'Check-in Date',
      'Duration',
      'Aadhaar Upload Link',
      'Photo Upload Link',
      'Floor Number',
      'Room Number',
      'Emergency Contact Name',
      'Emergency Contact Phone',
      'Medical Conditions',
      'Special Requirements'
    ];

    // Get the active spreadsheet (replace with your actual spreadsheet ID)
    const spreadsheet = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID_HERE');
    let sheet = spreadsheet.getSheetByName('Admissions');
    if (!sheet) {
      sheet = spreadsheet.insertSheet('Admissions');
    }
    // Always check and update headers
    ensureHeaders(sheet, HEADERS);

    // Parse form fields
    const formData = e.parameter;
    // Handle file uploads
    let aadhaarLink = '';
    let photoLink = '';
    if (e.files) {
      // Aadhaar
      if (e.files['aadhaarUpload']) {
        const aadhaarFile = e.files['aadhaarUpload'];
        if (aadhaarFile.length) {
          // Multiple files, take the first
          aadhaarLink = saveFileToDrive(aadhaarFile[0], aadhaarFolderId, aadhaarTypes, maxSize);
        } else {
          aadhaarLink = saveFileToDrive(aadhaarFile, aadhaarFolderId, aadhaarTypes, maxSize);
        }
      }
      // Photo
      if (e.files['photoUpload']) {
        const photoFile = e.files['photoUpload'];
        if (photoFile.length) {
          photoLink = saveFileToDrive(photoFile[0], photoFolderId, photoTypes, maxSize);
        } else {
          photoLink = saveFileToDrive(photoFile, photoFolderId, photoTypes, maxSize);
        }
      }
    }

    // Prepare the data row
    const rowData = [
      new Date(), // Timestamp
      formData.firstName || '',
      formData.lastName || '',
      formData.dateOfBirth || '',
      formData.gender || '',
      formData.email || '',
      formData.mobile || '',
      formData.address || '',
      formData.institution || '',
      formData.course || '',
      formData.yearOfStudy || '',
      formData.studentId || '',
      formData.mealPlan || '',
      formData.checkInDate || '',
      formData.duration || '',
      aadhaarLink,
      photoLink,
      formData.floorPreference || '',
      formData.roomNumber || '',
      formData.emergencyName || '',
      formData.emergencyPhone || '',
      formData.medicalConditions || '',
      formData.specialRequirements || ''
    ];
    sheet.appendRow(rowData);

    // Send confirmation email (optional)
    if (formData.email) {
      sendConfirmationEmail(formData.email, formData.firstName);
    }

    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'success',
        'message': 'Application submitted successfully!'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'error',
        'message': 'An error occurred while submitting the application. Please try again.'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function ensureHeaders(sheet, HEADERS) {
  const firstRow = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  let needsUpdate = false;
  for (let i = 0; i < HEADERS.length; i++) {
    if (firstRow[i] !== HEADERS[i]) {
      needsUpdate = true;
      break;
    }
  }
  if (needsUpdate) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }
}

function saveFileToDrive(fileObj, folderId, allowedTypes, maxSize) {
  if (!allowedTypes.includes(fileObj.mimeType)) {
    throw new Error('Invalid file type.');
  }
  if (fileObj.length && fileObj[0].bytes.length > maxSize) {
    throw new Error('File too large.');
  }
  if (!fileObj.length && fileObj.bytes.length > maxSize) {
    throw new Error('File too large.');
  }
  const blob = Utilities.newBlob(fileObj.bytes, fileObj.mimeType, fileObj.filename);
  const folder = DriveApp.getFolderById(folderId);
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getUrl();
}

function sendConfirmationEmail(email, firstName) {
  try {
    const subject = 'Hostel Admission Application Received - Sky Hostels';
    const body = `
Dear ${firstName},

Thank you for submitting your hostel admission application to Sky Hostels.

Your application has been received and is currently under review. We will process your application within 3-5 business days and contact you with further details.

Application Details:
- Application Date: ${new Date().toLocaleDateString()}
- Status: Under Review

If you have any questions, please contact us:
- Phone: +91-9094444115
- Email: skyhostels2023@gmail.com

Best regards,
Sky Hostels Team
    `;
    MailApp.sendEmail(email, subject, body);
  } catch (error) {
    console.log('Error sending confirmation email:', error);
  }
}

function doGet() {
  return ContentService
    .createTextOutput('Hostel Admission Form Handler is running!')
    .setMimeType(ContentService.MimeType.TEXT);
} 