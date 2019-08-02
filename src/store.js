import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        musicsList: [
            {
                name: "Jazz Apricot",
                url: require("@/assets/musics/Jazz_Apricot.mp3")
            },
            {
                name: "Jazz Apricot1",
                url: require("@/assets/musics/Jazz_Apricot.mp3")
            },
            {
                name: "Jazz Apricot2",
                url: require("@/assets/musics/Jazz_Apricot.mp3")
            },
            {
                name: "Jazz Apricot3",
                url: require("@/assets/musics/Jazz_Apricot.mp3")
            },
            {
                name: "Song of Mirrors",
                url: require("@/assets/musics/Song_of_Mirrors.mp3")
            },
            {
                name: "The Long Night",
                url: require("@/assets/musics/The_Long_Night.mp3")
            },
            {
                name: "Cosmic Groove",
                url: require("@/assets/musics/Cosmic_Groove.mp3")
            },
            {
                name: "Down",
                url: require("@/assets/musics/Down.mp3")
            },
            {
                name: "November",
                url: require("@/assets/musics/November.mp3")
            }
        ]
    }
})