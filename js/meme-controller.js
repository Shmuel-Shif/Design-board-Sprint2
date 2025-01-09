'use strict'

let currentImageData = null
let savedImages = []
var gImgs
var memeService

function onInit() {
    const canvas = document.querySelector('canvas')
    if (canvas) {
        canvas.addEventListener('click', onCanvasClick)
    }
    
    const fileInput = document.getElementById('fileInput')
    fileInput.addEventListener('change', loadImage) 

    const textInput = document.getElementById('textInput')
    textInput.addEventListener('input', onTextChange)

    document.querySelector('a[href="#gallery"]').addEventListener('click', () => {
        renderGallery()
    })

    document.querySelector('a[href="#editor"]').addEventListener('click', () => {
        showEditor()
        renderSavedImages()
    })

    loadProject() 
    setupDragAndDrop()
    renderEmojis()
    renderMeme()
}

function renderMeme() {
    const meme = memeService.getMeme()
    const img = gImgs.find(image => image.id === meme.selectedImgId)

    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')

    const image = new Image()
    image.src = img.url

    image.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

        meme.lines.forEach((line, idx) => {
            ctx.font = `${line.size}px ${line.font || 'Arial'}`

            if (line.yPos === undefined) {
                line.yPos = (idx === meme.lines.length - 1) 
                    ? canvas.height - 50 - line.size 
                    : 50 + (line.size + 20) * idx
            }

            if (line.x === undefined) {
                if (line.align === 'left') {
                    line.x = 0
                } else if (line.align === 'right') {
                    line.x = canvas.width - ctx.measureText(line.txt).width
                } else { 
                    line.x = (canvas.width - ctx.measureText(line.txt).width) / 2
                }
            }

            ctx.fillStyle = line.color
            ctx.fillText(line.txt, line.x, line.yPos)
            
            ctx.strokeStyle = line.strokeColor
            ctx.lineWidth = 0.5
            ctx.strokeText(line.txt, line.x, line.yPos)

            if (idx === meme.selectedLineIdx) {
                ctx.strokeStyle = 'black'
                ctx.lineWidth = 1
                ctx.strokeRect(
                    line.x - 5,
                    line.yPos - line.size - 5,
                    ctx.measureText(line.txt).width + 10,
                    line.size + 10
                )
            }

            if (line.txt.match(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u)) {
                ctx.fillText(line.txt, line.x, line.yPos)
                ctx.strokeText(line.txt, line.x, line.yPos)
            }
        })
        saveProject()
    }
}

function onImgSelect(imgId) {
    memeService.setImg(imgId)
    saveProject()
    renderMeme()
}

function onAddLine() {
    memeService.addLine()
    console.log(memeService.getMeme().lines)
    saveProject()
    renderMeme()
} 

function onTextChange(event) {
    const newText = event.target.value
    memeService.setLineTxt(newText)
    saveProject()
    renderMeme()
}

function onSetFillColor(color) {
    memeService.setLineFillColor(color)
    saveProject()
    renderMeme()
}

function onSetStrokeColor(color) {
    memeService.setLineStrokeColor(color)
    saveProject()
    renderMeme()
}

function onDeleteLine() {
    memeService.deleteLine()
    saveProject()
    renderMeme()
}

function onSwitchLine() {
    memeService.switchLine()
    saveProject()
    renderMeme()
}

function onChangeFontSize(delta) {
    memeService.changeFontSize(delta)
    renderMeme()
    saveProject()
}

function onChangeFontFamily(font) {
    memeService.setLineFontFamily(font)
    saveProject()
    renderMeme()
}

function onCanvasClick(event) {
    const meme = memeService.getMeme()
    const canvas = document.querySelector('canvas')
    if (!canvas) return
    
    const mouseX = event.offsetX
    const mouseY = event.offsetY
    
    console.log(`Mouse clicked at: X=${mouseX}, Y=${mouseY}`)

    meme.lines.forEach((line, idx) => {
        const textWidth = line.textWidth
        const textHeight = line.textHeight

        const x = line.x
        const y = line.yPos

        console.log(`Checking line ${idx}: X=${x}, Y=${y}, Width=${textWidth}, Height=${textHeight}`)

        if (mouseX >= x && mouseX <= x + textWidth &&
            mouseY >= y - textHeight && mouseY <= y) {
            meme.selectedLineIdx = idx;
            updateEditor(meme.lines[idx])
            renderMeme()
        }
    })
    saveProject()
}

function onAlignLeft() {
    const meme = memeService.getMeme()
    const selectedLine = meme.lines[meme.selectedLineIdx]

    selectedLine.x = 0
    saveProject()
    renderMeme()
}

function onAlignRight() {
    const meme = memeService.getMeme()
    const selectedLine = meme.lines[meme.selectedLineIdx]

    const canvas = document.querySelector('canvas')
    selectedLine.x = canvas.width - selectedLine.textWidth
    saveProject()
    renderMeme()
}

function onAlignCenter() {
    const meme = memeService.getMeme()
    const selectedLine = meme.lines[meme.selectedLineIdx]

    const canvas = document.querySelector('canvas')
    selectedLine.x = (canvas.width - selectedLine.textWidth) / 2
    renderMeme()
    saveProject()
}

function onSaveImage() {
    const canvas = document.getElementById('myCanvas')
    const imageUrl = canvas.toDataURL("image/png")
    
    savedImages.push(imageUrl)
    console.log('Image saved:', imageUrl)
    renderSavedImages()
    saveProject()
}

function onImageClick(imageSrc) {
    const canvas = document.getElementById('myCanvas')
    const ctx = canvas.getContext('2d')

    const img = new Image()
    img.src = imageSrc

    img.onload = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    }
    saveProject()
}

function onEditImage() {
    const canvas = document.getElementById('myCanvas')
    const ctx = canvas.getContext('2d')

    if (currentImageData) {
        ctx.putImageData(currentImageData, 0, 0)
    }
    saveProject()
}


