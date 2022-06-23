// const createTimeline = () => {
//   let timeline = document.createElement('div')
//   timeline.setAttribute('id', 'timeline')
//   dom.container.appendChild(timeline)
// }
//
// createTimeline()

let timeline = document.querySelector('#timeline')

console.log('safari? -','webkitAudioContext' in window)
const audioContext = 'webkitAudioContext' in window ? new webkitAudioContext() : new AudioContext();

const SAMPLE_RATE = audioContext.sampleRate;
const timeLength = 1; // measured in seconds

const buffer = audioContext.createBuffer(
  1,
  SAMPLE_RATE * timeLength,
  SAMPLE_RATE
);

let schedule_timeline = null;
const timelineFrame = () => {
  timeline.style.left = ( (audioContext.currentTime*100) % dom.container.offsetWidth ) + 'px';
}
const timelineMove = () => {
  clearInterval(schedule_timeline);
  schedule_timeline = setInterval(timelineFrame, 10);

}
timelineMove()
