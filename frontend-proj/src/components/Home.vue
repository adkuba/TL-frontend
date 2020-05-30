<template>
<div>
    <div class="hh">elko strona glowna</div>
    <router-link :to="{ path: 'timeline/kubatl' }">Moja stronka</router-link>
</div>
</template>

<script>

export default {
  name: 'Home'
}

</script>

<style scoped>
.hh{
    margin-top: 60px;
}
</style>
