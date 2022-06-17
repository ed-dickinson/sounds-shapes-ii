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
}

const hUpdater = (path) => {
  let reverse_path = path.sort((a, b)=>{return b.x - a.x})
  let path_i = 0
  let path_count = path.filter(point => {return point !== undefined}).length
  
  reverse_path.forEach(point => {
    let i2 = path_i < path_count / 2 ? path_i * 4 : (path_count - path_i - 1) * 4

    let original_point = path.find(n=>{return n.x === point.x})
    original_point.h = i2

    let adjusted_y = point.y + point.h
    path_i++
  })
}

const mouseMove = () => {

  click.mousemoved = true

  let time_at_this_point = new Date().getTime()
  click.path[event.x] = {x: event.x, y: event.y, h: 0}
  hUpdater(click.path)
  current_shape.updateShape(click.path)
  if (!click.on_shape && !click.created_shape) {

    click.created_shape = true
  }
  time_at_last_point = new Date().getTime()
}

let time_at_last_point = null

const mouseDown = () => {
  if (event.path[0].classList.contains('path')) { // if click on existing shape
    click.on_shape = true
    click.path = current_shape.path
  } else {
    click.on_shape = false
    current_shape = createShape()
    console.log(current_shape)
  }
  time_at_last_point = new Date().getTime()
  console.log(time_at_last_point)
  click.mousedown = { x: event.x, y: event.y }
  document.addEventListener('mousemove', mouseMove)
  document.addEventListener('mouseup', mouseUp)
}

dom.container.addEventListener('mousedown', mouseDown)

// shape constructor

function Shape(path) {

  this.path = path
  this.dom = dom.cloner.cloneNode(true)
  dom.container.appendChild(this.dom)
  this.dom.setAttribute('viewBox', `0 0 ${container.offsetWidth} ${container.offsetHeight}`)


  this.colour = shapes.length === 0 ? 1 : shapes[shapes.length-1].colour === 6 ? 1 : shapes[shapes.length-1].colour + 1
  this.dom.children[0].setAttribute('fill', `url(#grad${this.colour})`)

  this.updateShape = (path) => {

    this.path = path
    console.log(path)

    let sorted_path = path.sort((a, b)=>{return a.x - b.x})

    let path_string = ''
    let path_length = 0
    sorted_path.forEach(point => {
      if (path_string === '') {
        path_string = `M ${point.x} ${point.y} `
      } else {
        path_string += `L ${point.x} ${point.y} `
      }
      path_length++
    })
    let reverse_path = path.sort ((a, b)=>{return b.x - a.x})
    let path_i = 0
    // reverse_path.forEach(point => {
    //   let i2 = path_i < path_length / 2 ? path_i * 4 : (path_length - path_i - 1) * 4
    //   console.log(this.path)
    //
    //   let original_point = path.find(n=>{return n.x === point.x})
    //   original_point.h = i2
    //
    //   let adjusted_y = point.y + point.h
    //   path_string += `L ${point.x} ${adjusted_y} `
    //   path_i++
    // })
    reverse_path.forEach(point => {
      let adjusted_y = point.y + point.h
      path_string += `L ${point.x} ${adjusted_y} `
      path_i++
    })
    // reverse_path.forEach(point => {
    //   let adjusted_y = point.y + point.h
    //   path_string += `L ${point.x} ${adjusted_y} `
    //   path_i++
    // })
    path_string += 'Z'
    this.dom.children[0].setAttribute('d', path_string)
  }
}


// new Shape()
