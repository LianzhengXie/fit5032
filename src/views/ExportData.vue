<template>
    <div class="export-options">
      <h2>Export Data</h2>
      <button @click="exportToCSV">Export as CSV</button>
      <button @click="exportToPDF">Export as PDF</button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { saveAs } from 'file-saver';
  import { jsPDF } from 'jspdf';
  import 'jspdf-autotable';
  import { parse } from 'json2csv';
  
  // Sample data to be exported, this would typically come from your Vuex store or API
  const data = ref([
    { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' },
    { id: 2, name: 'Bob', email: 'bob@example.com', role: 'user' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'editor' },
  ]);
  
  // Export to CSV
  const exportToCSV = () => {
    try {
      const csv = parse(data.value);  // Convert JSON to CSV format
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'data_export.csv'); // Trigger download using FileSaver
    } catch (error) {
      console.error('CSV Export Error:', error);
    }
  };
  
  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Exported Data', 10, 10);
    doc.autoTable({
      head: [['ID', 'Name', 'Email', 'Role']],
      body: data.value.map(item => [item.id, item.name, item.email, item.role]),
    });
    doc.save('data_export.pdf'); // Trigger download
  };
  </script>
  
  <style scoped>
  .export-options {
    max-width: 400px;
    margin: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  button {
    padding: 10px;
    font-size: 16px;
  }
  </style>
  