
<template>
  <div class="piano-keyboard">
    <button
      v-for="note in notes"
      :key="note.label"
      :class="['keyboard-key', note.color, 'octave-' + note.octave, { 'active': note.isActive }]"
      @click="toggleNote(note)"
    >
      {{ note.label }}

    </button>
  </div>
</template>

<script>
import { EventBus } from './eventBus.js';
export default {
  name: "PianoKeyboard",
  data() {
    return {
      notes: this.generateChromaticNotes(),
    };
  },
  created() {
    EventBus.on('activate-note', this.activateNote);
    EventBus.on('inactivate-note', this.inactivateNote);
  },
  mounted() {
    EventBus.on('activate-note', this.activateNote);
    EventBus.on('inactivate-note', this.inactivateNote);
  },
  beforeUnmount() {
    EventBus.off('activate-note', this.activateNote);
    EventBus.off('inactivate-note', this.inactivateNote);
  },
  methods: {
    generateChromaticNotes() {
      const notesSequence = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      let notes = [];
      for (let i = 0; i < 8; i++) { // 8行分のノートを生成
        for (let j = 0; j < 8; j++) { // 各行に8つのノートを配置
          const noteIndex = (i + j * 5) % 12; // 4度の間隔でノートを配置
          const octave = Math.floor((i + j * 5) / 12) + 2; // オクターブを追加（C1から始まるように+2）
          //const label = notesSequence[noteIndex] + octave;
          const label = notesSequence[noteIndex];
          let color = 'cyan'; // デフォルトはメジャー音（水色）
          if (label.includes('#')) {
            color = 'gray'; // マイナー音（灰色）
          }
          if (notesSequence[noteIndex] === 'C') {
            color = 'pink'; // C音（ピンク色）
          }
          notes.push({ label, color, octave });
        }
      }

      // 配列を左90度回転
      // 1次元配列を8x8の二次元配列に変換
      let notes2D = [];
      while(notes.length) notes2D.push(notes.splice(0,8));

      //output用の配列定義
      var rotatedNotes = new Array(8);
      for(let i=0; i<8; i++) rotatedNotes[i] = new Array(8).fill(0);

      // 配列を90度回転
      let x,y;
      for(let i = 0; i < 8; i++) {
        x = i;
        for(let j = 0; j < 8; j++) {
          y = 7 - j;
          rotatedNotes[y][x] = notes2D[i][j];
        }
      }
      
      // 二次元配列を1次元配列にフラット化
      let flatRotatedNotes = rotatedNotes.flat();

      return flatRotatedNotes;
    },
    activateNote(noteLabel) {
      // 指定されたノートをアクティブに設定
      let notesToActivate = this.notes.filter(note => note.label === noteLabel);
      console.log(notesToActivate);  // この行を追加
      if (notesToActivate) {
        notesToActivate.forEach(note => {
          note.isActive = true;
        });
      }

      // 必要に応じて、他のロジックをここに追加
    },
    inactivateNote() {
      console.log("inactivateNote");
      // 全てのノートを非アクティブに設定（オプション）
      this.notes.forEach(note => {
        note.isActive = false;
      });
    },
    toggleNote(note) {
      // ノートのアクティブ状態を切り替える
      note.isActive = !note.isActive;
      this.checkForChord();
    },
    checkForChord() {
      console.log("checkForChord");
      let chordFound = false;
      const activeNotes = this.notes.filter(note => note.isActive).map(note => note.label);
      const chords = {
        // C系コード
        'C': ['C', 'E', 'G'],
        'Cm': ['C', 'D#', 'G'],
        'C7': ['C', 'E', 'G', 'A#'],
        'Cm7': ['C', 'D#', 'G', 'A#'],
        'Cmaj7': ['C', 'E', 'G', 'B'],
        'Cdim': ['C', 'D#', 'F#'],
        'Caug': ['C', 'E', 'G#'],

        // C#系コード
        'C#': ['C#', 'F', 'G#'],
        'C#m': ['C#', 'E', 'G#'],
        'C#7': ['C#', 'F', 'G#', 'B'],
        'C#m7': ['C#', 'E', 'G#', 'B'],
        'C#maj7': ['C#', 'F', 'G#', 'C'],
        'C#dim': ['C#', 'E', 'G'],
        'C#aug': ['C#', 'F', 'A'],

        // D系コード
        'D': ['D', 'F#', 'A'],
        'Dm': ['D', 'F', 'A'],
        'D7': ['D', 'F#', 'A', 'C'],
        'Dm7': ['D', 'F', 'A', 'C'],
        'Dmaj7': ['D', 'F#', 'A', 'C#'],
        'Ddim': ['D', 'F', 'G#'],
        'Daug': ['D', 'F#', 'A#'],

        // D#系コード
        'D#': ['D#', 'G', 'A#'],
        'D#m': ['D#', 'F#', 'A#'],
        'D#7': ['D#', 'G', 'A#', 'C#'],
        'D#m7': ['D#', 'F#', 'A#', 'C#'],
        'D#maj7': ['D#', 'G', 'A#', 'D'],
        'D#dim': ['D#', 'F#', 'A'],
        'D#aug': ['D#', 'G', 'B'],

        // E系コード
        'E': ['E', 'G#', 'B'],
        'Em': ['E', 'G', 'B'],
        'E7': ['E', 'G#', 'B', 'D'],
        'Em7': ['E', 'G', 'B', 'D'],
        'Emaj7': ['E', 'G#', 'B', 'D#'],
        'Edim': ['E', 'G', 'A#'],
        'Eaug': ['E', 'G#', 'C'],

        // F系コード
        'F': ['F', 'A', 'C'],
        'Fm': ['F', 'G#', 'C'],
        'F7': ['F', 'A', 'C', 'D#'],
        'Fm7': ['F', 'G#', 'C', 'D#'],
        'Fmaj7': ['F', 'A', 'C', 'E'],
        'Fdim': ['F', 'G#', 'B'],
        'Faug': ['F', 'A', 'C#'],

        // F#系コード
        'F#': ['F#', 'A#', 'C#'],
        'F#m': ['F#', 'A', 'C#'],
        'F#7': ['F#', 'A#', 'C#', 'E'],
        'F#m7': ['F#', 'A', 'C#', 'E'],
        'F#maj7': ['F#', 'A#', 'C#', 'F'],
        'F#dim': ['F#', 'A', 'C'],
        'F#aug': ['F#', 'A#', 'D'],

        // G系コード
        'G': ['G', 'B', 'D'],
        'Gm': ['G', 'A#', 'D'],
        'G7': ['G', 'B', 'D', 'F'],
        'Gm7': ['G', 'A#', 'D', 'F'],
        'Gmaj7': ['G', 'B', 'D', 'F#'],
        'Gdim': ['G', 'A#', 'C#'],
        'Gaug': ['G', 'B', 'D#'],

        // G#系コード
        'G#': ['G#', 'C', 'D#'],
        'G#m': ['G#', 'B', 'D#'],
        'G#7': ['G#', 'C', 'D#', 'F#'],
        'G#m7': ['G#', 'B', 'D#', 'F#'],
        'G#maj7': ['G#', 'C', 'D#', 'G'],
        'G#dim': ['G#', 'B', 'D'],
        'G#aug': ['G#', 'C', 'E'],

        // A系コード
        'A': ['A', 'C#', 'E'],
        'Am': ['A', 'C', 'E'],
        'A7': ['A', 'C#', 'E', 'G'],
        'Am7': ['A', 'C', 'E', 'G'],
        'Amaj7': ['A', 'C#', 'E', 'G#'],
        'Adim': ['A', 'C', 'D#'],
        'Aaug': ['A', 'C#', 'F'],

        // A#系コード
        'A#': ['A#', 'D', 'F'],
        'A#m': ['A#', 'C#', 'F'],
        'A#7': ['A#', 'D', 'F', 'G#'],
        'A#m7': ['A#', 'C#', 'F', 'G#'],
        'A#maj7': ['A#', 'D', 'F', 'A'],
        'A#dim': ['A#', 'C#', 'E'],
        'A#aug': ['A#', 'D', 'F#'],

        // B系コード
        'B': ['B', 'D#', 'F#'],
        'Bm': ['B', 'D', 'F#'],
        'B7': ['B', 'D#', 'F#', 'A'],
        'Bm7': ['B', 'D', 'F#', 'A'],
        'Bmaj7': ['B', 'D#', 'F#', 'A#'],
        'Bdim': ['B', 'D', 'F'],
        'Baug': ['B', 'D#', 'G'],
      };

      for (let chord in chords) {
        const chordNotes = chords[chord];

        //if (chords[chord].every(note => activeNotes.includes(note))) {
        if (chordNotes.every(note => activeNotes.includes(note)) &&
          activeNotes.every(note => chordNotes.includes(note))) {

          this.highlightChord(chord);
          chordFound = true;
          break;
        }
      }

      // コードが見つからなかった場合、ハイライトを解除
      if (!chordFound) {
        this.highlightChord(null);
      }
    },
    highlightChord(chord) {
      console.log("highlightChord");
      EventBus.emit('highlight-chord', chord);
    },
  },

};

</script>

<style>
.piano-keyboard {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 10px;
}

.keyboard-key {
  aspect-ratio: 1 / 1;
  width: 80px;
  border: 4px solid #000;
}

.keyboard-key.cyan {
  background-color: #00ffff; /* メジャー音 */
  
}

.keyboard-key.gray {
  background-color: #c0c0c0; /* マイナー音 */
  
}

.keyboard-key.pink {
  background-color: #ff00ff; /* C音 */
  
}

.keyboard-key.active {
  background-color: #00FF00; /* アクティブなキーを緑色に */

}

.keyboard-octave {
  font-size: 8px;
}

.keyboard-key.octave-1 {
  border: 4px solid #A00;
}
.keyboard-key.octave-2 {
  border: 4px solid #A50;
}
.keyboard-key.octave-3 {
  border: 4px solid #AA0;
}
.keyboard-key.octave-4 {
  border: 4px solid #5A5;
}
.keyboard-key.octave-5 {
  border: 4px solid #0A5;
}
.keyboard-key.octave-6 {
  border: 4px solid #0AA;
}
.keyboard-key.octave-7 {
  border: 4px solid #5AA;
}
.keyboard-key.octave-8 {
  border: 4px solid #AAA;
}
</style>
