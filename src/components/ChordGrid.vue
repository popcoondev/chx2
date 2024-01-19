
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
      switch (chordType) {
        case '':
          // メジャーコード
          chordNotes.push(this.notesSequence[(rootIndex + 4) % 12]);
          chordNotes.push(this.notesSequence[(rootIndex + 7) % 12]);
          break;
        case 'm':
          // マイナーコード
          chordNotes.push(this.notesSequence[(rootIndex + 3) % 12]);
          chordNotes.push(this.notesSequence[(rootIndex + 7) % 12]);
          break;
        case '7':
          // セブンスコード
          chordNotes.push(this.notesSequence[(rootIndex + 4) % 12]);
          chordNotes.push(this.notesSequence[(rootIndex + 7) % 12]);
          chordNotes.push(this.notesSequence[(rootIndex + 10) % 12]);
          break;
        case 'm7':
          // マイナーセブンスコード
          chordNotes.push(this.notesSequence[(rootIndex + 3) % 12]);
          chordNotes.push(this.notesSequence[(rootIndex + 7) % 12]);
          chordNotes.push(this.notesSequence[(rootIndex + 10) % 12]);
          break;
        case 'maj7':
          // メジャーセブンスコード
          chordNotes.push(this.notesSequence[(rootIndex + 4) % 12]);
          chordNotes.push(this.notesSequence[(rootIndex + 7) % 12]);
          chordNotes.push(this.notesSequence[(rootIndex + 11) % 12]);
          break;
        case 'dim':
          // 減五度コード
          chordNotes.push(this.notesSequence[(rootIndex + 3) % 12]);
          chordNotes.push(this.notesSequence[(rootIndex + 6) % 12]);
          break;
        case 'aug':
          // 増五度コード
          chordNotes.push(this.notesSequence[(rootIndex + 4) % 12]);
          chordNotes.push(this.notesSequence[(rootIndex + 8) % 12]);
          break;
        // その他のコードタイプを追加する場合はここに追加
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

