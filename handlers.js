// Main content container
const content = document.getElementById("content");

// Notepad and header for dragging functionality
const notepad = document.getElementById("notepad-outer");
const notepadHeader = document.getElementById("notepad-header");

// Calculator and header for dragging functionality
const calculator = document.getElementById("calc-outer");
const calculatorHeader = document.getElementById("calc-header");

// Default note variables
const note = document.getElementById("note");
const noteHandle = document.getElementById("note-handle");
const killswitch = document.getElementById("killswitch");
const partytrigger = document.getElementById("note-trigger");

// Variables for calculator operations
let currentInput = ""; // Stores current user input
let operator = ""; // Stores the selected operator
let firstOperand = null; // Stores the first operand for calculations
const resultWindow = document.getElementById("result-window"); // Calculator display

// Variables for drag functionality
let isDragging = false;
let offsetX = 0;
let offsetY = 0;
let lastIndex = 10; // Tracks z-index for current element focus

/**
 * Evaluates the mathematical expression based on given operands and operator.
 * @param {number} a - First operand
 * @param {number} b - Second operand
 * @param {string} op - Operator (+, -, *, /)
 * @returns {number|string} - Returns the computed result or "Error" for division by zero
 */
function evaluate(a, b, op) {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return b !== 0 ? a / b : "Error";
    default:
      return b;
  }
}

// Click handlers
document.addEventListener("click", (event) => {
  let nextIndex = lastIndex + 1;

  // Bring clicked elements to the front
  if (notepad.contains(event.target)) {
    notepad.style.zIndex = nextIndex;
  }

  if (calculator.contains(event.target)) {
    calculator.style.zIndex = nextIndex;
  }

  if (content.contains(event.target)) {
    content.style.zIndex = nextIndex;
  }

  if (note.contains(event.target)) {
    note.style.zIndex = nextIndex;
  }

  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("kill")) {
      event.target.closest(".note").remove();
    }
  });

  // Handle calculator button clicks
  if (event.target.classList.contains("button-square")) {
    event.target.classList.add("animate-press");
    setTimeout(() => event.target.classList.remove("animate-press"), 100);

    let value = event.target.innerText;

    if (!isNaN(value) || value === ".") {
      // Append digit or decimal
      currentInput += value;
      resultWindow.innerText = currentInput;
    } else if (["+", "-", "*", "/"].includes(value)) {
      // Handle operator
      if (firstOperand === null) {
        firstOperand = parseFloat(currentInput);
      } else if (currentInput !== "") {
        firstOperand = evaluate(
          firstOperand,
          parseFloat(currentInput),
          operator
        );
        resultWindow.innerText = firstOperand;
      }
      operator = value;
      currentInput = "";
    } else if (value === "=") {
      // Handle equals
      if (firstOperand !== null && currentInput !== "") {
        resultWindow.innerText = evaluate(
          firstOperand,
          parseFloat(currentInput),
          operator
        );
        firstOperand = null;
        currentInput = "";
        operator = "";
      }
    } else if (value === "C") {
      // Handle clear
      currentInput = "";
      firstOperand = null;
      operator = "";
      resultWindow.innerText = "0";
    } else if (value === "+-") {
      // Toggle positive/negative
      if (currentInput !== "") {
        currentInput = (-parseFloat(currentInput)).toString();
        resultWindow.innerText = currentInput;
      }
    } else if (value === "%") {
      // Convert to percentage
      if (currentInput !== "") {
        currentInput = (parseFloat(currentInput) / 100).toString();
        resultWindow.innerText = currentInput;
      }
    }
  }

  lastIndex = nextIndex;
});

