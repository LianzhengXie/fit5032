<template>
    <div class="container mt-5">
      <h1 class="text-center">Rate Our Projects</h1>
      <p class="text-center">Please rate the following projects:</p>
      
      <div v-for="(project, index) in projects" :key="index" class="card mb-3">
        <div class="card-body">
          <h5 class="card-title">{{ project.name }}</h5>
          <p class="card-text">{{ project.description }}</p>
  
          <!-- Display rating stars with clear feedback on selection -->
          <div class="rating">
            <span v-for="star in 5" :key="star" class="star">
              <i
                :class="getStarClass(star, project.userRating)"
                @click="rateProject(index, star)"
                @mouseover="hoverRating(index, star)"
                @mouseleave="clearHoverRating(index)"
              ></i>
            </span>
          </div>
  
          <!-- Average rating and number of ratings -->
          <p class="card-text">
            Average Rating: {{ calculateAverageRating(project.ratings) }} ★ 
            ({{ project.ratings.length }} ratings)
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const projects = ref([
    {
      name: 'Project A',
      description: 'Description of Project A.',
      ratings: [],
      userRating: null,
      hoverRating: null,
    },
    {
      name: 'Project B',
      description: 'Description of Project B.',
      ratings: [],
      userRating: null,
      hoverRating: null,
    },
    {
      name: 'Project C',
      description: 'Description of Project C.',
      ratings: [],
      userRating: null,
      hoverRating: null,
    },
  ]);
  
  // Handle the actual rating submission
  const rateProject = (index, star) => {
    projects.value[index].userRating = star;
    projects.value[index].ratings.push(star);
    localStorage.setItem('projects', JSON.stringify(projects.value));
  };
  
  // Calculate the average rating of a project
  const calculateAverageRating = (ratings) => {
    if (ratings.length === 0) return 0;
    const total = ratings.reduce((sum, rating) => sum + rating, 0);
    return (total / ratings.length).toFixed(1);
  };
  
  // Determine the class for the stars based on the current and hovered ratings
  const getStarClass = (star, userRating) => {
    if (star <= userRating) {
      return 'fas fa-star selected';
    }
    return 'far fa-star';
  };
  
  // Handle the hover effect on stars
  const hoverRating = (index, star) => {
    projects.value[index].hoverRating = star;
  };
  
  // Clear the hover effect
  const clearHoverRating = (index) => {
    projects.value[index].hoverRating = null;
  };
  
  // Load project ratings from localStorage when the component is mounted
  onMounted(() => {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      projects.value = JSON.parse(savedProjects);
    }
  });
  </script>
  
  <style scoped>
  .rating .star {
    cursor: pointer;
    font-size: 1.5rem;
    color: #FFD700;
    padding: 0 5px;
  }
  
  .selected {
    color: #FFD700;
  }
  </style>
  