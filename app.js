const express = require('express');
const { WebcastPushConnection } = require('tiktok-live-connector');
const app = express();
const port = process.env.PORT || 3000;

let viewerCount = 0; // ตัวแปรเก็บยอดคนดู

// --- ส่วนของ TikTok ---
let tiktokUsername = "sense_review"; 
let tiktokLiveConnection = new WebcastPushConnection(tiktokUsername);

tiktokLiveConnection.connect().catch(err => console.error('Error', err));

tiktokLiveConnection.on('roomUser', (data) => {
    viewerCount = data.viewerCount; // อัปเดตยอดคนดูเมื่อมีการเปลี่ยนแปลง
    console.log(`Current Viewers: ${viewerCount}`);
});

// --- ส่วนของ API สำหรับ Apps Script ---
app.get('/get-live-data', (req, res) => {
    res.json({
        status: "success",
        viewers: viewerCount,
        username: tiktokUsername
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/get-live-data`);
});