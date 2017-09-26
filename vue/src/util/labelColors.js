var colorList = [
  { color: 'black', used: false },
  { color: 'red', used: false },
  { color: 'orange', used: false },
  { color: 'green', used: false },
  { color: 'purple', used: false },
  { color: 'blue', used: false },
  { color: 'MediumAquaMarine', used: false },
  { color: 'MediumVioletRed', used: false },
  { color: 'YellowGreen', used: false },
  { color: 'DarkKhaki', used: false },
  { color: 'DarkRed', used: false },
  { color: 'pink', used: false },
  { color: 'DarkOliveGreen', used: false },
  { color: 'CornflowerBlue', used: false },
  { color: 'Navy', used: false }
]

export function getLabelColor () {
  for (let i = 0; i < colorList.length; i++) {
    if (!colorList[i].used) {
      colorList[i].used = true
      return colorList[i].color
    }
  }
  return colorList[0].color
}

export function returnLabelColor (color) {
  for (let i = 0; i < colorList.length; i++) {
    if (colorList[i].color === color) {
      colorList[i].used = false
      return
    }
  }
}

export function clearLabelColor () {
  for (let i = 0; i < colorList.length; i++) {
    colorList[i].used = false
  }
}

