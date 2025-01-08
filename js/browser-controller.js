'use strict'

function onInit() {
    
    const textInput = document.getElementById('textInput')
    textInput.addEventListener('input', onTextChange)

    document.querySelector('a[href="#gallery"]').addEventListener('click', () => {
        renderGallery()
    })

    renderMeme()
}

function renderMeme() {
    const meme = memeService.getMeme()
    console.log('Selected Meme:', meme)

    const img = gImgs.find(image => image.id === meme.selectedImgId);
    console.log('Found Image:', img)

    if (!img) {
        console.log('Image not found!');
        return
    }

    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')
    
    const image = new Image()
    image.src = img.url
    
    image.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        
        meme.lines.forEach(line => {
            ctx.font = `${line.size}px Arial`
            ctx.fillStyle = line.color
            ctx.fillText(line.txt, 50, 50)
        })
    }
}

function onTextChange(event) {
    const newText = event.target.value
    memeService.setLineTxt(newText)
    renderMeme()
}