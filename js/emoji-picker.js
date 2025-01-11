'use strict'

const emojis = ['😜', '😍', '😂', '🤣', '😎', '😊', '😢', '😡', '🥳', '🤩', '🤔', '🙄', '😴', '👍', '👎']
let currentStartIndex = 0

function renderEmojis() {
    const emojiContainer = document.getElementById('emoji-container')
    emojiContainer.innerHTML = ''

    const visibleEmojis = emojis.slice(currentStartIndex, currentStartIndex + 3)
    visibleEmojis.forEach(emoji => {
        const button = document.createElement('button')
        button.textContent = emoji
        button.onclick = () => addSticker(emoji)
        emojiContainer.appendChild(button)
    })

    document.getElementById('prev-btn').style.visibility =
     currentStartIndex === 0 ? 'hidden' : 'visible'
    document.getElementById('next-btn').style.visibility =
     currentStartIndex + 3 >= emojis.length ? 'hidden' : 'visible'

     saveProject()
}

function prevEmojis() {
    if (currentStartIndex > 0) {
        currentStartIndex -= 3
        renderEmojis()
    }
    saveProject()
}

function nextEmojis() {
    if (currentStartIndex + 3 < emojis.length) {
        currentStartIndex += 3
        renderEmojis()
    }
    saveProject()
}

function addSticker(emoji) {
    const meme = memeService.getMeme()

    meme.lines.push({
        txt: emoji,
        x: undefined, 
        yPos: undefined, 
        size: 48,
        align: 'center', 
        color: 'black',
        strokeColor: 'white', 
        font: 'Arial',
})

    onRenderMeme()
    saveProject()
}