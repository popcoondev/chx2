
<template>
  <div class="chord-grid">
    <div v-for="(chordType, index) in chordTypes" :key="index" class="chord-row">
      <button
        v-for="chordRoot in chordRoots"
        :key="chordRoot + chordType"
        class="chord-button"
        @mousedown="activateChord(chordRoot, chordType)"
        @mouseup="deactivateChord()"
      >
        {{ chordRoot + chordType }}
      </button>
    </div>
  </div>
</template>

<script>
import { EventBus } from './eventBus.js';

export default {
  data() {
    return {
      chordRoots: ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'],
      chordTypes: ['', 'm', '7', 'm7', 'maj7', 'dim', 'aug'],
      notesSequence: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],  
      // その他のデータ...
    };
  },
  methods: {
    activateChord(chordRoot, chordType) {
      // 音名をインデックスに変換する関数
      const noteToIndex = (note) => {
        return this.notesSequence.indexOf(note);
      };

      // 根音のインデックスを取得
      const rootIndex = noteToIndex(chordRoot);

      // コード構成音のインデックスを計算
      let chordNotes = [chordRoot]; // 根音を含む
      if (chordType === '' || chordType === '7') {
        // メジャーコードまたはセブンスコードの場合
        chordNotes.push(this.notesSequence[(rootIndex + 4) % 12]); // 長3度
        chordNotes.push(this.notesSequence[(rootIndex + 7) % 12]); // 完全5度
      } else if (chordType === 'm') {
        // マイナーコードの場合
        chordNotes.push(this.notesSequence[(rootIndex + 3) % 12]); // 短3度
        chordNotes.push(this.notesSequence[(rootIndex + 7) % 12]); // 完全5度
      }
      if (chordType === '7') {
        chordNotes.push(this.notesSequence[(rootIndex + 10) % 12]); // 短7度
      }

      chordNotes.forEach(note => {
        EventBus.emit('activate-note', note);
      });
    },
    deactivateChord() {
      console.log("deactivateChord");
      EventBus.emit('inactivate-note');
    }
  },

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

