
<template>
  <div class="chord-container">
    <div class="mode-selector">
      <label>
        <input type="radio" class="mode-label" value="click" v-model="mode" /> CLICK MODE
      </label>
      <label>
        <input type="radio" value="toggle" v-model="mode" /> TOGGLE MODE
      </label>
    </div>
    <div class="chord-grid">
      <div v-for="(chordType, index) in chordTypes" :key="index" class="chord-row">
        <button
          v-for="chordRoot in chordRoots"
          :key="chordRoot + chordType"
          :class="['chord-button', { 'highlighted': isActiveChord(chordRoot + chordType) }]"
          @mousedown="handleMouseDown(chordRoot, chordType)"
          @mouseup="handleMouseUp()"
        >
          {{ chordRoot + chordType }}
        </button>
      </div>
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
      activeChord: null,
      mode: 'click',

    };
  },
  created() {
    EventBus.on('highlight-chord', this.setActiveChord);
  },
  methods: {
    handleMouseDown(chordRoot, chordType) {
      if (this.mode === 'click') {
        this.setActiveChord(null);
        this.activateChord(chordRoot, chordType);
      } else {
        if(this.activeChord !== chordRoot + chordType) {
          this.deactivateChord();
          this.activateChord(chordRoot, chordType);
          this.setActiveChord(chordRoot + chordType);
        }
        else {
          this.deactivateChord();
          this.setActiveChord(null);
        }
      }
    },
    handleMouseUp() {
      if (this.mode === 'click') {
        this.deactivateChord();
      }
    },
    setActiveChord(chord) {
      this.activeChord = chord;
      console.log("setActiveChord " + chord)
    },
    isActiveChord(chord) {
      return this.activeChord === chord;
    },
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
.chord-container {
    display: flex;
    flex-direction: column;
}

.mode-selector {
    margin-bottom: 10px;
    /* その他のスタイリング */
}

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

.highlighted {
  background-color: #0F0;
}

</style>

