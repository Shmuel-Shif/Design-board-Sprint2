'use strict'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
let isDragging
let dragLine 
let offsetX, offsetY
let img = null
let textData = []

var memeService = {
    gMeme: {
        selectedImgId: 18,
        selectedLineIdx: 0,
        lines: [
            {
                txt: 'Your Text',
                size: 35,
                color: 'black', 
                strokeColor: 'white',
                y: 50,
            }
        ]
    },

    getMeme: function () {
        return this.gMeme
    },
    
    addLine: function () {
        const meme = this.gMeme
        const newLine = {
            txt: 'Your Text',
            size: 35,
            color: 'black',
            strokeColor: 'white',
            y: meme.lines.length * 50 + 50 
        }
        newLine.textWidth = getTextWidth(newLine)
        meme.lines.push(newLine)
        meme.selectedLineIdx = meme.lines.length - 1

        renderMeme()
        saveProject()
    },

    setLineTxt: function (newText) {
        const meme = this.gMeme
        meme.lines[meme.selectedLineIdx].txt = newText
    },

    setLineStrokeColor: function (color) {
        const meme = this.gMeme
        meme.lines[meme.selectedLineIdx].strokeColor = color
    },

    setLineFillColor: function (color) {
        const meme = this.gMeme;
        if (meme.selectedLineIdx === -1 || !meme.lines[meme.selectedLineIdx]) {
            return
        }
        meme.lines[meme.selectedLineIdx].color = color
    },
    

    setImg: function (imgId) {
        this.gMeme.selectedImgId = imgId
    },

    switchLine: function () {
        const meme = this.gMeme
        meme.selectedLineIdx = (meme.selectedLineIdx + 1) % meme.lines.length
    },
    
    deleteLine: function () {
        const meme = this.gMeme
        if (meme.lines.length === 0) return
        meme.lines.splice(meme.selectedLineIdx, 1)
        meme.selectedLineIdx = meme.lines.length ? 0 : -1
    },
    

    changeFontSize: function (delta) {
        const meme = this.gMeme
        if (meme.selectedLineIdx === -1) return
        meme.lines[meme.selectedLineIdx].size += delta
    },

    setLineFontFamily: function (font) {
        const meme = this.gMeme
        if (meme.selectedLineIdx === -1) return
        meme.lines[meme.selectedLineIdx].font = font
    }
}

function openStrokeColorPicker() {
    const strokeColorPicker = document.getElementById('strokeColorPicker')
    strokeColorPicker.click()
    saveProject()
}

function openFillColorPicker() {
    const fillColorPicker = document.getElementById('fillColorPicker')
    fillColorPicker.click()
    saveProject()
}

function setTextStrokeColor() {
    const strokeColorPicker = document.getElementById('strokeColorPicker')
    const selectedStrokeColor = strokeColorPicker.value
    memeService.setLineStrokeColor(selectedStrokeColor)
    renderMeme()
    saveProject()
}

function setTextFillColor() {
    const fillColorPicker = document.getElementById('fillColorPicker')
    const selectedFillColor = fillColorPicker.value
    memeService.setLineFillColor(selectedFillColor)
    renderMeme()
    saveProject()
}

function increaseFontSize() {
    const meme = memeService.getMeme()
    const line = meme.lines[meme.selectedLineIdx]
    line.size += 2
    renderMeme()
    saveProject()

}

function decreaseFontSize() {
    const meme = memeService.getMeme()
    const line = meme.lines[meme.selectedLineIdx]
    line.size -= 2
    renderMeme()
    saveProject()
}

function switchLine() {
    const meme = memeService.getMeme()
    let newSelectedLineIdx = meme.selectedLineIdx + 1
    
    if (newSelectedLineIdx >= meme.lines.length) {
        newSelectedLineIdx = 0
    }

    meme.selectedLineIdx = newSelectedLineIdx
    renderMeme()
    saveProject()
}

function updateEditor(selectedLine) {
    const textInput = document.getElementById('textInput')
    textInput.value = selectedLine.txt 
    
    document.getElementById('strokeColorPicker').value = selectedLine.strokeColor
    document.getElementById('fillColorPicker').value = selectedLine.color
    saveProject()
}

