
let currentsong=new Audio()
let songs

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getsongs(){
    
    let a = await fetch("/songs/")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split('/songs/')[1])
        }
    }
    return songs
}

const playmusic=(TRACK,pause=false)=>{
    //let audio=new Audio("songs/" + TRACK)
    currentsong.src="songs/" +TRACK
    
    if(!pause){
    currentsong.play()
    
    }
    document.querySelector(".songinfo").innerHTML=decodeURI(TRACK)
    document.querySelector(".songtime").innerHTML="00:00 / 00:00"
    
}
  async function main(){


    //get list of all songs
     songs=await getsongs()
    playmusic(songs[0],true)
   

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> 
        
        
                            <img class=" invert"src="music.svg" alt="" srcset="">
                            <div class="info">
                                <div>${song.replaceAll("%20"," ")}</div>
                                <div>An Master</div>
                            </div>
                            <div class="playnow">
                                <span>PLay Now</span>
                                <img class=" invert" src="play.svg" alt="">
                            </div>
                        
        
        
         </li>`;
    }
    //attach event listioner 

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener('click', element=>{
            
        console.log(e.querySelector(".info").firstElementChild.innerHTML)
        playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        
    })
    })
    //attach an event listener to play,next and previous

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "play.svg"
        }
    })
    
  

  //listen for timeupdate
  currentsong.addEventListener("timeupdate",()=>{
    console.log(currentsong.currentTime,currentsong.duration);
    document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`
    document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";

})

document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = ((currentsong.duration) * percent) / 100
})

document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0"
})

document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%"
})

// Add an event listener to previous
previous.addEventListener("click", () => {
    currentsong.pause()
    console.log("Previous clicked")
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    if ((index - 1) >= 0) {
        playmusic(songs[index - 1])
    }
})

// Add an event listener to next
next.addEventListener("click", () => {
    currentsong.pause()
    console.log("Next clicked")

    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    if ((index + 1) < songs.length) {
        playmusic(songs[index + 1])
    }
})

document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    console.log("Setting volume to", e.target.value, "/ 100")
    currentsong.volume = parseInt(e.target.value) / 100
    if (currentsong.volume >0){
        document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
    }
})



document.querySelector(".volume>img").addEventListener("click", e=>{ 
    if(e.target.src.includes("volume.svg")){
        e.target.src = e.target.src.replace("volume.svg", "mute.svg")
        currentsong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    }
    else{
        e.target.src = e.target.src.replace("mute.svg", "volume.svg")
        currentsong.volume = .10;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
    }

})

  }

  main()



