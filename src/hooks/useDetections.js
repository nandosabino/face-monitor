import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase"

export function useDetections() {
    const [detections, setDetections] = useState([])

    useEffect(() => {
        const q = query(collection(db, "detections"), orderBy("timestamp", "desc"))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }))
            setDetections(data)
        })
        return () => unsubscribe()
    }, [])

    return detections
}