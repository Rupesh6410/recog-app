working Link: https://recog-app-rupeshkumar6410g-gmailcoms-projects.vercel.app/

📸 Face Recognition + Video Recording App

This is a Next.js-based web app that uses face-api.js for face detection and landmarks, and MediaRecorder API to record videos. It also saves recordings in localStorage and allows download.
🚀 Features

    Face detection using tiny_face_detector

    Face landmarks (dots on face)

    Real-time camera feed

    Record face video with MediaRecorder

    Store video blob in localStorage

    Download recorded video

    Deployable on Vercel

🧠 Technologies

    Next.js 14+

    face-api.js

    MediaRecorder API

    TailwindCSS & Framer Motion

    LocalStorage for saving blob URLs



 ✅ Setup Instructions
1. Clone & Install

git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
npm install

2. Add Face-API Models

    Download models from here:
    https://github.com/justadudewhohacks/face-api.js-models

    Place them in:

public/models/

So it looks like:

public/models/tiny_face_detector_model-weights_manifest.json
public/models/face_landmark_68_model-weights_manifest.json
...

3. Run Locally

npm run dev

Visit: http://localhost:3000