<template>
  <div class="app">
    <audio ref="audio" @timeupdate="timeUpdate()" @ended="ended()" @canplay="canplay()"></audio>
    <div v-show="isOpenAD" class="AD">
      廣告
      <div class="AD-block">
        <button @click="isOpenAD=false">
          <icon icon="times" />
        </button>
        <img :src="require('@/assets/images/lionKingAD_width.jpg')" alt />
      </div>
    </div>
    <div class="main">
      <div class="menu-contain">
        <ul class="menu">
          <li class="active">
            <icon icon="home" />首頁
          </li>
          <li>
            <icon icon="archive" />瀏覽
          </li>
          <li>
            <icon icon="broadcast-tower" />電台
          </li>
          <div class="subtitle">分類</div>
          <li>流行樂</li>
          <li>浪漫</li>
          <li>嘻哈</li>
          <li>電子音樂</li>
          <li>古典</li>
          <li>爵士</li>
        </ul>
      </div>
      <div class="middle">
        <div>
          <h1>正在撥放</h1>
          <table class="musicList">
            <tr>
              <th class="actions"></th>
              <th>標題</th>
              <th>藝人</th>
              <th>專輯</th>
            </tr>
            <tr>
              <td class="actions">
                <button v-if="!isPlaying" class="play_pause play" @click="play()">
                  <icon icon="play-circle" />
                </button>
                <button v-else class="play_pause" @click="pause()">
                  <icon icon="pause-circle" />
                </button>
              </td>
              <td>{{playList[playingNum].name}}</td>
              <td>{{playList[playingNum].name}}</td>
              <td>{{playList[playingNum].name}}</td>
            </tr>
          </table>
        </div>
        <div class="ListBlock">
          <h1>播放列表</h1>
          <table class="musicList">
            <tr>
              <th class="actions"></th>
              <th>標題</th>
              <th>藝人</th>
              <th>專輯</th>
            </tr>
            <tr
              v-for="(music,i) in playList"
              :key="music.name"
              :class="{playing:(isPlaying&&playingNum==i)}"
            >
              <td class="actions">
                <button v-if="!isPlaying&&playingNum==i" class="play_pause play" @click="play()">
                  <icon icon="play-circle" />
                </button>
                <button
                  v-else-if="(!isPlaying&&playingNum!=i)||(isPlaying&&playingNum!=i)"
                  class="play_pause play"
                  @click="playsong(i)"
                >
                  <icon icon="play-circle" />
                </button>
                <button v-else class="play_pause" @click="pause()">
                  <icon icon="pause-circle" />
                </button>
              </td>
              <td>{{music.name}}</td>
              <td>{{music.name}}</td>
              <td>{{music.name}}</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="right-AD">
        <img :src="require('@/assets/images/lionKingAD_long.jpg')" alt />
      </div>
    </div>

    <div class="audio">
      <div class="description">
        <img src="http://fakeimg.pl/50x50" alt />
        <div class="font-block">
          <div class="songName">{{playList[playingNum].name}}</div>
          <div class="author">{{playList[playingNum].name}}</div>
        </div>
      </div>
      <div class="progressBlock">
        <div class="buttons">
          <button @click="random()" :class="{active: isRandom}">
            <icon icon="random" />
          </button>
          <button @click="previous()">
            <icon icon="step-backward" />
          </button>
          <button v-if="!isPlaying" class="play_pause play" @click="play()">
            <icon icon="play" />
          </button>
          <button v-else class="play_pause" @click="pause()">
            <icon icon="pause" />
          </button>
          <button @click="next()">
            <icon icon="step-forward" />
          </button>
          <button @click="isRetweet=!isRetweet" :class="{active: isRetweet}">
            <icon icon="retweet" />
          </button>
        </div>
        <div class="progress">
          {{playingTime}}
          <input
            class="bar"
            type="range"
            @change="progressChange()"
            v-model="progress"
          />
          {{totalTime}}
        </div>
      </div>
      <div class="volume">
        <button v-if="!isMute" @click="muted(true)">
          <icon icon="volume-up" />
        </button>
        <button v-else @click="muted(false)">
          <icon icon="volume-mute" />
        </button>
        <input type="range" @change="volumeChange()" v-model="volume" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MP3Player",
  data() {
    return {
      musics: this.$store.state.musicsList,
      playList: [
        {
          name: "",
          url: ""
        }
      ],
      playingTime: "00:00",
      totalTime: "",
      playingNum: 0,
      volume: 50,
      progress: 0,
      isPlaying: false,
      isMute: false,
      isRandom: false,
      isRetweet: false,
      isOpenAD: false,
      oTimer: ""
    };
  },
  mounted() {
    this.playList = Array.from(this.musics);
    this.$refs.audio.setAttribute("src", this.playList[0].url);
    this.$refs.audio.volume = this.volume / 100;
    let vue = this;
    window.onfocus = function() {
      vue.windowsOnfocus();
    };
    window.onmousemove = function() {
      vue.windowsOnfocus();
    };
  },
  watch: {
    playingTime() {
      if (isNaN(this.$refs.audio.duration)) {
        this.progress = 0;
      } else {
        this.progress =
          (this.$refs.audio.currentTime / this.$refs.audio.duration) * 100;
      }
    }
  },
  methods: {
    playsong(i) {
      this.$refs.audio.setAttribute("src", this.playList[i].url);
      this.$refs.audio.play();
      this.isPlaying = true;
      this.playingNum = i;
    },
    play() {
      this.$refs.audio.play();
      this.isPlaying = true;
    },
    pause() {
      this.$refs.audio.pause();
      this.isPlaying = false;
    },
    ended() {
      let nextNum = this.playingNum + 1;
      if (nextNum < this.playList.length) {
        this.$refs.audio.setAttribute("src", this.playList[nextNum].url);
        this.$refs.audio.play();
        this.isPlaying = true;
        this.playingNum = nextNum;
      } else if (this.isRetweet) {
        this.$refs.audio.setAttribute("src", this.playList[0].url);
        this.$refs.audio.play();
        this.isPlaying = true;
        this.playingNum = 0;
      } else {
        this.isPlaying = false;
      }
    },
    random() {
      this.isRandom = !this.isRandom;
      if (this.isRandom) {
        this.playList = this.playList.sort(() => Math.random() - 0.5);
        this.playingNum = this.playList.indexOf(this.musics[this.playingNum]);
      } else {
        let tem = Array.from(this.playList);
        this.playList = Array.from(this.musics);
        this.playingNum = this.musics.indexOf(tem[this.playingNum]);
      }
    },
    previous() {
      if (this.$refs.audio.currentTime > 1) {
        this.$refs.audio.currentTime = 0;
      } else {
        let previousNum = this.playingNum - 1;
        if (this.playingNum - 1 < 0) {
          previousNum = this.playList.length - 1;
        }
        this.$refs.audio.setAttribute("src", this.playList[previousNum].url);
        this.$refs.audio.play();
        this.isPlaying = true;
        this.playingNum = previousNum;
      }
      this.openAD();
    },
    next() {
      let nextNum = this.playingNum + 1;
      if (nextNum >= this.playList.length) {
        nextNum = 0;
      }
      this.$refs.audio.setAttribute("src", this.playList[nextNum].url);
      this.$refs.audio.play();
      this.isPlaying = true;
      this.playingNum = nextNum;
      this.openAD();
    },
    volumeChange() {
      if (this.volume == 0) {
        this.muted(true);
      } else {
        this.muted(false);
      }
      this.$refs.audio.volume = this.volume / 100;
    },
    progressChange() {
      this.$refs.audio.currentTime =
        (this.progress / 100) * this.$refs.audio.duration;
    },
    timeUpdate() {
      this.playingTime = this.formatTime(this.$refs.audio.currentTime);
    },
    canplay() {
      this.totalTime = this.formatTime(this.$refs.audio.duration);
    },
    muted(control) {
      if (this.volume == 0) {
        this.$refs.audio.muted = true;
        this.isMute = true;
      } else {
        this.$refs.audio.muted = control;
        this.isMute = control;
      }
    },
    formatTime(seconds) {
      if (isNaN(seconds) == true) {
        return "--:--";
      }
      var minutes = Math.floor(seconds / 60);
      minutes = minutes >= 10 ? minutes : "0" + minutes;
      var seconds = Math.floor(seconds % 60);
      seconds = seconds >= 10 ? seconds : "0" + seconds;
      return minutes + ":" + seconds;
    },
    openAD() {
      let num = Math.floor(Math.random() * 7);
      if (num == 0) this.isOpenAD = true;
    },
    windowsOnfocus() {
      let vue = this;
      clearTimeout(vue.oTimer);
      vue.oTimer = setTimeout(function() {
        vue.isOpenAD = true;
      }, 30 * 1000);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "./style";
</style>
