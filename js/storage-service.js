'use strict'

function saveProject() {
    const memeData = JSON.stringify(memeService.getMeme())
    localStorage.setItem('memeProject', memeData)
    localStorage.setItem('savedImages', JSON.stringify(savedImages))
}

function loadProject() {
    const savedData = localStorage.getItem('memeProject')
    if (!savedData) {
        return
    }
    const meme = JSON.parse(savedData)
    memeService.gMeme = meme
    renderMeme()
}

function loadSavedImages() {
    const savedData = localStorage.getItem('savedImages')
    if (!savedData) {
        return
    }
    savedImages = JSON.parse(savedData)
    renderSavedImages()
}
