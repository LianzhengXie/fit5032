<template>
    <div>
      <h2>{{ title }}</h2>
      <input type="text" v-model="globalSearch" placeholder="Search..." class="search-box"/>
      <table ref="dataTable" class="display" style="width:100%">
        <thead>
          <tr>
            <th v-for="column in columns" :key="column" @click="sortBy(column)">
              {{ column }}
              <span v-if="sortColumn === column">
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
          </tr>
          <tr>
            <th v-for="(column, index) in columns" :key="index">
              <input type="text" v-model="columnSearch[index]" @input="filterColumn(index)" placeholder="Search {{ column }}" class="column-search"/>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in paginatedData" :key="row.ID">
            <td v-for="column in columns" :key="column">{{ row[column] }}</td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>
  </template>
  
  <script>
  import mockData1 from '../assets/mockData1.json';
  
  export default {
    props: ['title', 'data'],
    data() {
      return {
        columns: Object.keys(mockData1[0]),  // Dynamic columns based on data
        globalSearch: '',
        columnSearch: Array(Object.keys(mockData1[0]).length).fill(''), // Search array per column
        currentPage: 1,
        itemsPerPage: 10,
        sortColumn: '',
        sortDirection: 'asc',
        originalData: mockData1,
        filteredData: []
      };
    },
    computed: {
      paginatedData() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        return this.filteredData.slice(start, start + this.itemsPerPage);
      },
      totalPages() {
        return Math.ceil(this.filteredData.length / this.itemsPerPage);
      }
    },
    methods: {
      // Sort the data by column
      sortBy(column) {
        if (this.sortColumn === column) {
          this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          this.sortDirection = 'asc';
        }
        this.sortColumn = column;
        this.filteredData.sort((a, b) => {
          if (this.sortDirection === 'asc') {
            return a[column] > b[column] ? 1 : -1;
          } else {
            return a[column] < b[column] ? 1 : -1;
          }
        });
      },
      // Filter the data based on global and column search
      filterData() {
        this.filteredData = this.originalData.filter((row) => {
          return (
            Object.keys(row).some((key) => {
              return (
                row[key]
                  .toString()
                  .toLowerCase()
                  .includes(this.globalSearch.toLowerCase())
              );
            }) &&
            this.columnSearch.every((search, index) => {
              if (!search) return true;
              const key = this.columns[index];
              return (
                row[key]
                  .toString()
                  .toLowerCase()
                  .includes(search.toLowerCase())
              );
            })
          );
        });
        this.currentPage = 1;
      },
      filterColumn(index) {
        this.filterData();
      },
      nextPage() {
        if (this.currentPage < this.totalPages) this.currentPage++;
      },
      prevPage() {
        if (this.currentPage > 1) this.currentPage--;
      }
    },
    watch: {
      globalSearch() {
        this.filterData();
      }
    },
    created() {
      this.filteredData = [...this.originalData];
    }
  };
  </script>
  
  <style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1em;
  }
  th, td {
    padding: 0.5em;
    border: 1px solid #ddd;
    text-align: left;
  }
  th {
    cursor: pointer;
  }
  .search-box, .column-search {
    margin: 0.5em;
    padding: 0.3em;
  }
  .pagination {
    text-align: center;
  }
  .pagination button {
    margin: 0 5px;
    padding: 0.5em 1em;
  }
  </style>
  