<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { userMenu } from '@/api/user'

export default {
  name: 'Dashboard',
  created() {
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  
  mounted () {

  },
  methods: {
    
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
