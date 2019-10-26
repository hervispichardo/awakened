import { useState, useEffect } from 'reactn'
import { collectionData } from 'rxfire/firestore'

const useFirestoreQuery = (ref) => {
  const [docState, setDocState] = useState({
    isLoading: true,
    data: null
  });

  useEffect(() => {
    collectionData(
      ref.orderBy('time', 'desc'), 'id'
    ).subscribe(data => {
      console.log({ data })
      setDocState({
        isLoading: false,
        data
      });
    })
  }, [])

  return docState;
}

export {
  useFirestoreQuery
}