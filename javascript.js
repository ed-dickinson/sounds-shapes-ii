let dom = {
  container : document.querySelector('#container'),
  cloner : document.querySelector('#cloner .shape')
}

let click = {
  path : [],
  direction : null,
  mousedown : null,
  mousemoved : false
}

let shapes = []

const mouseUp = () => {
  document.removeEventListener('mouseup', mouseUp)
  document.removeEventListener('mousemove', mouseMove)

  if (click.mousemoved) {
    let new_shape = new Shape(click.path)
    shapes.push(new_shape)
  }

  //reset path
  click.path = []
  click.mousemoved = false
}

const mouseMove = () => {

  click.mousemoved = true
  click.path.push({x: event.x, y: event.y})
  // click.path[event.x] = event.y
  // console.log('mousemove:', event.x, event.y)
}

const mouseDown = () => {
  console.log(event.path[0].classList.contains('path'))
  click.mousedown = { x: event.x, y: event.y }
  document.addEventListener('mousemove', mouseMove)
  document.addEventListener('mouseup', mouseUp)
}

dom.container.addEventListener('mousedown', mouseDown)

function Shape(path) {

  this.dom = dom.cloner.cloneNode(true)
  dom.container.appendChild(this.dom)
  this.dom.setAttribute('viewBox', `0 0 ${container.offsetWidth} ${container.offsetHeight}`)
  path.sort((a, b)=>{return a.x - b.x})
  this.path = path
  let path_string = ''
  path.forEach(point => {
    if (path_string === '') {
      path_string = `M ${point.x} ${point.y} `
    } else {
      path_string += `L ${point.x} ${point.y} `
    }
  })
  let reverse_path = path.sort ((a, b)=>{return b.x - a.x})
  for (let i = 0; i < reverse_path.length; i++) {
    let point = reverse_path[i]
    let i2 = i < reverse_path.length / 2 ? i * 4 : (reverse_path.length - i - 1) * 4
    let adjusted_y = point.y + i2
    path_string += `L ${point.x} ${adjusted_y} `
  }
  path += 'Z'
  this.dom.children[0].setAttribute('d', path_string)

  this.colour = shapes.length === 0 ? 1 : shapes[shapes.length-1].colour === 6 ? 1 : shapes[shapes.length-1].colour + 1
  this.dom.children[0].setAttribute('fill', `url(#grad${this.colour})`)
}


// new Shape()