// Drag
document.addEventListener("mousedown", (event) => {
  let nextIndex = lastIndex + 1;

  if (notepadHeader.contains(event.target)) {
    if (!notepad.classList.contains("active")) {
      notepad.style.zIndex = nextIndex;
    }
    document.body.classList.add("interacting");
    notepadHeader.classList.add("grabbing");
    offsetX = event.clientX - notepad.offsetLeft;
    offsetY = event.clientY - notepad.offsetTop;
  }

  if (calculatorHeader.contains(event.target)) {
    if (!calculator.classList.contains("active")) {
      calculator.style.zIndex = nextIndex;
    }
    document.body.classList.add("interacting");
    calculatorHeader.classList.add("grabbing");
    offsetX = event.clientX - calculator.offsetLeft;
    offsetY = event.clientY - calculator.offsetTop;
  }

  if (noteHandle.contains(event.target)) {
    if (!note.classList.contains("active")) {
      note.style.zIndex = nextIndex;
    }
    document.body.classList.add("interacting");
    noteHandle.classList.add("grabbing");
    offsetX = event.clientX - note.offsetLeft;
    offsetY = event.clientY - note.offsetTop;
  }

  isDragging = true;
  lastIndex = nextIndex;
});

document.addEventListener("mouseup", () => {
  if (notepadHeader.classList.contains("grabbing")) {
    notepadHeader.classList.remove("grabbing");
  }
  if (calculatorHeader.classList.contains("grabbing")) {
    calculatorHeader.classList.remove("grabbing");
  }
  if (noteHandle.classList.contains("grabbing")) {
    noteHandle.classList.remove("grabbing");
  }
  document.body.classList.remove("interacting");
  isDragging = false;
  offsetX = 0;
  offsetY = 0;
});

document.addEventListener("mousemove", (event) => {
  if (!isDragging) return;

  let target = null;
  if (notepadHeader.classList.contains("grabbing")) target = notepad;
  if (calculatorHeader.classList.contains("grabbing")) target = calculator;
  if (noteHandle.classList.contains("grabbing")) target = note;

  if (target) {
    target.style.left = `${event.clientX - offsetX}px`;
    target.style.top = `${event.clientY - offsetY}px`;
  }
});

