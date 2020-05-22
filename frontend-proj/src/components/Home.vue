<template>
<div>
    <div class="menu">
            <router-link :to="{ name: 'login' }" class="login_b"> login </router-link>
    </div>
    <div class="hh">elko strona glowna</div>
    <a href="http://localhost:8080/timeline/kubatl">Moja stronka</a>
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
