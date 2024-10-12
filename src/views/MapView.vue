<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <h1 class="text-center mb-4">🗺️ Google Maps App</h1>

        <!-- POI Search -->
        <div class="input-group mb-3">
          <input 
            v-model="searchQuery" 
            placeholder="Search for POI (e.g., cafe, library)" 
            type="text"
            class="form-control"
          />
          <button type="button" class="btn btn-secondary" @click="searchPOI">Search</button>
        </div>

        <!-- Directions Input -->
        <div class="input-group mb-3">
          <input 
            v-model="startLocation" 
            placeholder="Enter Starting Point"
            type="text"
            class="form-control mb-2"
          />
          <input 
            v-model="endLocation" 
            placeholder="Enter Destination" 
            type="text"
            class="form-control mb-2"
          />
          <button type="button" class="btn btn-primary" @click="getDirections">Get Directions</button>
        </div>

        <!-- Travel Details -->
        <p class="text-center mt-4">Travel Time: {{ travelTime }} | Distance: {{ travelDistance }}</p>
        
        <!-- Map Container -->
        <div ref="mapContainer" class="map-container mt-4" style="height: 400px;"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      startLocation: '',
      endLocation: '',
      travelTime: '',
      travelDistance: '',
      map: null,
      directionsService: null,
      directionsRenderer: null,
      markers: [],  // Store POI markers for clearing on new search
    };
  },
  methods: {
    loadGoogleMaps() {
      return new Promise((resolve, reject) => {
        if (typeof google !== 'undefined' && google.maps) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCbzgLoJijyHpvr8DnFNvn79rkZYChw_Dk&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    },
    initMap() {
      const center = { lat: -37.90851, lng: 145.13717 };
      this.map = new google.maps.Map(this.$refs.mapContainer, {
        center,
        zoom: 13,
      });
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer();
      this.directionsRenderer.setMap(this.map);
    },
    searchPOI() {
      const request = {
        query: this.searchQuery,
        fields: ['name', 'geometry'],
      };
      const service = new google.maps.places.PlacesService(this.map);

      // Clear any existing markers
      this.clearMarkers();

      service.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          this.map.setCenter(results[0].geometry.location);
          results.forEach((place) => {
            const marker = new google.maps.Marker({
              position: place.geometry.location,
              map: this.map,
              title: place.name,
            });
            this.markers.push(marker);  // Store marker for later removal
          });
        } else {
          console.error('Error finding places:', status);
          alert("No results found for your search.");
        }
      });
    },
    getDirections() {
      const request = {
        origin: this.startLocation,
        destination: this.endLocation,
        travelMode: google.maps.TravelMode.DRIVING,
      };
      this.directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.directionsRenderer.setDirections(result);
          const route = result.routes[0].legs[0];
          this.travelTime = route.duration.text;
          this.travelDistance = route.distance.text;
        } else {
          console.error('Error getting directions:', status);
          alert("Could not retrieve directions. Please check your locations.");
        }
      });
    },
    clearMarkers() {
      this.markers.forEach((marker) => marker.setMap(null));
      this.markers = [];
    }
  },
  mounted() {
    this.loadGoogleMaps()
      .then(() => {
        this.initMap();
      })
      .catch((error) => {
        console.error("Error loading Google Maps API", error);
      });
  },
};
</script>

<style scoped>
.map-container {
  height: 400px;
  width: 100%;
}
</style>