function validateNotepadText(text) {
  const bannedWords = [
    "2g1c",
    "2 girls 1 cup",
    "acrotomophilia",
    "alabama hot pocket",
    "alaskan pipeline",
    "anal",
    "anilingus",
    "anus",
    "apeshit",
    "arsehole",
    "ass",
    "asshole",
    "assmunch",
    "auto erotic",
    "autoerotic",
    "babeland",
    "baby batter",
    "baby juice",
    "ball gag",
    "ball gravy",
    "ball kicking",
    "ball licking",
    "ball sack",
    "ball sucking",
    "bangbros",
    "bareback",
    "barely legal",
    "barenaked",
    "bastard",
    "bastardo",
    "bastinado",
    "bbw",
    "bdsm",
    "beaner",
    "beaners",
    "beaver cleaver",
    "beaver lips",
    "bestiality",
    "big black",
    "big breasts",
    "big knockers",
    "big tits",
    "bimbos",
    "birdlock",
    "bitch",
    "bitches",
    "black cock",
    "blonde action",
    "blonde on blonde action",
    "blowjob",
    "blow job",
    "blow your load",
    "blue waffle",
    "blumpkin",
    "bollocks",
    "bondage",
    "boner",
    "boob",
    "boobs",
    "booty call",
    "brown showers",
    "brunette action",
    "bukkake",
    "bulldyke",
    "bullet vibe",
    "bullshit",
    "bung hole",
    "bunghole",
    "busty",
    "butt",
    "buttcheeks",
    "butthole",
    "camel toe",
    "camgirl",
    "camslut",
    "camwhore",
    "carpet muncher",
    "carpetmuncher",
    "chocolate rosebuds",
    "circlejerk",
    "cleveland steamer",
    "clit",
    "clitoris",
    "clover clamps",
    "clusterfuck",
    "cock",
    "cocks",
    "coprolagnia",
    "coprophilia",
    "cornhole",
    "coon",
    "coons",
    "creampie",
    "cum",
    "cumming",
    "cunnilingus",
    "cunt",
    "darkie",
    "date rape",
    "daterape",
    "deep throat",
    "deepthroat",
    "dendrophilia",
    "dick",
    "dildo",
    "dingleberry",
    "dingleberries",
    "dirty pillows",
    "dirty sanchez",
    "doggie style",
    "doggiestyle",
    "doggy style",
    "doggystyle",
    "dog style",
    "dolcett",
    "domination",
    "dominatrix",
    "dommes",
    "donkey punch",
    "double dong",
    "double penetration",
    "dp action",
    "dry hump",
    "dvda",
    "eat my ass",
    "ecchi",
    "ejaculation",
    "erotic",
    "erotism",
    "escort",
    "eunuch",
    "faggot",
    "fecal",
    "felch",
    "fellatio",
    "feltch",
    "female squirting",
    "femdom",
    "figging",
    "fingerbang",
    "fingering",
    "fisting",
    "foot fetish",
    "footjob",
    "frotting",
    "fuck",
    "fuck buttons",
    "fuckin",
    "fucking",
    "fucktards",
    "fudge packer",
    "fudgepacker",
    "futanari",
    "gang bang",
    "gay sex",
    "genitals",
    "giant cock",
    "girl on",
    "girl on top",
    "girls gone wild",
    "goatcx",
    "goatse",
    "god damn",
    "gokkun",
    "golden shower",
    "goodpoop",
    "goo girl",
    "goregasm",
    "grope",
    "group sex",
    "g-spot",
    "guro",
    "hand job",
    "handjob",
    "hard core",
    "hardcore",
    "hentai",
    "homoerotic",
    "honkey",
    "hooker",
    "hot carl",
    "hot chick",
    "how to kill",
    "how to murder",
    "huge fat",
    "humping",
    "incest",
    "intercourse",
    "jack off",
    "jail bait",
    "jailbait",
    "jelly donut",
    "jerk off",
    "jigaboo",
    "jiggaboo",
    "jiggerboo",
    "jizz",
    "juggs",
    "kike",
    "kinbaku",
    "kinkster",
    "kinky",
    "knobbing",
    "leather restraint",
    "leather straight jacket",
    "lemon party",
    "lolita",
    "lovemaking",
    "make me come",
    "male squirting",
    "masturbate",
    "menage a trois",
    "milf",
    "missionary position",
    "motherfucker",
    "mound of venus",
    "mr hands",
    "muff diver",
    "muffdiving",
    "nambla",
    "nawashi",
    "negro",
    "neonazi",
    "nigga",
    "nigger",
    "nig nog",
    "nimphomania",
    "nipple",
    "nipples",
    "nsfw images",
    "nude",
    "nudity",
    "nympho",
    "nymphomania",
    "octopussy",
    "omorashi",
    "one cup two girls",
    "one guy one jar",
    "orgasm",
    "orgy",
    "paedophile",
    "paki",
    "panties",
    "panty",
    "pedobear",
    "pedophile",
    "pegging",
    "penis",
    "phone sex",
    "piece of shit",
    "pissing",
    "piss pig",
    "pisspig",
    "playboy",
    "pleasure chest",
    "pole smoker",
    "ponyplay",
    "poof",
    "poon",
    "poontang",
    "punany",
    "poop chute",
    "poopchute",
    "porn",
    "porno",
    "pornography",
    "prince albert piercing",
    "pthc",
    "pubes",
    "pussy",
    "queaf",
    "queef",
    "quim",
    "raghead",
    "raging boner",
    "rape",
    "raping",
    "rapist",
    "rectum",
    "reverse cowgirl",
    "rimjob",
    "rimming",
    "rosy palm",
    "rosy palm and her 5 sisters",
    "rusty trombone",
    "sadism",
    "santorum",
    "scat",
    "schlong",
    "scissoring",
    "semen",
    "sex",
    "sexo",
    "sexy",
    "shaved beaver",
    "shaved pussy",
    "shemale",
    "shibari",
    "shit",
    "shitblimp",
    "shitty",
    "shota",
    "shrimping",
    "skeet",
    "slanteye",
    "slut",
    "s&m",
    "smut",
    "snatch",
    "snowballing",
    "sodomize",
    "sodomy",
    "spic",
    "splooge",
    "splooge moose",
    "spooge",
    "spread legs",
    "spunk",
    "strap on",
    "strapon",
    "strappado",
    "strip club",
    "style doggy",
    "suck",
    "sucks",
    "suicide girls",
    "sultry women",
    "swastika",
    "swinger",
    "tainted love",
    "taste my",
    "tea bagging",
    "threesome",
    "throating",
    "tied up",
    "tight white",
    "tit",
    "tits",
    "titties",
    "titty",
    "tongue in a",
    "topless",
    "tosser",
    "towelhead",
    "tranny",
    "tribadism",
    "tub girl",
    "tubgirl",
    "tushy",
    "twat",
    "twink",
    "twinkie",
    "two girls one cup",
    "undressing",
    "upskirt",
    "urethra play",
    "urophilia",
    "vagina",
    "venus mound",
    "vibrator",
    "violet wand",
    "vorarephilia",
    "voyeur",
    "vulva",
    "wank",
    "wetback",
    "wet dream",
    "white power",
    "wrapping men",
    "wrinkled starfish",
    "xx",
    "xxx",
    "yaoi",
    "yellow showers",
    "yiffy",
    "zoophilia",
    "🖕"
  ];
  
  const lowerText = text.toLowerCase();
  
  for (const banned of bannedWords) {
    if (lowerText.includes(banned)) {
      throw new Error(`Banned content found: "${banned}"`);
    }
  }
}

