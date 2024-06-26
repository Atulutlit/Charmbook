const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { format } = require('date-fns');

// Function to log messages to a CSV file
async function logSchedulers(fileName, sender, msg) {
  // Check if the CSV file already exists
  const fileExists = fs.existsSync(fileName);

  // Define the CSV writer with the path and headers
  const csvWriter = createCsvWriter({
    path: fileName,
    header: [
      { id: 'timestamp', title: 'Timestamp' },
      { id: 'sender', title: 'Sender' },
      { id: 'message', title: 'Message' }
    ],
    append: true // Append to the file if it exists
  });

  // Data to be written
  const data = [
    {
      timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      sender: sender,
      message: msg
    }
  ];

  // Write the item to the CSV file
  try {
    await csvWriter.writeRecords(data);
    console.log('Item written to CSV file successfully.');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Example usage
const sender = 'exampleSender';
const msg = 'This is a test message.';
const fileName = 'log.csv';

logSchedulers(fileName, sender, msg);
