'use strict'

var memeService = {
    gMeme: {
        selectedImgId: 4,
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
        const meme = this.gMeme
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

function downloadMeme() {
    const canvas = document.querySelector('canvas')
    const imageUrl = canvas.toDataURL()

    const link = document.createElement('a')
    link.href = imageUrl;
    link.download = 'meme.png'
    link.click()
}

function openStrokeColorPicker() {
    const strokeColorPicker = document.getElementById('strokeColorPicker')
    strokeColorPicker.click()
}

function openFillColorPicker() {
    const fillColorPicker = document.getElementById('fillColorPicker')
    fillColorPicker.click()
}

function setTextStrokeColor() {
    const strokeColorPicker = document.getElementById('strokeColorPicker')
    const selectedStrokeColor = strokeColorPicker.value
    memeService.setLineStrokeColor(selectedStrokeColor)
    renderMeme()
}

function setTextFillColor() {
    const fillColorPicker = document.getElementById('fillColorPicker')
    const selectedFillColor = fillColorPicker.value
    memeService.setLineFillColor(selectedFillColor)
    renderMeme()
}

function increaseFontSize() {
    const meme = memeService.getMeme()
    const line = meme.lines[meme.selectedLineIdx]
    line.size += 2
    renderMeme()
}

function decreaseFontSize() {
    const meme = memeService.getMeme()
    const line = meme.lines[meme.selectedLineIdx]
    line.size -= 2
    renderMeme()
}

function switchLine() {
    const meme = memeService.getMeme()
    let newSelectedLineIdx = meme.selectedLineIdx + 1
    
    if (newSelectedLineIdx >= meme.lines.length) {
        newSelectedLineIdx = 0
    }

    meme.selectedLineIdx = newSelectedLineIdx
    renderMeme()
}

function updateEditor(selectedLine) {
    const textInput = document.getElementById('textInput')
    textInput.value = selectedLine.txt 
    
    document.getElementById('strokeColorPicker').value = selectedLine.strokeColor
    document.getElementById('fillColorPicker').value = selectedLine.color
}

function getTextWidth(line) {
    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')
    ctx.font = `${line.size}px ${line.font || 'Arial'}`
    return ctx.measureText(line.txt).width
}
