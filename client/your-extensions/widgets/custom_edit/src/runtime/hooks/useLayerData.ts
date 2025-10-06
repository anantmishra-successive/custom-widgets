import { useState, useEffect } from 'react'
import FeatureLayer from 'esri/layers/FeatureLayer'

/**
 * useLayerData - React hook to fetch data from a FeatureLayer by URL
 * @param {string} url - The FeatureLayer URL
 * @param {object} [queryOptions] - Optional query options (where, outFields, etc.)
 * @returns {object} { data, loading, error }
 */
export function useLayerData(url: string, queryOptions?: any) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    if (!url) return
    setLoading(true)
    setError(null)
    const fl = new FeatureLayer({ url })
    const q = fl.createQuery()
    q.where = queryOptions?.where || '1=1'
    q.outFields = queryOptions?.outFields || ['*']
    q.returnGeometry = queryOptions?.returnGeometry ?? false
    fl.queryFeatures(q)
      .then(res => {
        setData(res.features || [])
        setLoading(false)
      })
      .catch(err => {
        setError(err)
        setLoading(false)
      })
  }, [url, JSON.stringify(queryOptions)])

  return { data, loading, error }
}
