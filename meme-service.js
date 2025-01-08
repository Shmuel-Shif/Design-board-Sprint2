'use strict'

var memeService = {
  gMeme: {
      selectedImgId: 1,
      selectedLineIdx: 0,
      lines: [
          {
              txt: 'Your Text',
              size: 20,
              color: 'red'
          }
      ]
  },

  getMeme: function () {
      return this.gMeme
  },

  setLineTxt: function (newText) {
      const meme = this.gMeme;
      meme.lines[meme.selectedLineIdx].txt = newText
  },

  setImg: function (imgId) {
      this.gMeme.selectedImgId = imgId
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
