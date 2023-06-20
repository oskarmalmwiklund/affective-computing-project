function uploadImage(){
    const ref = firebase.storage().ref()

    const file = document.querySelector("#photo").files[0]

    const name = new Date() + '-' + file.name

    const metadata = {
      contentType:file.type
    }

    const task = ref.child(name).put(file,metadata)

    task
    .then(snapshot => snapshot.ref.getDownloadURL())
    .then(url => {
      console.log(url)
      alert("Image upload successful")
      const image = document.querySelector('#image')
      image.src = url
    })

  }

  // webcam code
  const video = document.getElementById('video')
  const canvas = document.getElementById('canvas')
  const snap = document.getElementById('snap')

  const constraints = {
    audio: false,
    video: {
      width:320,height:240
    }
  }

  // Start webcam
  async function init(){
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      handleStream(stream)
    } catch(error) {
      console.log(error)
    }
  }

  function handleStream(stream){
    window.stream = stream
    video.srcObject = stream
  }

  init()