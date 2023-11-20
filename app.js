const express = require('express');
const app = express();
const port = 3000;
const AWS = require('aws-sdk');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

AWS.config.update({
  accessKeyId: 'AKIAUSIF7UZUOWPZFV4U',
  secretAccessKey: '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',
  region: 'Global',
});

const s3 = new AWS.S3();

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/compress', upload.single('video'), async (req, res) => {
  try {
  
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }


    const inputBuffer = req.file.buffer;
    const outputBuffer = await compressVideo(inputBuffer);


    const s3Params = {
      Bucket: 'compression',
      Key: 'compressed-video.mp4',
      Body: outputBuffer,
    };

    await s3.upload(s3Params).promise();

    res.json({ message: 'Video compression successful' });
  } catch (error) {
    console.error('Error during video compression:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
