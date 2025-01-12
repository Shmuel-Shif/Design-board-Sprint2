'use strict'

var gImgs = [
  {id: 1, url: 'img/1.jpg', keywords: ['funny', 'pet']},
  {id: 2, url: 'img/2.jpg', keywords: ['funny', 'pet']},
  {id: 3, url: 'img/3.jpg', keywords: ['happy', 'pet']},
  {id: 4, url: 'img/4.jpg', keywords: ['funny', 'pet']},
  {id: 5, url: 'img/5.jpg', keywords: ['happy', 'pet']},
  {id: 6, url: 'img/6.jpg', keywords: ['cute', 'pet']},
  {id: 7, url: 'img/7.jpg', keywords: ['cute', 'pet']},
  {id: 8, url: 'img/8.jpg', keywords: ['cute', 'pet']},
  {id: 9, url: 'img/9.jpg', keywords: ['happy', 'pet']},
  {id: 10, url: 'img/10.jpg', keywords: ['cute', 'pet']},
  {id: 11, url: 'img/11.jpg', keywords: ['smile', 'pet']},
  {id: 12, url: 'img/12.jpg', keywords: ['smile', 'pet']},
  {id: 13, url: 'img/13.jpg', keywords: ['smile', 'pet']},
  {id: 14, url: 'img/14.jpg', keywords: ['family', 'pet']},
  {id: 15, url: 'img/15.jpg', keywords: ['family', 'pet']},
  {id: 16, url: 'img/16.jpg', keywords: ['play', 'pet']},
  {id: 17, url: 'img/17.jpg', keywords: ['play', 'pet']},
  {id: 18, url: 'img/18.jpg', keywords: ['play', 'pet']}
]

let keywordPopularity = {
  funny: 1,
  cute: 1,
  smile: 1,
  family: 1,
  play: 1,
  happy: 1,
  All: 0,
}

function renderGallery() {
    closeEditor()
    const galleryContainer = document.querySelector('#gallery')
    galleryContainer.innerHTML = ''
    renderKeywords()
    renderUploadButton(galleryContainer)
  
    gImgs.forEach(img => {
        const imgElement = document.createElement('img')
        imgElement.src = img.url;
        imgElement.alt = 'Gallery Image'
        imgElement.style.width = '150px'
        imgElement.style.margin = '10px'
  
        imgElement.addEventListener('click', () => {
            onImgSelect(img.id)
            closeGallery()
        })
  
        galleryContainer.appendChild(imgElement)
    })
  
    document.querySelector('.box-gallery').style.display = 'block'
    saveProject()
}
  
function renderFilteredGallery(keyword) {
    const galleryContainer = document.querySelector('#gallery')
    galleryContainer.innerHTML = ''
  
    renderUploadButton(galleryContainer)
  
    const filteredImages = gImgs.filter(img => img.keywords.includes(keyword))
  
    filteredImages.forEach(img => {
        const imgElement = document.createElement('img')
        imgElement.src = img.url;
        imgElement.alt = 'Filtered Image'
        imgElement.style.width = '150px'
        imgElement.style.margin = '10px'
  
        imgElement.addEventListener('click', () => {
            onImgSelect(img.id)
            closeGallery()
        })
  
        galleryContainer.appendChild(imgElement);
    })
}

function renderKeywords() {
  const keywordsContainer = document.querySelector('#keywords')
  keywordsContainer.innerHTML = ''

  const allElem = document.createElement('span')
  allElem.textContent = 'All'
  allElem.style.fontSize = '20px'
  allElem.style.margin = '10px'
  allElem.style.cursor = 'pointer'
  allElem.addEventListener('click', () => {
      renderGallery()
  })
  keywordsContainer.appendChild(allElem)

  Object.keys(keywordPopularity).forEach(keyword => {
      if (keyword !== 'All') {
          const keywordElem = document.createElement('span')
          keywordElem.textContent = keyword

          const size = keywordPopularity[keyword] + 15
          keywordElem.style.fontSize = `${size}px`
          keywordElem.style.margin = '10px'
          keywordElem.style.cursor = 'pointer'

          keywordElem.addEventListener('click', () => {
              keywordPopularity[keyword]++
              renderFilteredGallery(keyword)
              renderKeywords()
              saveProject()
          })

          keywordsContainer.appendChild(keywordElem)
      }
  })
}

function renderSavedImages() {
  const savedImagesContainer = document.getElementById('saved-images')
  if (!savedImagesContainer) {
      console.error('Saved images container not found')
      return
  }

  savedImagesContainer.innerHTML = ''

  savedImages.forEach((imageUrl, idx) => {
      const imgElement = document.createElement('img')
      imgElement.src = imageUrl
      imgElement.alt = `Saved image ${idx + 1}`
      imgElement.style.width = '150px'
      imgElement.style.margin = '10px'

      imgElement.addEventListener('click', () => onImageClick(imageUrl))

      savedImagesContainer.appendChild(imgElement)
  })
}

function renderUploadButton(container) {
    const uploadLabel = document.createElement('label')
    uploadLabel.classList.add('upload-btn')
    uploadLabel.textContent = '+'
    
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = 'image/*'
    fileInput.hidden = true

    fileInput.addEventListener('change', (event) => {
        loadImage(event)
        closeGallery() 
    })
  
    uploadLabel.appendChild(fileInput)
    container.appendChild(uploadLabel)
}
