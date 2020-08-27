import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    state: {
        jwt: '',
        timelines: [],
        message: '',
        refreshTry: false,
        notifications: {
          read: true,
          messages: []
        }
      },
      mutations: {
        set (state, newJwt) {
          state.jwt = newJwt;
        },
        addTimelines(state, newTimelines){
          for (var i=0, len=newTimelines.length; i<len; i++){
            state.timelines.push(newTimelines[i])
          }
        },
        addSpecial(state, special){
          state.timelines.push(special)
        },
        setMessage(state, newMessage){
          state.message = newMessage
        },
        setRefresh(state, newRefresh){
          state.refreshTry = newRefresh
        },
        setNotifications(state, newNotifications){
          state.notifications = newNotifications
        },
      }
  })
}