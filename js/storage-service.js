'use strict'

function saveProject() {
    const textInput = document.getElementById('textInput')
    const strokeColorPicker = document.getElementById('strokeColorPicker')
    const fillColorPicker = document.getElementById('fillColorPicker')
    const fontSelect = document.querySelector('.font-text')

    if (!textInput || !strokeColorPicker || !fillColorPicker || !fontSelect) {
        console.error('One or more elements are missing!');
        return
    }

    const projectData = {
        text: textInput.value,
        canvasData: myCanvas.toDataURL(), 
        strokeColor: strokeColorPicker.value,
        fillColor: fillColorPicker.value,
        font: fontSelect.value, 
    }

    localStorage.setItem('projectData', JSON.stringify(projectData))
}


function loadProject() {
    const savedProject = localStorage.getItem('projectData')
    if (savedProject) {
        const projectData = JSON.parse(savedProject)
        
        document.getElementById('textInput').value = projectData.text
        const img = new Image()
        img.src = projectData.canvasData
        img.onload = () => {
            const ctx = myCanvas.getContext('2d')
            ctx.drawImage(img, 0, 0)
        }
        document.getElementById('strokeColorPicker').value = projectData.strokeColor
        document.getElementById('fillColorPicker').value = projectData.fillColor
        document.querySelector('.font-text').value = projectData.font

        renderMeme()
    }
}

