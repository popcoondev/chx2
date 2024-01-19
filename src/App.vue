<template>
  <div id="app">
    <PianoKeyboard />
    <div class="spacer"></div> 
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
  display: flex;
  flex-direction: row;

}
.keyboard-container {
  flex: 6;
  /* その他のスタイル */
}
.chord-container {
  flex: 4;
  /* その他のスタイル */
}

.piano-keyboard, .chord-grid {
  width: 100%; /* 全幅を使用する */
}

.spacer {
  height: 20px; /* 間隔の高さ */
  width: 100%; /* 間隔の幅 */
}
</style>
