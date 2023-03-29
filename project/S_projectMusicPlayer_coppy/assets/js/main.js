/*
    Trình tự làm: 
    1. Render songs                             |   done       
    2. Scroll top                               |   done
    3. Play/pause/seek                          |   done     
    4. CD rotate                                |   done
    5. Next/Previous                            |   done     
    6. Random                                   |   done
    7. Next/Repeat when ended                   |   done             
    8. Active Song                              |   done 
    9. Scroll active song into view             |   done             
    10. Play song when click                    |   done             
*/
const PLAYER_STORAGE_KEY = 'F8_PLAYER';
//define variables
var heading = document.querySelector('header h2');
var cdThumb = document.querySelector('.cd-thumb');
var audio = document.querySelector('#audio');
var playBtn = document.querySelector('.btn.btn-toggle-play');
var player = document.querySelector('.player');
var progress = document.querySelector('#progress');
var nextBtn = document.querySelector('.btn.btn-next');
var previousBTN = document.querySelector('.btn.btn-prev'); 
var randomBTN = document.querySelector('.btn.btn-random'); 
var repeatBTN = document.querySelector('.btn.btn-repeat');
var playList = document.querySelector('.playlist');
//main (run)
main();
//declair function
function main() {
    var app = { 
        currentIndex: 0,
        //is random variable
        isRandom: false,
        //Check music's playing variable
        isPlaying: false,
        //check repeat variable
        isRepeat: false,
        config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
        songs: [
            {
                name: 'Beats Bots (book 6)',
                singer: 'Bookworm adventure 2 (soundtrack)',
                img: './assets/music/image/BWAVol2_Icon.png',
                dataPath: './assets/music/data/BWA_Vol2_Book6_BeatsBots.mp3'
            },
            {
                name: 'Boss Battle (book 4)',
                singer: 'Bookworm adventure 2 (soundtrack)',
                img: './assets/music/image/BWAVol2_Icon.png',
                dataPath: './assets/music/data/BWA_Vol2_Book4_BossBattle.mp3'
            },
            {
                name: 'Chapter theme (book 5)',
                singer: 'Bookworm adventure 2 (soundtrack)',
                img: './assets/music/image/BWAVol2_Icon.png',
                dataPath: './assets/music/data/BWA_Vol2_Book5_ChapterTheme.mp3'
            },
            {
                name: 'Chapter theme (book 6)',
                singer: 'Bookworm adventure 2 (soundtrack)',
                img: './assets/music/image/BWAVol2_Icon.png',
                dataPath: './assets/music/data/BWA_Vol2_Book6_ChapterTheme.mp3'
            },
            {
                name: 'Boss battle (book 5)',
                singer: 'Bookworm adventure 2 (soundtrack)',
                img: './assets/music/image/BWAVol2_Icon.png',
                dataPath: './assets/music/data/BWA_Vol2_Book5_BossBattle.mp3'
            }, 
            {
                name: 'Boss battle (book 6)',
                singer: 'Bookworm adventure 2 (soundtrack)',
                img: './assets/music/image/BWAVol2_Icon.png',
                dataPath: './assets/music/data/BWA_Vol2_Book6_BossBattle.mp3'
            }
        ],
        setconfig: function(key, value) {
            this.config[key] = value;
            localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
        },
        defineProperties: function() {
            Object.defineProperty(this, 'currentSong', {
                get: function() {
                    return this.songs[this.currentIndex];
                }
            })
        }, 
        loadConfig: function() {
            this.isRandom = this.config.isRandom;
            this.isRepeat = this.config.isRepeat;
        },       
        render: function() {
            var HTMLRender = this.songs.map(function(song, index) {
                return `
                <div class="song ${index === app.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb"
                        style="background-image: url('${song.img}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
                `;
            });
            //output to html (by HTMLRender variable)
            playList.innerHTML = HTMLRender.join('');
        },       
        events: function() {
            //handle cd roll/pause
            var cdThumbAnimate = cdThumb.animate([
                { transform: 'rotate(360deg)' }
            ], {
                duration: 10000, //10 seconds;
                iterations: Infinity
            });
            cdThumbAnimate.pause();
            //Handle Scrolling 
            var cd = document.querySelector('.cd');
            var cdWidth = cd.offsetWidth;
            document.onscroll = function() {
            var scrollTop = window.scrollY || document.documentElement.scrollTop;
            var newCDWidth = cdWidth - scrollTop;
            cd.style.width = newCDWidth > 0 ? newCDWidth + 'px' : 0;
            cd.style.opacity = newCDWidth / cdWidth;
            };
            //handle play button when clicking
            playBtn.onclick = function() {
                if(!app.isPlaying) {
                    audio.play();
                } 
                else {
                    audio.pause();
                }
            };
            //listenning to event play/pause
            audio.onplay = function() {
                app.isPlaying = true;
                player.classList.add('playing');
                cdThumbAnimate.play();
            };
            audio.onpause = function() {
                app.isPlaying = false;
                player.classList.remove('playing');
                cdThumbAnimate.pause();
            };
            //seeing playing process 
            audio.ontimeupdate = function() {
                if(audio.duration) {
                    var currentProgress = Math.floor((audio.currentTime / audio.duration) * 100);
                    progress.value = currentProgress;
                }
            };
            //handle when change the progress of the song
            progress.onchange = function(e) {
                var seekTime = audio.duration / 100 * e.target.value;
                audio.currentTime = seekTime;
            };
            //handle next/previous btn
            nextBtn.onclick = function() {
                if(app.isRandom) {
                    app.randomSong();
                }
                else {
                    app.nextSong();
                }
                audio.play();
                app.render();
                app.scrollToActiveSong();
            };
            previousBTN.onclick = function() {
                if(app.isRandom) {
                    app.randomSong();
                }
                else {
                    app.previousSong();
                }
                audio.play();
            };
            //handle random button
            randomBTN.onclick = function() {
                if(!app.isRandom) {
                    randomBTN.classList.add('active');
                    app.isRandom = true;
                } 
                else {
                    randomBTN.classList.remove('active');
                    app.isRandom = false;
                }
                app.setconfig('isRandom', app.isRandom);
            };
            //handle change next song when audio ended
            audio.onended = function() {
                if(app.isRepeat) {
                    audio.play();
                }
                else {
                    nextBtn.click();
                }
            }
            //handle repeat song when repeat was clicked
            repeatBTN.onclick = function() {
                if(!app.isRepeat) {
                    repeatBTN.classList.add('active');
                    app.isRepeat = true;
                }
                else {
                    repeatBTN.classList.remove('active');
                    app.isRepeat = false;
                }
                app.setconfig('isRepeat', app.isRepeat);
            }
            //listen clicking to playlist
            playList.onclick = function(e) {
                var songNode = e.target.closest('.song:not(.active)');
                if(songNode || e.target.closest('.option')) {
                    //handle when click song list
                    if(songNode) {
                        //console.log(songNode.dataset.index);
                        app.currentIndex = Number(songNode.dataset.index);
                        app.loadCurrentSong();
                        app.render();
                        audio.play();
                    }
                }
            }
        },
        loadCurrentSong: function() {
            heading.textContent = this.currentSong.name;
            cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`;
            audio.src = this.currentSong.dataPath;
        },
        scrollToActiveSong: function() {
            setTimeout(function() {
                document.querySelector('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',

                });
            }, 250);
        },
        //handle change next song when clicking
        nextSong: function() {
            this.currentIndex++;
            if(this.currentIndex > this.songs.length - 1) {
                this.currentIndex = 0;
            }
            this.loadCurrentSong();
        },
        //handle change previous song when clicking
        previousSong: function() {
            this.currentIndex--;
            if(this.currentIndex < 0) {
                this.currentIndex = this.songs.length - 1;
            }
            this.loadCurrentSong();
        },
        //hande load random song when clicking
        randomSong: function() {
            var randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * (this.songs.length))
            }while(randomIndex === this.currentIndex);

            this.currentIndex = randomIndex;
            this.loadCurrentSong();
        },
        //Function handle starting song
        start:  function() {
            //load cấu hình từ config vào ứng dụng
            this.loadConfig();
            //define object's properties
            this.defineProperties(); 
            //function handle events
            this.events();
            //function load current song
            this.loadCurrentSong();
            //Function handle render song
            this.render();
        }
    };
    
    app.start();
}
//---------------------------------

function handleStart () {}

function handleRender () {
}

function handleEvents() {
}

//function get current song
/*function getCurrentSong() {
    return this.songs[this.currentIndex];
}*/

//function play/pause/get song music

