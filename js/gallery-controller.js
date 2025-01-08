'use strict'

var gImgs = [
    {id: 1, url: 'img/1.jpg', keywords: ['funny', 'cat', ]},
    {id: 2, url: 'img/2.jpg', keywords: ['dog', 'cute', ]},
    {id: 3, url: 'img/3.jpg', keywords: ['smile', 'playful']},
    {id: 4, url: 'img/4.jpg', keywords: ['funny', 'pet']},
    {id: 5, url: 'img/5.jpg', keywords: ['joyful', 'canine']},
    {id: 6, url: 'img/6.jpg', keywords: ['adorable', 'tail']},
    {id: 7, url: 'img/7.jpg', keywords: ['funny', 'love']},
    {id: 8, url: 'img/8.jpg', keywords: ['playful', 'cheerful']},
    {id: 9, url: 'img/9.jpg', keywords: ['happy', 'family']},
    {id: 10, url: 'img/10.jpg', keywords: ['joy', 'laughter']},
    {id: 11, url: 'img/11.jpg', keywords: ['puppy', 'sleepy']},
    {id: 12, url: 'img/12.jpg', keywords: ['funny', 'playful']},
    {id: 13, url: 'img/13.jpg', keywords: ['joyful', 'tail']},
    {id: 14, url: 'img/14.jpg', keywords: ['bark', 'adventure']},
    {id: 15, url: 'img/15.jpg', keywords: ['tail', 'doggy']},
    {id: 16, url: 'img/16.jpg', keywords: ['smile', 'play']},
    {id: 17, url: 'img/17.jpg', keywords: ['wag', 'sunny']},
    {id: 18, url: 'img/18.jpg', keywords: ['fetch', 'active']}
  ]
  

  function renderGallery() {
    const galleryContainer = document.querySelector('.gallery-container')
    galleryContainer.innerHTML = ''
    
    const imagesToShow = gImgs.slice(0, 18)
    imagesToShow.forEach(img => {
      const imgElement = document.createElement('img')
      imgElement.src = img.url
      imgElement.alt = 'Gallery Image'
      
      imgElement.addEventListener('click', () => {
        onImgSelect(img.id)
      })
      galleryContainer.appendChild(imgElement);
    })
    

    document.getElementById('gallery').style.display = 'block' 
  }
  
  
function onImgSelect(imgId) {
    memeService.setImg(imgId)
    renderMeme()
}
  