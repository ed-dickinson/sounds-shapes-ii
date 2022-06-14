let dom = {
  container : document.querySelector('#container'),
  cloner : document.querySelector('#cloner .shape')
}

let click = {
  path : [],
  direction : null,
  mousedown : null,
  mousemoved : false,
  created_shape : false,
  on_shape : false
}

let current_shape = undefined

let shapes = []

const createShape = () => {
  let new_shape = new Shape(click.path)
  shapes.push(new_shape)
  // new_shape.dom.addEventListener('mousedown', new_shape.updateShape())
  // return {shape: new_shape, dom: new_shape.dom}
  return new_shape
}

const mouseUp = () => {
  document.removeEventListener('mouseup', mouseUp)
  document.removeEventListener('mousemove', mouseMove)

  //reset path
  click.path = []
  click.mousemoved = false
  click.created_shape = false
}

const mouseMove = () => {

  click.mousemoved = true
  // click.path.push({x: event.x, y: event.y})
  click.path[event.x] = {x: event.x, y: event.y}
  // console.log('mousemove:', event.x, event.y)
  current_shape.updateShape(click.path)
  if (!click.on_shape && !click.created_shape) {

    console.log('created shape')
    click.created_shape = true
  }

}

const mouseDown = () => {
  if (event.path[0].classList.contains('path')) { // if click on existing shape
    click.on_shape = true
  } else {
    click.on_shape = false
    current_shape = createShape()
    console.log(current_shape)
  }
  click.mousedown = { x: event.x, y: event.y }
  document.addEventListener('mousemove', mouseMove)
  document.addEventListener('mouseup', mouseUp)
}

dom.container.addEventListener('mousedown', mouseDown)

function Shape(path) {

  this.path = path
  this.dom = dom.cloner.cloneNode(true)
  dom.container.appendChild(this.dom)
  this.dom.setAttribute('viewBox', `0 0 ${container.offsetWidth} ${container.offsetHeight}`)


  this.colour = shapes.length === 0 ? 1 : shapes[shapes.length-1].colour === 6 ? 1 : shapes[shapes.length-1].colour + 1
  this.dom.children[0].setAttribute('fill', `url(#grad${this.colour})`)

  this.updateShape = (path) => {
    console.log('updating shape', path)
    path.sort((a, b)=>{return a.x - b.x})
    this.path = path
    let path_string = ''
    let path_length = 0
    path.forEach(point => {
      if (path_string === '') {
        path_string = `M ${point.x} ${point.y} `
      } else {
        path_string += `L ${point.x} ${point.y} `
      }
      path_length++
    })
    let reverse_path = path.sort ((a, b)=>{return b.x - a.x})
    let path_i = 0
    reverse_path.forEach(point => {

      // let point = reverse_path[i]
      console.log(point)
      let i2 = path_i < path_length / 2 ? path_i * 4 : (path_length - path_i - 1) * 4
      let adjusted_y = point.y + i2
      path_string += `L ${point.x} ${adjusted_y} `
      path_i++
    })
    path += 'Z'
    this.dom.children[0].setAttribute('d', path_string)
  }
}


// new Shape()
