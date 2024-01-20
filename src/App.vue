<template>
  <div id="app">
    <PianoKeyboard />
    <ChordGrid />
  </div>
</template>

<script>
import PianoKeyboard from './components/PianoKeyboard.vue';
import ChordGrid from './components/ChordGrid.vue';

export default {
  components: {
    PianoKeyboard,
    ChordGrid
  }
};
</script>


<style>
body {
  background: #222;
}

#app {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr; 
  padding: 20px;

}

.piano-keyboard, .chord-grid {
  width: 100%; /* 全幅を使用する */
}

</style>
