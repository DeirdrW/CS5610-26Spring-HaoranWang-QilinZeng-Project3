function boxSizes(size) {
    if (size === 9) return { rows: 3, cols: 3 };
    if (size === 6) return { rows: 2, cols: 3 };
    const root = Math.sqrt(size) | 0;
    return { rows: root, cols: root };
}

function shuffle(values) {
    for (let i = values.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [values[i], values[j]] = [values[j], values[i]];
    }
    return values;
}

export function generateSolution(size) {
    const board = Array.from({ length: size }, () => Array(size).fill(0));
    const nums = Array.from({ length: size }, (_, i) => i + 1);
    const { rows: boxRows, cols: boxCols } = boxSizes(size);

    function canPlace(row, col, value) {
        for (let i = 0; i < size; i += 1) {
            if (board[row][i] === value || board[i][col] === value) return false;
        }

        const boxRow = Math.floor(row / boxRows) * boxRows;
        const boxCol = Math.floor(col / boxCols) * boxCols;
        for (let r = 0; r < boxRows; r += 1) {
            for (let c = 0; c < boxCols; c += 1) {
                if (board[boxRow + r][boxCol + c] === value) return false;
            }
        }

        return true;
    }

    function solve(position = 0) {
        if (position === size * size) return true;

        const row = Math.floor(position / size);
        const col = position % size;
        const options = shuffle(nums.slice());

        for (const value of options) {
            if (canPlace(row, col, value)) {
                board[row][col] = value;
                if (solve(position + 1)) return true;
                board[row][col] = 0;
            }
        }

        return false;
    }

    solve();
    return board;
}

export function generateGameBoards(difficulty) {
    const size = difficulty === 'EASY' ? 6 : 9;
    const solution = generateSolution(size);
    const total = size * size;
    const keep = size === 6 ? Math.floor(total / 2) : 28 + Math.floor(Math.random() * 3);
    const indices = shuffle(Array.from({ length: total }, (_, i) => i));
    const keepSet = new Set(indices.slice(0, keep));

    const puzzle = Array.from({ length: size }, (_, row) =>
        Array.from({ length: size }, (_, col) =>
            keepSet.has(row * size + col) ? solution[row][col] : 0
        )
    );
    const fixedCells = puzzle.map((row) => row.map((value) => value !== 0));

    return {
        puzzle,
        solution,
        currentBoard: puzzle.map((row) => row.slice()),
        fixedCells,
    };
}

