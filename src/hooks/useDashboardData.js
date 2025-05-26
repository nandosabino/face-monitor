import { useEffect, useState } from "react"
import { onSnapshot, collection, query, orderBy } from "firebase/firestore"
import { db } from "../lib/firebase"

export function useDashboardData() {
  const [data, setData] = useState([])

  useEffect(() => {
    const q = query(collection(db, "detections"), orderBy("timestamp", "asc"))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const detections = snapshot.docs.map((doc) => {
        const raw = doc.data()
        return {
          id: doc.id,
          timestamp: raw.timestamp?.toDate(),
          idade: raw.idade,
          genero: raw.genero,
          expressao: raw.expressao,
        }
      })

      const hoje = new Date()
      hoje.setHours(0, 0, 0, 0)

      const somenteHoje = detections.filter((det) => det.timestamp >= hoje)
      setData(somenteHoje)
    })

    return () => unsubscribe()
  }, [])

  return data
}
