import * as tf from "@tensorflow/tfjs"
import { useEffect, useRef } from "react"
import * as faceapi from "@vladmandic/face-api"
import { db } from "../lib/firebase"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"

export default function LiveVideoCard() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const recentFaces = useRef([])

  useEffect(() => {
    const MAX_FACE_AGE_MS = 10 * 1000

    const setupBackend = async () => {
      await tf.setBackend("webgl")
      await tf.ready()
      console.log("Backend ativo:", tf.getBackend())
    }

    const loadModels = async () => {
      const MODEL_URL = "/models"
      await faceapi.nets.tinyFaceDetector.loadFromUri(`${MODEL_URL}/tiny_face_detector`)
      await faceapi.nets.faceLandmark68Net.loadFromUri(`${MODEL_URL}/face_landmark_68`)
      await faceapi.nets.faceRecognitionNet.loadFromUri(`${MODEL_URL}/face_recognition`)
      await faceapi.nets.faceExpressionNet.loadFromUri(`${MODEL_URL}/face_expression`)
      await faceapi.nets.ageGenderNet.loadFromUri(`${MODEL_URL}/age_gender_model`)
    }

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        videoRef.current.srcObject = stream
      } catch (err) {
        console.error("Erro ao acessar a câmera:", err)
        alert("Não foi possível acessar a câmera. Verifique as permissões do sistema.")
      }
    }

    const detectFaces = async () => {
      if (!videoRef.current || !canvasRef.current) return

      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender()
        .withFaceDescriptors()

      const canvas = faceapi.createCanvasFromMedia(videoRef.current)
      canvasRef.current.innerHTML = ""
      canvasRef.current.appendChild(canvas)

      faceapi.matchDimensions(canvas, {
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight,
      })

      const resized = faceapi.resizeResults(detections, {
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight,
      })

      resized.forEach((detection) => {
        const box = detection.detection.box
        const ctx = canvas.getContext("2d")

        ctx.strokeStyle = "#00FF00"
        ctx.lineWidth = 2
        ctx.strokeRect(box.x, box.y, box.width, box.height)

        const larguraRosto = box.width
        const constanteReal = 0.153
        const distancia = constanteReal / (larguraRosto / videoRef.current.videoWidth)

        const texto = `${distancia.toFixed(2)}m`

        ctx.font = "14px Arial"
        ctx.fillStyle = "#00FF00"
        ctx.fillText(texto, box.x, box.y - 5) 
      })

      const now = Date.now()

      for (const detection of detections) {
        const descriptor = detection.descriptor

        const isRecent = recentFaces.current.find(
          (face) =>
            faceapi.euclideanDistance(face.descriptor, descriptor) < 0.5 &&
            now - face.timestamp < MAX_FACE_AGE_MS
        )

        if (isRecent) continue

        recentFaces.current.push({ descriptor, timestamp: now })
        recentFaces.current = recentFaces.current.filter(
          (face) => now - face.timestamp < MAX_FACE_AGE_MS
        )

        await addDoc(collection(db, "detections"), {
          timestamp: serverTimestamp(),
          idade: detection.age.toFixed(0),
          genero: detection.gender,
          expressao: Object.entries(detection.expressions).reduce((a, b) =>
            a[1] > b[1] ? a : b
          )[0],
        })
      }
    }

    setupBackend().then(() => {
      loadModels().then(() => {
        startVideo()
        setInterval(detectFaces, 2000)
      })
    })
  }, [])

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
  )
}
