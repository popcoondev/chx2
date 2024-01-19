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
  justify-content: around;

}
.keyboard-container {
  flex: 6;
  display: flex;
  justify-content: center; /* 横方向の中央揃え */
  align-items: center; /* 縦方向の中央揃え */
  height: 100%; /* コンテナの高さを親要素に合わせる */
  flex-direction: column;
  /* その他のスタイル */
}
.chord-container {
  flex: 4;
  display: flex;
  justify-content: center; /* 横方向の中央揃え */
  align-items: center; /* 縦方向の中央揃え */
  height: 100%; /* コンテナの高さを親要素に合わせる */
  flex-direction: column;
  /* その他のスタイル */
}

.piano-keyboard, .chord-grid {
  width: 100%; /* 全幅を使用する */
}

.spacer {
  height: 20px; /* 間隔の高さ */
  width: 100px; /* 間隔の幅 */
}
</style>
