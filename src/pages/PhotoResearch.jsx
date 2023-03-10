import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from 'axios'
import Search from "./components/Search";
import Picture from "./components/Picture";
import Button from '@mui/material/Button';
import Animation from "./components/Animation";
import paint from '../assets/images/paint.jpg'

const PhotoResearch = () => {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentSearch, setCurrentSearch] = useState('')
  const [photos, setPhotos] = useState(null)
  const [page, setPage] = useState(1)
  const auth = "8ozFdqgpjKlORXrDbessEcW9oQuO8Prp04ZbsA8pGoce3O6ulr9o01SX"

  const initialURL = useMemo(() => {
    return `https://api.pexels.com/v1/curated?page=${page}&per_page=15`
  }, [page])

  const searchURL = useMemo(() => {
    return `https://api.pexels.com/v1/search?query=${currentSearch}&page=${page}&per_page=15`
  }, [currentSearch, page])

  const search = useCallback((input) => {
    setPage(1)
    setCurrentSearch(input)
  }, [])

  const morePicture = useCallback(() => {
    setPage(page + 2) // 因pexels提供API有誤，避免圖片最後一張重複
  }, [page])

  useEffect(() => {
    async function fetchData() {
      let newURL = ''
      if (currentSearch === '') {
        newURL = initialURL
      } else {
        newURL = searchURL
      }
      try {
        let result = await axios.get(newURL, { headers: { Authorization: auth } })
        console.log(result);
        setIsLoading(false)
        if (page === 1) {
          setPhotos(result.data.photos)
        } else {
          setPhotos(photos => (photos.concat(result.data.photos)))
        }
      } catch (e) {
        console.log(e);
        setIsLoading(false)
      }
    }
    fetchData()
  }, [initialURL, searchURL, currentSearch, page])

  return (
    
    <div style={{ paddingTop: '5rem', minHeight: "100vh", backgroundColor: '#F2F0ED' }}>

      <Animation imgSrc={paint} imgName='paint' />

      <Search search={() => { search(input) }} setInput={setInput} isLoading={isLoading} setIsLoading={setIsLoading}/>
      <div className="pictures">
        {
          photos && photos.map(photo => (
            <Picture photo={photo} key={photo.id} />
          ))
        }
      </div>
      <div className="morePicture">
        <Button variant="contained" onClick={morePicture} color="second-color" sx={{ lineHeight: 0, color: "#fff" }} >view more...</Button>
      </div>
    </div>
  );
};

export default PhotoResearch;