function getTextWidth(line) {
    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')
    ctx.font = `${line.size}px ${line.font || 'Arial'}`
    saveProject()
    return ctx.measureText(line.txt).width
}

function initDragAndDrop() {
    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')

    canvas.addEventListener('mousedown', (e) => {
        let xPos = e.offsetX
        let yPos = e.offsetY
        
        meme.lines.forEach((line, index) => {
            if (xPos >= line.x && xPos <= line.x + line.textWidth && 
                yPos >= line.yPos && yPos <= line.yPos + line.size) {

                canvas.addEventListener('mousemove', (moveEvent) => {
                    const newX = moveEvent.offsetX
                    const newY = moveEvent.offsetY


                    line.x = newX - line.textWidth / 2
                    line.yPos = newY - line.size / 2
                    renderMeme()
                })
            }
        })

            canvas.addEventListener('mouseup', () => {
            canvas.removeEventListener('mousemove', () => {})
        })
    })
    saveProject()
}

function setupDragAndDrop() {
    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')

    let isDragging = false
    let dragLine = null
    let offsetX = 0
    let offsetY = 0

    canvas.addEventListener('mousedown', (e) => {
        const meme = memeService.getMeme()
        let lineFound = false

        meme.lines.forEach((line, idx) => {
            const lineX = line.x
            const lineY = line.yPos
            const lineWidth = ctx.measureText(line.txt).width
            const lineHeight = line.size

            if (
                e.offsetX >= lineX &&
                e.offsetX <= lineX + lineWidth &&
                e.offsetY >= lineY - lineHeight &&
                e.offsetY <= lineY
            ) {
                isDragging = true
                dragLine = line
                offsetX = e.offsetX - lineX
                offsetY = e.offsetY - lineY
                meme.selectedLineIdx = idx 
                lineFound = true
            }
        })

        if (!lineFound) {
            meme.selectedLineIdx = null 
        }

        renderMeme()
        saveProject()
    })

    canvas.addEventListener('mousemove', (e) => {
        if (isDragging && dragLine) {
            dragLine.x = e.offsetX - offsetX
            dragLine.yPos = e.offsetY - offsetY
            renderMeme()
            saveProject()
        }
    })

    canvas.addEventListener('mouseup', () => {
        isDragging = false
        dragLine = null
        saveProject()
    })

    canvas.addEventListener('mouseleave', () => {
        isDragging = false
        dragLine = null
        saveProject()
    })
}

function downloadMeme() {
    const canvas = document.querySelector('canvas')
    const imageUrl = canvas.toDataURL()

    const link = document.createElement('a')
    link.href = imageUrl;
    link.download = 'meme.png'
    link.click()
}

function shareOnFacebook() {
    const urlToShare = 'https://www.example.com'
    const quote = 'Check out this content!'

    const fbShareUrl = `
    https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlToShare)}&quote=
    // ${encodeURIComponent(quote)}
     `


    window.open(fbShareUrl, 'facebook-share-dialog', 'width=800,height=600')
}

function loadImage(event) {
    const canvas = document.getElementById('myCanvas')
    const ctx = canvas.getContext('2d')

    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()

    reader.onload = function(e) {
        img = new Image()
        img.src = e.target.result

        img.onload = function() {
            
            drawImage()
        }
    }

    reader.readAsDataURL(file)
    saveProject()
}

function drawImage() {
    const canvas = document.getElementById('myCanvas')
    const ctx = canvas.getContext('2d')

    if (img) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    }
}

function drawText(txt, x, y, fontSize = 30, color = 'white') {
    const canvas = document.getElementById('myCanvas')
    const ctx = canvas.getContext('2d')

    drawImage()

    ctx.fillStyle = color;
    ctx.font = `${fontSize}px Arial`
    ctx.fillText(txt, x, y)
    saveProject()
}

function showEditor() {
    closeGallery()
    const boxEditor = document.querySelector('.box-editor')
    boxEditor.style.display = 'block'
    saveProject()
}

function closeGallery() {
    document.querySelector('.box-gallery').style.display = 'none'
}

function closeEditor() {
    document.querySelector('.box-editor').style.display = 'none'
}

function closeModal() {
    const modal = document.getElementById('image-modal')
    modal.style.display = 'none'
}

function toggleMenu() {
    document.body.classList.toggle('menu-open')
}
