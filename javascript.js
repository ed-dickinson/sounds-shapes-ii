let dom = {
  container : document.querySelector('#container'),
  cloner : document.querySelector('#cloner .shapes'),
  svg : document.querySelector('#container .shapes')
}

let click = {
  path : [],
  direction : null,
  mousedown : null,
  mousemoved : false,
  created_shape : false,
  on_shape : false,
  drawing_y_or_h : null
}

let dom_directory = {}

let current_shape = undefined

let shapes = []

const createShape = () => {
  let new_shape = new Shape(click.path)
  shapes.push(new_shape)
  new_shape.dom.object = new_shape
  new_shape.dom.addEventListener('mousedown', () => {
    current_shape = new_shape.dom.object
  })
  return new_shape
}

const mouseUp = () => {
  document.removeEventListener('mouseup', mouseUp)
  document.removeEventListener('mousemove', mouseMove)

  //reset path
  click.path = []
  click.mousemoved = false
  click.created_shape = false
  click.drawing_y_or_h = null
}

const hUpdater = (path) => {
  let reverse_path = path.sort((a, b)=>{return b.x - a.x})
  let path_i = 0
  let path_count = path.filter(point => {return point !== undefined}).length

  reverse_path.forEach(point => {
    let i2 = path_i < path_count / 2 ? path_i * 4 : (path_count - path_i - 1) * 4

    let original_point = path.find(n=>{return (n.x === point.x) && (n.y === point.y)})
    original_point.h = i2

    let adjusted_y = point.y + point.h
    path_i++
  })
}

const mouseMove = () => {

  click.mousemoved = true


  // console.log(event.x)
  if (click.on_shape) {

    if (click.path[event.x]) {
      click.path[event.x].x = event.x
      click.path[event.x].y = event.y
    } else {
      click.path[event.x] = click.drawing_y_or_h === 'y'
        ? {x: event.x, y: event.y, h: null}
        : {x: event.x, y: null, h: event.y}
    }
    current_shape.updateShape(click.path)

  } else {
    if (click.path[event.x] === undefined) {
      click.path[event.x] = {x: event.x, y: event.y, h: null}
    }
    hUpdater(click.path)
    current_shape.updateShape(click.path)
  }

  if (!click.on_shape && !click.created_shape) {

    click.created_shape = true
  }
}

const findClosestSide = (x, y) => {
  // find closest point
  let path_point = click.path.find(point=>{return point === undefined ? undefined : point.x === x})
  let ppi = 0
  while (path_point === undefined || path_point.h === 0) {
    ppi++
    path_point = click.path.find(n=>{return n === undefined ? undefined : n.x === x + ppi})
    //check in other direction
    if (path_point === undefined || path_point.h === 0) {
      path_point = click.path.find(n=>{return n === undefined ? undefined : n.x === x - ppi})
    }
  }
  let output = y > path_point.y + (path_point.h / 2) ? 'h' : 'y'
  return output
}


const mouseDown = () => {
  if (event.path[0].classList.contains('path')) { // if click on existing shape
    click.on_shape = true
    click.path = current_shape.path
    click.drawing_y_or_h = findClosestSide(event.x, event.y)
    console.log(click.drawing_y_or_h)
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

// shape constructor

function Shape(path) {

  this.path = path

  this.dom = dom.svg.children[0].cloneNode(true)
  // this.dom = document.createElement('path')
  dom.svg.appendChild(this.dom)
  dom.svg.setAttribute('viewBox', `0 0 ${container.offsetWidth} ${container.offsetHeight}`)
  this.dom.classList.add('path')

  this.colour = shapes.length === 0 ? 1 : shapes[shapes.length-1].colour === 6 ? 1 : shapes[shapes.length-1].colour + 1
  this.dom.setAttribute('fill', `url(#grad${this.colour})`)

  this.dom.addEventListener('mousedown', () => {console.log(this)})

  this.updateShape = (path) => {

    this.path = path

    let sorted_path = this.path.sort((a, b)=>{return a.x - b.x})

    let path_string = ''
    let path_length = 0
    sorted_path.forEach(point => {
      if (path_string === '') {
        path_string = `M ${point.x} ${point.y} `
      } else {
        if (point.y === null) return
        path_string += `L ${point.x} ${point.y} `
      }
      path_length++
    })
    let reverse_path = this.path.sort ((a, b)=>{return b.x - a.x})
    let path_i = 0

    reverse_path.forEach(point => {
      if (point.h === null) return

      let adjusted_y = point.y + point.h
      path_string += `L ${point.x} ${adjusted_y} `
      path_i++
    })

    path_string += 'Z'
    this.dom.setAttribute('d', path_string)
  }
}


// new Shape()
