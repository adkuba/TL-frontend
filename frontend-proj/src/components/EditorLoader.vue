<template lang="html">
    <Creator v-bind:editTimeline="readyTimeline" v-bind:editEvents="readyEvents"></Creator>
</template>

<script lang="js">
import Creator from './Creator.vue'

  export default  {
    name: 'EditorLoader',
    components: {
        Creator
    },
    created() {
        var timelineApi = this.baseApi + 'timelines/public?id=' + this.$route.params.id
        this.axios.get(timelineApi).then(response => {
                var tl = response.data
                if (tl.user.username != this.$store.state.jwt.user.username){
                    this.$router.push({ path: "/home" })
                }
                this.timeline = response.data
                this.timeline.id = this.$route.params.id
            })
            .catch(err => {
                console.log(err)
                this.$router.push({ path: "/home" })
            })
    },
    data () {
      return {
          baseApi: 'http://localhost:8081/api/',
          timeline: null,
          events: null,
          subEvents: null,
          readyEvents: null,
          readyTimeline: {empty: true},
      }
    },
    watch: {
        timeline: function(){
            var eventsApi = this.baseApi + 'events/public?timelineId=' + this.timeline.id
            this.axios.get(eventsApi).then(response => {
                this.events = response.data
            })
        },
        events: function(){
            if (this.events){
                if (!this.timeline.pictures){
                    this.timeline.pictures = []
                }
                this.timeline.picturesRaw = []
                this.readyTimeline = JSON.parse(JSON.stringify(this.timeline))
                var subEventsApi = this.baseApi + 'events/allSubEventsByMainTimelineId?timelineId=' + this.timeline.id
                this.axios.get(subEventsApi, {
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.jwt.token
                    }
                })
                    .then(response => {
                        this.subEvents = response.data
                    })
                    .catch(err => console.log(err))
            }
        },
        subEvents: function(){
            if (this.subEvents){
                for (var i=0, len=this.events.length; i<len; i++){
                    this.events[i].picturesRaw = []
                    if (!this.events[i].pictures){
                        this.events[i].pictures = []
                    }

                    for (var j=0, len2=this.subEvents[i].length; j<len2; j++){
                        this.subEvents[i][j].picturesRaw = []
                        if (!this.subEvents[i][j].pictures){
                            this.subEvents[i][j].pictures = []
                        }
                    }

                    this.events[i].sub = this.subEvents[i]
                }
                this.readyEvents = JSON.parse(JSON.stringify(this.events))
            }
        }
    }
}


</script>

<style scoped lang="sass">

</style>
