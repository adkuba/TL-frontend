import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export function createStore () {
    return new Vuex.Store({
        state: () => ({
            timeline: {descriptionTitle: '', pictures: []},
            profileUser: { fullName: '', username: '' },
            jwt: '',
            timelines: [],
            message: '',
            refreshTry: false,
            notifications: {
            read: true,
            messages: []
            }
        }),
        actions: {
            fetchTimeline({ commit }, timelineApi){
                return axios.get(timelineApi).then(response => {
                    commit('setTimeline', response.data)
                }).catch(err => console.log(err));
            },
            fetchUser({ commit }, userApi){
                return axios.get(userApi).then(response => {
                    commit('setProfileUser', response.data)
                }).catch(err => console.log(err))
            }
        },
        mutations: {
            setTimelines(state, newTimelines){
                state.timelines = newTimelines
            },
            setTimeline(state, newTimeline){
                state.timeline = newTimeline
            },
            setProfileUser(state, newUser){
                state.profileUser = newUser
            },
            set(state, newJwt) {
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