
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
      
      <div v-for="(chordRoot, index) in chordRoots" :key="index" class="chord-row">
          <button
            v-for="chordType in chordTypes"
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
      chordRoots: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
      chordTypes: ['', 'm', '7', 'm7', 'maj7', 'dim', 'aug', 'sus2', 'sus4', 'add9', /*'6', 'm6', */'7#9', '9', '11', '13'],
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
        this.setActiveChord(null);
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
        case 'sus2':
          chordNotes.push(this.notesSequence[(rootIndex + 2) % 12]);
          chordNotes.push(this.notesSequence[(rootIndex + 7) % 12]);
          break;
        case 'sus4':
          chordNotes.push(this.notesSequence[(rootIndex + 5) % 12]);
          chordNotes.push(this.notesSequence[(rootIndex + 7) % 12]);
          break;
        case 'add9':
          chordNotes.push(this.notesSequence[(rootIndex + 4) % 12]);
          chordNotes.push(this.notesSequence[(rootIndex + 7) % 12]);
          chordNotes.push(this.notesSequence[(rootIndex + 14) % 12]);
          break;
        // case '6':
        //   chordNotes.push(this.notesSequence[(rootIndex + 4) % 12]);
        //   chordNotes.push(this.notesSequence[(rootIndex + 7) % 12]);
        //   chordNotes.push(this.notesSequence[(rootIndex + 9) % 12]);
        //   break;
        // case 'm6':
        //  chordNotes.push(this.notesSequence[(rootIndex + 3) % 12]);
        //  chordNotes.push(this.notesSequence[(rootIndex + 7) % 12]);
        //  chordNotes.push(this.notesSequence[(rootIndex + 9) % 12]);
        //  break;
        case '7#9':
          chordNotes.push(this.notesSequence[(rootIndex + 4) % 12]);
          chordNotes.push(this.notesSequence[(rootIndex + 7) % 12]);
          chordNotes.push(this.notesSequence[(rootIndex + 10) % 12]);
          chordNotes.push(this.notesSequence[(rootIndex + 15) % 12]);
          break;
        case '9':
          chordNotes.push(this.notesSequence[(rootIndex + 4) % 12]);
          chordNotes.push(this.notesSequence[(rootIndex + 7) % 12]);
          chordNotes.push(this.notesSequence[(rootIndex + 10) % 12]);
          chordNotes.push(this.notesSequence[(rootIndex + 14) % 12]);
          break;
        case '11':
          chordNotes.push(this.notesSequence[(rootIndex + 4) % 12]);
          chordNotes.push(this.notesSequence[(rootIndex + 7) % 12]);
          chordNotes.push(this.notesSequence[(rootIndex + 10) % 12]);
          chordNotes.push(this.notesSequence[(rootIndex + 17) % 12]);
          break;
        case '13':
          chordNotes.push(this.notesSequence[(rootIndex + 4) % 12]);
          chordNotes.push(this.notesSequence[(rootIndex + 7) % 12]);
          chordNotes.push(this.notesSequence[(rootIndex + 10) % 12]);
          chordNotes.push(this.notesSequence[(rootIndex + 21) % 12]);
          break;
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

.mode-selector {
  margin-bottom: 10px;
  /* その他のスタイリング */

}

.mode-selector label {
  color: white; /* ここに希望のカラーコードを設定 */
  /* その他のスタイリング */
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: 200;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-right: 10px;

}

.mode-selector input[type="radio"] {
  /* ラジオボタンのスタイリング（必要に応じて） */
  margin-right: 5px;
  margin-left: 5px;
}

.chord-container {
  display: flex;
  flex-direction: column;
  align-items: center; /* 縦方向の中央揃え */
  justify-content: center; /* 横方向の中央揃え */
  height: 100%; /* 必要に応じて高さを設定 */
  width: 100%;
}


.chord-grid {
  display: grid;
  grid-template-columns: repeat(16, 1fr);
  grid-gap: 2px;
  justify-items: center;
  align-items: center;

}

.chord-button {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 14px;
  margin: 1px;
  width: 60px;
  height: 40px;
  text-align: center;
  vertical-align: middle;
  border-radius: 30px;
  border: 1px solid #000;
  background-color: #888;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease-in-out;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.chord-button:active {
  background-color: #ff8c00;
  box-shadow: 0 0 10px rgba(255, 140, 0, 0.2);
}

.highlighted {
  background-color: #ff8c00;
  box-shadow: 0 0 10px rgba(255, 140, 0, 0.2);
}

</style>