document.addEventListener("keydown", (event) => {
  const notepadText = document.getElementById("notepad-text");

  if (event.key === "Enter" && document.activeElement === notepadText) {
    try {
      validateNotepadText(notepadText.value);
      createNewNote();
    } catch (error) {
      alert(error.message);
      event.preventDefault();
    }
  }

});

let noteCounter = 0;

function createNewNote() {
  const notepadText = document.getElementById("notepad-text");
  const noteContent = notepadText.value.trim();

  if (!noteContent) return;

  noteCounter++;

  const newNote = document.createElement("div");
  newNote.id = `note-${noteCounter}`;
  newNote.classList.add("note");
  newNote.style.position = "absolute";
  newNote.style.left = `${Math.random() * (window.innerWidth - 200)}px`;
  newNote.style.top = `${Math.random() * (window.innerHeight - 200)}px`;

  const noteHandle = document.createElement("div");
  noteHandle.id = `note-${noteCounter}-handle`;
  noteHandle.classList.add("note-handle");

  const killSwitch = document.createElement("div");
  killSwitch.id = `note-${noteCounter}-killswitch`;
  killSwitch.classList.add("kill");
  killSwitch.addEventListener("click", () => newNote.remove());

  const noteText = document.createElement("p");
  noteText.id = `note-${noteCounter}-text`;
  noteText.innerText = noteContent;

  noteHandle.appendChild(killSwitch);
  newNote.appendChild(noteHandle);
  newNote.appendChild(noteText);
  document.body.appendChild(newNote);
  newNote.style.zIndex = ++lastIndex;

  makeDraggable(newNote, noteHandle);
}

function makeDraggable(element, handle) {
  let offsetX = 0,
    offsetY = 0,
    isDragging = false;

  handle.addEventListener("mousedown", (event) => {
    isDragging = true;
    offsetX = event.clientX - element.offsetLeft;
    offsetY = event.clientY - element.offsetTop;
    element.style.zIndex = ++lastIndex;
    document.body.classList.add("interacting");
  });

  document.addEventListener("mousemove", (event) => {
    if (isDragging) {
      element.style.left = `${event.clientX - offsetX}px`;
      element.style.top = `${event.clientY - offsetY}px`;
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    document.body.classList.remove("interacting");
  });
}

