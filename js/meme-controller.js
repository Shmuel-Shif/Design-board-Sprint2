'use strict'

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
        renderGallery()
    })

    renderMeme()
    document.querySelector('canvas').addEventListener('click', onCanvasClick)
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

        const spaceBetweenLines = 0.2
        let yPos = 200
        const startingY = 50
        const maxY = canvas.height - 50

        meme.lines.forEach((line, idx) => {
            ctx.font = `${line.size}px ${line.font || 'Arial'}`

            if (idx === meme.lines.length - 1) {
                yPos = maxY - line.size
            } else {
                yPos = startingY + (line.size + spaceBetweenLines) * idx
            }

            line.yPos = yPos

            line.textWidth = ctx.measureText(line.txt).width
            line.textHeight = line.size

            if (line.x === undefined) {
                if (line.align === 'left') {
                    line.x = 0
                } else if (line.align === 'right') {
                    line.x = canvas.width - line.textWidth
                } else {  
                    line.x = (canvas.width - line.textWidth) / 2
                }
            }

            ctx.fillStyle = line.color
            ctx.fillText(line.txt, line.x, yPos)

            ctx.strokeStyle = line.strokeColor
            ctx.lineWidth = 0.5
            ctx.strokeText(line.txt, line.x, yPos)

            if (idx === meme.selectedLineIdx) {
                ctx.strokeStyle = 'black'
                ctx.lineWidth = 1
                
                ctx.strokeRect(
                    line.x - 5,  
                    yPos - line.textHeight - 5, 
                    line.textWidth + 10,  
                    line.textHeight + 10 
                )
            }
        })
    }
}

function onAddLine() {
    memeService.addLine()
    console.log(memeService.getMeme().lines);
    renderMeme()
} 

function onTextChange(event) {
    const newText = event.target.value
    memeService.setLineTxt(newText)
    renderMeme()
}

function onSetFillColor(color) {
    memeService.setLineFillColor(color)
    renderMeme()
}

function onSetStrokeColor(color) {
    memeService.setLineStrokeColor(color)
    renderMeme()
}

function onDeleteLine() {
    memeService.deleteLine()
    renderMeme()
}

function onSwitchLine() {
    memeService.switchLine()
    renderMeme()
}

function onChangeFontSize(delta) {
    memeService.changeFontSize(delta)
    renderMeme()
}

function onChangeFontFamily(font) {
    memeService.setLineFontFamily(font)
    renderMeme()
}

function onCanvasClick(event) {
    const meme = memeService.getMeme();
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;
    
    console.log(`Mouse clicked at: X=${mouseX}, Y=${mouseY}`);

    meme.lines.forEach((line, idx) => {
        const textWidth = line.textWidth;
        const textHeight = line.textHeight;

        const x = line.x;
        const y = line.yPos;

        console.log(`Checking line ${idx}: X=${x}, Y=${y}, Width=${textWidth}, Height=${textHeight}`);

        if (mouseX >= x && mouseX <= x + textWidth &&
            mouseY >= y - textHeight && mouseY <= y) {
            meme.selectedLineIdx = idx;
            updateEditor(meme.lines[idx]);  
            renderMeme();
        }
    });
}

function onAlignLeft() {
    const meme = memeService.getMeme()
    const selectedLine = meme.lines[meme.selectedLineIdx]

    selectedLine.x = 0
    renderMeme()
}

function onAlignRight() {
    const meme = memeService.getMeme()
    const selectedLine = meme.lines[meme.selectedLineIdx]

    const canvas = document.querySelector('canvas')
    selectedLine.x = canvas.width - selectedLine.textWidth
    renderMeme()
}

function onAlignCenter() {
    const meme = memeService.getMeme()
    const selectedLine = meme.lines[meme.selectedLineIdx]

    const canvas = document.querySelector('canvas')
    selectedLine.x = (canvas.width - selectedLine.textWidth) / 2
    renderMeme()
}


