<!-- ChordGrid.vue -->
<template>
  <div class="chord-grid">
    <div v-for="(chordType, index) in chordTypes" :key="index" class="chord-row">
      <button
        v-for="chordRoot in chordRoots"
        :key="chordRoot + chordType"
        class="chord-button"
        @click="activateChord(chordRoot, chordType)"
      >
        {{ chordRoot + chordType }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
data() {
  return {
    chordRoots: ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'],
    chordTypes: ['', 'm', '7', 'm7', 'maj7', 'dim', 'aug'],
    // その他のデータ...
  };
}
};
</script>


/* ChordGrid.vue のスタイル */
<style>
.chord-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr); /* 12列のグリッドを定義 */
  grid-gap: 2px;
}

.chord-button {
  padding: 4px; /* ボタンの内側のスペース */
  margin: 2px;
  width: 60px;
  height: 40px;
}
</style>

