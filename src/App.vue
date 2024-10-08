  <script>
    import BHeader from './components/BHeader.vue';
    import { useStore } from 'vuex';

    export default {
      components: { BHeader },
      setup() {
        const store = useStore();
        store.dispatch('initializeAuth'); // Initialize auth monitoring
        return { store };
      }
    };
  </script>

  <template>
    <header>
      <BHeader />
    </header>

    <main>
      <router-view></router-view>
    </main>
  </template>

<style scoped>
header {
  position: relative;
  z-index: 100;
}

.main-content {
  margin-top: 20px;
  padding: 20px;
}

@media (max-width: 576px) {
  .main-content {
    padding: 10px;
  }
}

@media (min-width: 576px) and (max-width: 768px) {
  .main-content {
    padding: 15px;
  }
}

@media (min-width: 992px) and (max-width: 1200px) {
  header {
    padding-right: 10px;
  }

  .main-content {
    padding: 20px;
    margin: 0 auto;
    max-width: 800px;
  }
}

@media (min-width: 1400px) {
  header {
    padding-right: 15px;
  }

  .main-content {
    padding: 30px;
    margin: 0 auto;
    max-width: 1000px;
  }
}
</style>