<template>
    <div class="row mt-5" v-if="submittedCards.length">
      <div class="d-flex flex-wrap justify-content-start">
        <div class="row mt-5">
          <h4>This is a PrimeVue DataTable.</h4>
          <DataTable :value="submittedCards" tableStyle="min-width: 50rem">
            <Column field="username" header="Username"></Column>
            <Column field="password" header="Password"></Column>
            <Column field="isAustralian" header="Australian Resident"></Column>
            <Column field="gender" header="Gender"></Column>
            <Column field="reason" header="Reason"></Column>
          </DataTable>
        </div>
        <div
          v-for="(card, index) in submittedCards"
          :key="index"
          class="card m-2"
          style="width: 18rem"
        >
          <div class="card-header">User Information</div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">Username: {{ card.username }}</li>
            <li class="list-group-item">Password: {{ card.password }}</li>
            <li class="list-group-item">
              Australian Resident: {{ card.isAustralian ? 'Yes' : 'No' }}
            </li>
            <li class="list-group-item">Gender: {{ card.gender }}</li>
            <li class="list-group-item">Reason: {{ card.reason }}</li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  
  const props = defineProps({
    submittedCards: {
      type: Array,
      required: true
    }
  });

    const route = useRoute();
    const newUser = route.params.newUser;

  </script>
  