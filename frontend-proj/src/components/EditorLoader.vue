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
                this.timeline = response.data
                this.timeline.id = this.$route.params.id
            })
            .catch(err => console.log(err))
    },
    data () {
      return {
          baseApi: 'http://localhost:8081/api/',
          timeline: null,
          events: null,
          subEvents: null,
          readyEvents: null,
          readyTimeline: null
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
