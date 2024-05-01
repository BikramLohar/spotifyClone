console.log("write js");
let currentsong = new Audio();
let songs;
let currfolder;

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

async function getsongs(folder) {
    currfolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let response = await a.text();
    //console.log(response)
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchor = div.getElementsByTagName("a");
    // console.log(anchor)
    songs = []
    for (let index = 0; index < anchor.length; index++) {
        const element = anchor[index];

        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }

    }
    let songsul = document.querySelector(".songslist").getElementsByTagName("ul")[0];
    songsul.innerHTML = ""

    //show all song in playlist
    for (const song of songs) {
        //  songsul.innerHTML = songsul.innerHTML + song;

        songsul.innerHTML = songsul.innerHTML + `<li> 
                            <img class="invert" src="images/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Bikufy</div>
                            </div>
                            <div class="playnow ">
                                <span>play Now</span>
                                <img class="invert" src="images/play.svg" alt="">
                            </div> </li>`;
    }
    //attach eventlistener playing listed songs
    Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach(element => {

        element.addEventListener("click", ele => {
            //console.log(element.querySelector(".info").getElementsByTagName("div")[0].innerHTML)

            playmusic(element.querySelector(".info").getElementsByTagName("div")[0].innerHTML.trim())



        })


    })

    return songs;
    //console.log(songs)
}

const playmusic = (track, pause = false) => {
    //  let audio = new Audio("/songs/" + track)

    currentsong.src = (`/${currfolder}/` + track);
    if (!pause) {
        currentsong.play();
        play.src = "images/pause.svg";
    }


    document.querySelector(".songinfo").innerHTML = track;
    // document.querySelector(".songtime").innerHTML = "00.00/00.00"


}

// async function displayalbums(){
//     let a = await fetch(`http://127.0.0.1:5500/songs/`);
//     let response = await a.text();
//     //console.log(response)
//     let div = document.createElement("div");
//     div.innerHTML = response;
//     let allanchor=document.getElementsByTagName("a");
//     console.log(allanchor)
// }


//     // console.log(allanchor)

//      console.log(div)
// }


async function main() {
    //get the list of the songs
    await getsongs("songs/english")
    playmusic(songs[0].replaceAll("%20", " "), true)

    // console.log(mp3)


    //attach event listener in buttons
    play.addEventListener("click", () => {

        if (currentsong.paused) {
            currentsong.play();
            play.src = "images/pause.svg";
        }
        else {
            currentsong.pause();
            play.src = "images/play.svg";
        }
    })

    //timeupdate

    currentsong.addEventListener("timeupdate", () => {
        console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })

    //add eventlistener seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        //storing the clickbale value in varriable
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;

        //  circle move
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = (currentsong.duration) * percent / 100;
    })

    //add eventlistener in hamburger

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })
    //add eventlistener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%";
    })

    //add event listner for previous 
    previous.addEventListener("click", () => {
        //console.log("previous is clicked");
        // currentsong.pause()
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);

        if ((index - 1) >= 0) {
            playmusic(songs[index - 1].replaceAll("%20", " "))
        }

    })
    //add event listner for previous 
    next.addEventListener("click", () => {
        // console.log("next clicked");

        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        //console.log(currentsong.src.split("/").slice(-1)[0]);

        //console.log(mp3,index)

        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1].replaceAll("%20", " "))

        }



    })
    //add event listener in volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        // console.log(e,e.target,e.target.value)
        currentsong.volume = parseInt(e.target.value) / 100;
    })

    //load the play library when card is clicked

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        //  console.log(e)
        e.addEventListener("click", async item => {
            // console.log(item.target,item.currentTarget.dataset)
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
            playmusic(songs[0].replaceAll("%20", " "))
            document.querySelector(".left").style.left = "0";

        })
    })

    document.querySelector(".volume>img").addEventListener("click", e => {
        // console.log(e.target)
        //console.log(e.target.src)

        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentsong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })

    

}
main();
//getsongs();