const wordList = [
  "apple","banana","orange","grape","melon","peach","pear","plum","cherry","berry",
  "mango","lemon","lime","coconut","papaya","kiwi","fig","date","apricot","guava",
  "table","chair","window","door","floor","ceiling","wall","lamp","candle","mirror",
  "pillow","blanket","sofa","shelf","drawer","closet","carpet","curtain","desk","stool",
  "river","ocean","mountain","valley","forest","jungle","desert","island","beach","lake",
  "stream","waterfall","canyon","hill","plain","field","meadow","garden","flower","tree",
  "dog","cat","mouse","horse","sheep","goat","cow","tiger","lion","zebra",
  "monkey","rabbit","fox","wolf","bear","deer","panda","camel","eagle","shark",
  "red","blue","green","yellow","purple","orange","black","white","silver","gold",
  "brown","gray","pink","violet","indigo","scarlet","crimson","navy","teal","beige",
  "happy","sad","angry","calm","brave","kind","smart","quick","slow","strong",
  "weak","gentle","proud","shy","bold","funny","honest","loyal","clever","wise",
  "run","walk","jump","swim","dance","sing","write","read","draw","build",
  "drive","ride","fly","cook","bake","paint","clean","laugh","smile","think",
  "book","paper","pencil","eraser","marker","notebook","folder","letter","story","poem",
  "school","teacher","student","class","lesson","exam","quiz","answer","question","degree",
  "sun","moon","star","planet","cloud","rain","storm","snow","wind","thunder",
  "summer","winter","spring","autumn","morning","evening","night","noon","dawn","twilight",
  "bread","rice","pasta","cheese","butter","milk","coffee","tea","juice","water",
  "sugar","salt","pepper","onion","garlic","potato","tomato","carrot","lettuce","cabbage",
  "phone","laptop","tablet","screen","keyboard","mouse","camera","printer","router","server",
  "internet","browser","button","window","folder","file","upload","download","search","click",
  "music","guitar","piano","violin","drum","trumpet","flute","singer","artist","melody",
  "movie","actor","scene","script","camera","studio","poster","ticket","screen","theater",
  "city","village","country","nation","street","bridge","station","airport","harbor","market",
  "office","bank","hospital","museum","library","hotel","restaurant","school","factory","store",
  "friend","family","mother","father","sister","brother","uncle","aunt","cousin","child",
  "baby","adult","person","people","neighbor","guest","leader","worker","doctor","nurse",
  "money","price","value","cost","budget","income","profit","loss","salary","tax",
  "market","trade","stock","bond","credit","debit","loan","cash","wallet","coin",
  "light","dark","shadow","bright","glow","flash","spark","flame","smoke","dust",
  "energy","power","force","speed","motion","gravity","sound","noise","voice","echo",
  "game","sport","soccer","tennis","golf","boxing","racing","cycling","skiing","rowing",
  "team","coach","player","score","match","league","trophy","medal","record","victory",
  "idea","dream","goal","plan","hope","future","memory","thought","reason","choice",
  "truth","fact","logic","method","result","chance","risk","success","failure","lesson",
  "clock","watch","timer","calendar","schedule","minute","hour","second","week","month",
  "year","today","tomorrow","yesterday","holiday","birthday","festival","party","meeting","event",
  "road","path","trail","highway","tunnel","corner","signal","garage","parking","vehicle",
  "car","truck","bus","train","bicycle","motorcycle","boat","ship","plane","rocket",
  "shirt","pants","dress","jacket","coat","hat","shoe","sock","glove","belt",
  "ring","watch","bracelet","necklace","button","zipper","fabric","cotton","wool","silk",
  "health","fitness","muscle","bone","heart","brain","blood","skin","vision","hearing",
  "medicine","vitamin","doctor","clinic","surgery","therapy","disease","fever","injury","recovery",
  "code","array","object","string","number","boolean","function","class","module","package",
  "python","java","swift","kotlin","ruby","golang","html","css","react","node",
  "cloud","docker","linux","git","branch","merge","commit","deploy","debug","compile",
  "north","south","east","west","center","left","right","top","bottom","middle",
  "inside","outside","above","below","near","far","front","back","around","across",
  "shape","circle","square","triangle","line","curve","angle","point","pattern","design",
  "image","photo","picture","drawing","painting","poster","icon","symbol","logo","banner",
  "metal","wood","stone","glass","plastic","rubber","paper","steel","iron","gold",
  "silver","copper","bronze","marble","brick","cement","clay","sand","soil","mud",
  "travel","journey","trip","tour","adventure","voyage","ticket","passport","luggage","guide",
  "hotel","resort","cabin","camp","tent","map","route","destination","arrival","departure",
  "peace","war","law","order","freedom","justice","rights","duty","honor","trust",
  "culture","language","history","art","science","nature","society","religion","custom","tradition",
  "alpha","beta","gamma","delta","omega","pixel","vector","matrix","signal","system",
  "network","device","sensor","engine","motor","circuit","battery","charge","voltage","current",
  "market","growth","brand","client","service","support","review","rating","feedback","launch",
  "coffee","latte","mocha","espresso","cappuccino","matcha","herbal","vanilla","chocolate","cookie",
  "winter","summer","rainy","sunny","foggy","stormy","icy","humid","dry","breezy"
];

function titleCase(word) {
    if (!word) return '';
    return `${word[0].toUpperCase()}${word.slice(1).toLowerCase()}`;
}

export function generateGameName() {
    return shuffle(wordList.slice()).slice(0, 3).map(titleCase).join(' ');
}
