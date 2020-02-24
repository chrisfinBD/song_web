import React, {useState, useEffect} from 'react'
import { Chart } from 'react-charts'
const HitCharts = ()=> {
  const [ratings, setRatings] = useState([])
  useEffect(()=> {
    fetch("http://songs.api:3020/songs.json")
      .then((res)=> res.json())
      .then((data)=> setRatings(data.map((s, i) => [i, s.rating])))
      .catch((error)=> console.log("Oops", error))
  }, [])
  const data = [{
      label: 'Song Rating',
      data: ratings
    }]
  const axes = [
      { primary: true, type: 'linear', position: 'bottom' },
      { type: 'linear', position: 'left' }
    ]
  return (
    <div style={{width: '400px', height: '300px', clear: 'both'}}>
      <Chart data={data} axes={axes} />
    </div>
  )
}
export default HitCharts