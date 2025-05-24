import { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import { db } from "../lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function LiveVideoCard() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(
        "/models/tiny_face_detector"
      );
      await faceapi.nets.faceLandmark68Net.loadFromUri(
        "/models/face_landmark_68"
      );
      await faceapi.nets.faceRecognitionNet.loadFromUri(
        "/models/face_recognition"
      );
      await faceapi.nets.faceExpressionNet.loadFromUri(
        "/models/face_expression"
      );
      await faceapi.nets.ageGenderNet.loadFromUri("/models/age_gender_model");
    };

    const startVideo = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    };

    const detectFaces = async () => {
      if (videoRef.current && canvasRef.current) {
        const detections = await faceapi
          .detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceLandmarks()
          .withFaceExpressions()
          .withAgeAndGender();

        const canvas = faceapi.createCanvasFromMedia(videoRef.current);
        canvasRef.current.innerHTML = "";
        canvasRef.current.appendChild(canvas);

        faceapi.matchDimensions(canvas, {
          width: videoRef.current.videoWidth,
          height: videoRef.current.videoHeight,
        });

        const resized = faceapi.resizeResults(detections, {
          width: videoRef.current.videoWidth,
          height: videoRef.current.videoHeight,
        });

        faceapi.draw.drawDetections(canvas, resized);
        faceapi.draw.drawFaceLandmarks(canvas, resized);
        faceapi.draw.drawFaceExpressions(canvas, resized);

        if (detections.length > 0) {
          const face = detections[0];
          await addDoc(collection(db, "detections"), {
            timestamp: serverTimestamp(),
            idade: face.age.toFixed(0),
            genero: face.gender,
            expressao: Object.entries(face.expressions).reduce((a, b) =>
              a[1] > b[1] ? a : b
            )[0],
          });
        }
      }
    };

    loadModels().then(() => {
      startVideo();
      setInterval(detectFaces, 2000);
    });
  }, []);

  return (
    <div className="relative w-full aspect-video rounded border overflow-hidden bg-black">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      <div ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
    </div>
  );
}
