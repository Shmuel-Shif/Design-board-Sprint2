'use strict'

let currentImageData = null
let selectedImageSrc = null
let savedImages = []
let isEditorOpen = false
let isGalleryOpen = false
var gImgs
var memeService

function onInit() {
    const canvas = document.querySelector('canvas')
    if (canvas) {
        canvas.addEventListener('click', onCanvasClick)
    }
    
    const textInput = document.getElementById('textInput')
    textInput.addEventListener('input', onTextChange)

    document.querySelector('a[href="#gallery"]').addEventListener('click', () => {
        document.querySelector('.container-gallery').style.display = 'block'
        renderGallery()
    })

    document.querySelector('a[href="#editor"]').addEventListener('click', () => {
    document.querySelector('.container-editor').style.display = 'block'
        showEditor()
        renderSavedImages()
    })

    document.querySelector('a[href="#about"]').addEventListener('click', () => {
        showAbout()
    })

    const menuItems = document.querySelectorAll('.main-nav > ul > li')
    menuItems.forEach(item => {
        item.addEventListener('click', toggleMenu)
    })
    loadProject()    
    loadSavedImages()
    setupDragAndDrop()
    renderEmojis()
    onRenderMeme()
}

function onRenderMeme() {
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
                if (idx === 0) { 
                    line.yPos = canvas.height - 20
                } else if (idx === 1) { 
                    line.yPos = 50
                } else { 
                    const centerY = canvas.height / 2
                    line.yPos = centerY + (idx - 2) * 1
                }
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

            if (line.x < 0) line.x = 0
            if (line.x + ctx.measureText(line.txt).width > canvas.width) {
                line.x = canvas.width - ctx.measureText(line.txt).width
            }

            if (line.y < 0) line.y = 0
            if (line.y + ctx.measureText(line.txt).width > canvas.width) {
                line.y = canvas.width - ctx.measureText(line.txt).width
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
    onRenderMeme()
}

function onAddLine() {
    memeService.addLine()
    console.log(memeService.getMeme().lines)
    saveProject()
    onRenderMeme()
} 

function onTextChange(event) {
    const newText = event.target.value
    memeService.setLineTxt(newText)
    saveProject()
    onRenderMeme()
}

function onSetFillColor(color) {
    memeService.setLineFillColor(color)
    saveProject()
    onRenderMeme()
}

function onSetStrokeColor(color) {
    memeService.setLineStrokeColor(color)
    saveProject()
    onRenderMeme()
}

function onDeleteLine() {
    memeService.deleteLine()
    saveProject()
    onRenderMeme()
}

function onSwitchLine() {
    memeService.switchLine()
    saveProject()
    onRenderMeme()
}

function onChangeFontSize(delta) {
    memeService.changeFontSize(delta)
    onRenderMeme()
    saveProject()
}

function onChangeFontFamily(font) {
    memeService.setLineFontFamily(font)
    saveProject()
    onRenderMeme()
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
            onRenderMeme()
        }
    })
    saveProject()
}

function onAlignLeft() {
    const meme = memeService.getMeme()
    const selectedLine = meme.lines[meme.selectedLineIdx]

    selectedLine.align = 'left'
    selectedLine.x = 0
    saveProject()
    onRenderMeme()
}

function onAlignRight() {
    const meme = memeService.getMeme()
    const selectedLine = meme.lines[meme.selectedLineIdx]

    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')
    ctx.font = `${selectedLine.size}px ${selectedLine.font || 'Arial'}`
    selectedLine.align = 'right'
    selectedLine.x = canvas.width - ctx.measureText(selectedLine.txt).width
    saveProject()
    onRenderMeme()
}

function onAlignCenter() {
    const meme = memeService.getMeme()
    const selectedLine = meme.lines[meme.selectedLineIdx]

    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')
    ctx.font = `${selectedLine.size}px ${selectedLine.font || 'Arial'}`
    selectedLine.align = 'center'
    selectedLine.x = (canvas.width - ctx.measureText(selectedLine.txt).width) / 2
    saveProject()
    onRenderMeme()
}

function onSaveImage() {
    const canvas = document.getElementById('myCanvas')
    const imageUrl = canvas.toDataURL("image/png")
    
    savedImages.push(imageUrl)
    console.log('Image saved:', imageUrl)
    renderSavedImages()
    saveProject()

    const notification = document.getElementById('save-notification')
    
    notification.style.display = 'block'
    setTimeout(() => {
        notification.style.opacity = 1
    }, 10)

    setTimeout(() => {
        notification.style.opacity = 0
    }, 3000)

    setTimeout(() => {
        notification.style.display = 'none'
    }, 3500)
}

function onImageClickToEdit(imageSrc) {
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

 
    if (selectedImageSrc) {
        const img = new Image()
        img.src = selectedImageSrc

        img.onload = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height)  
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)  

            currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)  // שומרים את הנתונים של התמונה
        }
    } else if (currentImageData) { 
        ctx.putImageData(currentImageData, 0, 0)
    }

    saveProject() 
    closeModal() 
    closeEditor()
}

function onImageClick(imageSrc) {
    selectedImageSrc = imageSrc
    const modal = document.getElementById('image-modal')
    modal.style.display = 'block'
}

function onDeleteImage() {
    savedImages = savedImages.filter(image => image !== selectedImageSrc)

    renderSavedImages()

    if (savedImages.length === 0) {
        const canvas = document.getElementById('myCanvas')
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height) 
    }

    closeModal()  
}
