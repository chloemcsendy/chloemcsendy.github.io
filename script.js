const video        = document.getElementById('video');
const snapshot     = document.getElementById('snapshot');
const photoPreview = document.getElementById('photo-preview');
const captureBtn   = document.getElementById('capture-btn');
const retakeBtn    = document.getElementById('retake-btn');
const confirmBtn   = document.getElementById('confirm-btn');
const restartBtn = document.getElementById('restart-btn');


// State
let currentQ      = 0;
let currentPuzzle = 0;
let photoData     = "";
let selectedMatches = [];
let currentCode   = "";



// --- PHOTO CAPTURE LOGIC ---
captureBtn.onclick = () => {
  // snapshot into canvas
  snapshot.width  = video.videoWidth;
  snapshot.height = video.videoHeight;
  snapshot.getContext('2d').drawImage(video, 0, 0);

  // show the frozen frame
  photoPreview.src           = snapshot.toDataURL();
  photoPreview.style.display = 'block';
  video.style.display        = 'none';

  // swap buttons
  captureBtn.style.display = 'none';
  retakeBtn.style.display  = 'inline-block';
  confirmBtn.style.display = 'inline-block';
  

  // save for briefing
  photoData = photoPreview.src;
  document.getElementById('verification-screen')
        .classList.add('preview-only');
};

retakeBtn.onclick = () => {
  photoPreview.style.display = 'none';
  video.style.display        = 'block';

  captureBtn.style.display = 'inline-block';
  retakeBtn.style.display  = 'none';
  confirmBtn.style.display = 'none';
};

confirmBtn.onclick = () => {
  const nameInput = document
    .getElementById('agent-name-input')
    .value
    .trim();
  agentName = nameInput || 'Unknown';
  submitAgent();
};

// --- BRIEFING SEQUENCE ---
function submitAgent() {
  document.getElementById('agent-name-display').textContent = 'Agent ' + agentName;
  document.getElementById('agent-photo-preview').src       = photoData;
  document.getElementById('agent-info').style.display      = 'flex';
  const badge = document.getElementById('agent-info');
  badge.style.top       = '2rem';
  badge.style.transform = 'scale(0.9)';
  document.querySelector('h1').style.marginTop = '4rem';

  // hide the Begin Mission button until the typing is done
  document.getElementById('begin-mission-btn').classList.add('hidden');

  // switch to briefing screen
  showScreen('briefing-screen');

  // animate folder open + typewriter
  setTimeout(() => {
    document.getElementById('folder').classList.add('folder-open');
    setTimeout(() => {
      const bodyText =
        'Agent ' + agentName + ', AI infiltration poses a growing threat to global security. ' +
        'Your mission: Master the art of AI detection and learn to navigate digital environments safely. ' +
        'Study the patterns, trust your instincts, and remember - the enemy may not be human...';

      typeWriter(
        document.getElementById('briefing-text'),
        bodyText,
        30,
        () => document.getElementById('begin-mission-btn').classList.remove('hidden')
      );
    }, 800);
  }, 400);
}

// --- TYPEWRITER / INTRO LOGIC ---
function typeWriter(el, text, speed, callback) {
  el.innerHTML = '';
  let i = 0;
  function type() {
    if (i < text.length) {
      el.innerHTML += text.charAt(i++);
      setTimeout(type, speed);
    } else if (callback) {
      callback();
    }
  }
  type();
}

document.addEventListener("DOMContentLoaded", () => {
  // Intro typewriter
  typeWriter(
    document.getElementById('typed-title'),
    'MISSION: POSSIBLE',
    100,
    () => {
      typeWriter(
        document.getElementById('typed-subtitle'),
        'Highly classified training programme to counter AI threats',
        60,
        () => document.getElementById('start-btn').classList.remove('hidden')
      );
    }
  );

  // Restart‐mission hook
  const restartBtn = document.getElementById('restart-btn');
  if (restartBtn) {
    restartBtn.onclick = () => {
      location.reload();
    };
  }
});



// --- NAVIGATION HELPERS ---
function goToVerification() {
  showScreen('verification-screen');
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => video.srcObject = stream)
    .catch(() => alert('Camera access is required.'));
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

// --- QUIZ DATA & LOGIC ---
const questions = [
  {
    type: 'text-message',
    title: "An unknown contact sends you a text message. Something's off...",
    content: {
      messages: [
        { sender: 'unknown', text: 'Hello! Do you remember me? I need your help with something urgent.' },
        { sender: 'unknown', text: 'Can you please provide your full name and address?' },
        { sender: 'unknown', text: 'This is completely safe and secure, I promise.' }
      ],
      followUp: [
        { sender: 'unknown', text: '*Chat deleted by Unknown contact*' }
      ]
    },
    options: [
      ["Ask who they are first", true,  "Smart—always verify unknown senders!",   "Ummmm who are you exactly?"],
      ["Block and report",        false, "Good call—blocking suspicious contacts is safest.", "I’m going to block and report you."]
    ],
    detective: "Perfect spy instincts! You identified the scam."
  },
  {
  type: 'surveillance',
  title: "An alert went off in the surveillence room.",
  content: {
    videoSrc: "deepfakevideo.mp4"
  },
  question: "You're analyzing surveillance footage. The subject looks real but something seems off. What's your assessment?",
  options: [
    ["Footage is authentic", false, "Look closer - there are telltale signs of manipulation."],
    ["Possible deepfake",    true,  "Correct! The lip sync and eye movement inconsistencies are red flags."],
    ["Technical glitch",     false, "These patterns suggest deliberate manipulation, not technical issues."],
    ["Need more footage",    false, "The anomalies are clear enough to make an assessment."]
  ],
  detective: "Outstanding analysis! Deepfakes often have subtle tells: lip sync issues, unnatural eye movements, ..."
},

  {
    type: 'matching',
    title: "🔍 AI Pattern Recognition",
    content: {
      leftColumn: [
        "Perfect grammar",
        "Instant responses",
        "Generic phrases",
        "No personal details"
      ],
      rightColumn: [
        "Bot behavior",
        "Human conversation",
        "AI-generated text",
        "Automated system"
      ],
      correctMatches: [
        [0, 2], [1, 3], [2, 0], [3, 1]
      ]
    },
    question: "Match the AI indicators with their classifications:",
    detective: "Excellent pattern recognition! AI systems often display these telltale signs: overly perfect grammar, lightning-fast responses, repetitive or generic language patterns, and lack of personal experiences or details that humans naturally share."
  },
  {
    type: 'code-breaking',
    title: "🔐 Voice Authentication",
    content: {
      scenario: "You receive a call from your 'boss' asking for classified codes. The voice sounds right, but you need to verify their identity.",
      secretCode: "ALPHA7"
    },
    question: "Enter the verification code to test if this is really your boss:",
    options: [
      ["They know the code", true, "Good verification! If they know internal codes, they're likely legitimate."],
      ["They don't know", false, "Red flag! Voice cloning can't replicate internal knowledge."],
      ["They refuse to answer", false, "Major warning sign - legitimate contacts will verify their identity."],
      ["They get angry", false, "Emotional manipulation is a common scammer tactic."]
    ],
    detective: "Brilliant security protocol! Voice cloning technology can perfectly mimic someone's voice, but it can't replicate their private knowledge. Always verify with information only the real person would know - family secrets, work codes, or recent conversations."
  },
  {
    type: 'surveillance',
    title: "📱 Social Media Intelligence",
    content: {
      surveillance: true,
      imgSrc:'fakeigaccount.jpg'},
    question: "You're investigating a suspicious social media profile. What's your conclusion?",
    options: [
      ["Real person, very active", false, "The activity patterns are superhuman - no real person posts this much."],
      ["Bot or fake account", true, "Correct! The posting frequency and perfect content suggest automation."],
      ["Influencer account", false, "Even influencers have human posting patterns and personal content."],
      ["Business account", false, "Businesses don't typically add 5,000 friends in a week."]
    ],
    detective: "Excellent digital forensics! Bot accounts have distinctive patterns: impossibly high posting frequency, perfect grammar, generic stock images, and rapid friend/follower accumulation. Real humans have irregular posting patterns and personal imperfections."
  }
];

// --- PUZZLE DATA & LOGIC ---
const puzzles = [
  {
    type: 'safe-cracking',
    title: '🔐 Digital Safe Infiltration',
    instruction: 'Crack the AI security system by entering the correct 4-digit code. Hint: Think about the clues given at the start',
    correctCode: '2023',
    explanation: "Perfect! 2023 was a breakthrough year for AI technology. Many AI systems use significant dates in their security protocols. Real-world tip: Avoid using obvious dates or patterns in your own passwords!"
  },
  {
    type: 'laser-maze',
    title: '🔴 Laser Security Grid',
    instruction: 'Navigate through the laser grid by clicking the safe path. Red areas are laser beams!',
    gridSize: 5,
    safePath: [0, 5, 10, 15, 20],
    explanation: "Excellent stealth skills! In real digital security, AI systems often have multiple layers of protection. Understanding patterns and finding safe pathways is crucial for cybersecurity professionals."
  },
  {
    type: 'surveillance-hack',
    title: '📹 Surveillance System Override',
    instruction: 'Identify which camera feed is AI-generated to disable the security system.',
    feeds: [
      { id: 1, description: 'Normal office activity', isAI: false },
      { id: 2, description: 'Perfect lighting, no shadows', isAI: true },
      { id: 3, description: 'People walking naturally', isAI: false },
      { id: 4, description: 'Varied lighting conditions', isAI: false }
    ],
    correct: 1,
    explanation: "Outstanding detection! AI-generated video often has telltale signs like unnaturally perfect lighting, missing shadows, or too-smooth movements. These technical limitations help security experts identify synthetic media."
  }
];

function startQuiz() {
  showScreen('quiz-screen');
  loadQuestion();
  initScrollHint();    
}

function loadQuestion() {
  const q = questions[currentQ];
  if (!q) return console.error("No question found!");

  if (q.type === 'code-breaking') {
    window._pendingCodeQ = q;
    showScreen("incoming-call-screen");
    return;
  }
  document.getElementById("question-title").textContent = q.title;
  const progress = ((currentQ + 1) / questions.length) * 100;
  document.getElementById("progress-fill").style.width = progress + "%";

  const contentDiv = document.getElementById("question-content");
  const optDiv     = document.getElementById("question-options");
  contentDiv.innerHTML = "";
  optDiv.innerHTML     = "";

  if (q.type === 'text-message')      loadTextMessageQuestion(q, contentDiv, optDiv);
  else if (q.type === 'surveillance') loadSurveillanceQuestion(q, contentDiv, optDiv);
  else if (q.type === 'matching')     loadMatchingQuestion(q, contentDiv, optDiv);
}

function loadTextMessageQuestion(q, contentDiv, optDiv) {
  contentDiv = contentDiv || document.getElementById("question-content");
  optDiv     = optDiv     || document.getElementById("question-options");
  // 1) phone container
  const phoneDiv = document.createElement("div");
  phoneDiv.className = "phone-screen";
  contentDiv.appendChild(phoneDiv);

  // 2) initial NPC messages
  q.content.messages.forEach(msg => {
    const b = document.createElement("div");
    b.className = "message-bubble message-receiver";
    b.textContent = msg.text;
    phoneDiv.appendChild(b);
  });

  // 3) render exactly two answer buttons
  optDiv.innerHTML = "";
  q.options.forEach(([btnLabel, isCorrect, feedback, sendText]) => {
    const btn = document.createElement("button");
    btn.textContent = btnLabel;
    btn.onclick = () => {
      // a) append custom “you” bubble
      const you = document.createElement("div");
      you.className = "message-bubble message-sender";
      you.textContent = sendText;
      phoneDiv.appendChild(you);

      // b) clear buttons
      optDiv.innerHTML = "";

      // c) after 1s, show followUp bubble(s)
      setTimeout(() => {
        q.content.followUp.forEach(msg => {
          const b2 = document.createElement("div");
          b2.className = "message-bubble message-receiver";
          b2.textContent = msg.text;
          phoneDiv.appendChild(b2);
        });

        // d) after another 1s, show feedback screen
        setTimeout(() => {
          answerQuestion(isCorrect, feedback);
        }, 3000);   // feedback delay
      }, 2000);     // followUp delay

    };
    optDiv.appendChild(btn);
  });
}



function loadSurveillanceQuestion(q, contentDiv, optDiv) {
  contentDiv = contentDiv || document.getElementById("question-content");
  optDiv     = optDiv     || document.getElementById("question-options");
  // clear previous
  contentDiv.innerHTML = '';
  optDiv.innerHTML     = '';

  // 1) Create a horizontal wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'surveillance-container';

  // 2) Build the video pane
  const survDiv = document.createElement('div');
  survDiv.className = 'surveillance-screen';
  // if there's a video file
  if (q.content.videoSrc) {
    const vid = document.createElement('video');
    vid.src      = q.content.videoSrc;
    vid.autoplay = true;
    vid.loop     = true;
    vid.controls = true;
    survDiv.appendChild(vid);
  } else if (q.content.text) {
    survDiv.innerHTML = q.content.text.replace(/\n/g,'<br>');
  }

  // 3) Build the options pane
  q.options.forEach(([text, isCorrect, feedback]) => {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.onclick = () => {
      const vid = survDiv.querySelector('video');
      if (vid) vid.pause();
      answerQuestion(isCorrect, feedback);
    };
    optDiv.appendChild(btn);
  });

  // 4) Assemble
  wrapper.appendChild(survDiv);
  wrapper.appendChild(optDiv);
  contentDiv.appendChild(wrapper);

  // 5) Now add the question prompt under the H2
  const questionP = document.createElement('p');
  questionP.textContent        = q.question;
  questionP.style.margin       = '1rem 0';
  contentDiv.insertBefore(questionP, wrapper);
}

// MATCHING QNS //
function loadMatchingQuestion(q, contentDiv, optDiv) {
  contentDiv = contentDiv || document.getElementById("question-content");
  optDiv     = optDiv     || document.getElementById("question-options");

  matchedPairs = [];
  contentDiv.innerHTML = '';
  optDiv.innerHTML     = '';

  const questionP = document.createElement('p');
  questionP.className   = 'match-prompt';
  questionP.textContent = q.question || 'Match the AI indicators with their classifications:';
  contentDiv.appendChild(questionP);

 
  const matchDiv = document.createElement('div');
  matchDiv.className   = 'match-container';
  matchDiv.style.position = 'relative';

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg   = document.createElementNS(svgNS, 'svg');
  Object.assign(svg.style, {
    position: 'absolute', top: 0, left: 0,
    width: '100%', height: '100%',
    pointerEvents: 'none'
  });
  matchDiv.appendChild(svg);

  const leftCol  = document.createElement('div');
  leftCol.className  = 'match-column';
  const rightCol = document.createElement('div');
  rightCol.className = 'match-column';
  function getPoint(el, side) {
    const r1 = el.getBoundingClientRect();
    const r2 = matchDiv.getBoundingClientRect();
    const y  = r1.top + r1.height/2 - r2.top;
    const x  = side === 'left'
      ? r1.right - r2.left
      : r1.left  - r2.left;
    return { x, y };
  }

  let currentLine = null, startIndex = null;
  function onMouseMove(e) {
    if (!currentLine) return;
    const r2 = matchDiv.getBoundingClientRect();
    currentLine.setAttribute('x2', e.clientX - r2.left);
    currentLine.setAttribute('y2', e.clientY - r2.top);
  }

  q.content.leftColumn.forEach((text,i) => {
    const itm = document.createElement('div');
    itm.className    = 'match-item';
    itm.textContent = text;
    itm.addEventListener('mousedown', () => {
      const { x, y } = getPoint(itm, 'left');
      startIndex = i;
      currentLine = document.createElementNS(svgNS,'line');
      currentLine.setAttribute('x1', x);
      currentLine.setAttribute('y1', y);
      currentLine.setAttribute('x2', x);
      currentLine.setAttribute('y2', y);
      currentLine.setAttribute('stroke', '#DC143C');
      currentLine.setAttribute('stroke-width','3');
      svg.appendChild(currentLine);
      window.addEventListener('mousemove', onMouseMove);
    });
    leftCol.appendChild(itm);
  });

  q.content.rightColumn.forEach((text,j) => {
    const itm = document.createElement('div');
    itm.className    = 'match-item';
    itm.textContent = text;
    itm.addEventListener('mouseup', () => {
      if (!currentLine) return;
      const { x, y } = getPoint(itm, 'right');
      currentLine.setAttribute('x2', x);
      currentLine.setAttribute('y2', y);
      matchedPairs.push([ startIndex, j ]);
      window.removeEventListener('mousemove', onMouseMove);
      currentLine = null;
      startIndex  = null;
    });
    rightCol.appendChild(itm);
  });

  matchDiv.appendChild(leftCol);
  matchDiv.appendChild(rightCol);
  contentDiv.appendChild(matchDiv);

  const submitBtn = document.createElement('button');
  submitBtn.textContent = 'Submit Matches';
  submitBtn.className   = 'submit-matches-btn';
  submitBtn.onclick     = () => checkMatches(q);

  const submitWrapper = document.createElement('div');
  submitWrapper.className = 'submit-wrapper';
  submitWrapper.appendChild(submitBtn);

  contentDiv.appendChild(submitWrapper);
}


function checkMatches(q) {
  const correctMatches = q.content.correctMatches;
  let correct = 0;
  matchedPairs.forEach(([l, r]) => {
    if (correctMatches.some(c => c[0] === l && c[1] === r)) correct++;
  });

  if (correct === correctMatches.length) {
    answerQuestion(true, "Perfect matching! You correctly identified all AI patterns.");
  } else {
    alert(`You got ${correct}/${correctMatches.length} correct. Try again!`);
    loadMatchingQuestion(
      q,
      document.getElementById('question-content'),
      document.getElementById('question-options')
    );
  }
}


function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

function loadCodeBreakingQuestion(q, contentDiv, optDiv) {
  contentDiv = contentDiv || document.getElementById("question-content");
  optDiv     = optDiv     || document.getElementById("question-options");
  window._pendingCodeQ = q;
  contentDiv.innerHTML = "";
  optDiv.innerHTML = "";
  showScreen("incoming-call-screen");
  const ringtone = document.getElementById("ringtone-audio");
  ringtone.currentTime = 0;
}

function answerCall() {
  const ringtone = document.getElementById("ringtone-audio");
  ringtone.pause();
  ringtone.currentTime = 0;

  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  showScreen("audio-playback-screen");

  const audio = document.getElementById("boss-audio");
  const subs  = document.getElementById("subtitles");
  const lines = [
    "Agent, it's chaos.",
    "We triggered a Level 5 lockdown.",
    "You're the only one with override access.",
    "Get to the terminal and enter your code.",
    "You remember it, right?"
  ];
  let idx = 0;

  audio.currentTime = 0;
  audio.play().catch(() => {});

  function nextLine() {
    if (idx < lines.length) {
      subs.textContent = lines[idx++];
      setTimeout(nextLine, 2000);
    } else {
      showScreen("code-entry-screen");
    }
  }

  nextLine();
}



function checkCode() {
  const input    = document.getElementById("override-code").value.trim().toUpperCase();
  const response = document.getElementById("code-response");

  if (input === "ALPHA7") {
    response.textContent = "✅ Override accepted. Emergency access granted.";
    response.style.color = "#00FF00";

    setTimeout(() => {
      showScreen("quiz-screen");
      const q = window._pendingCodeQ;
      if (q) answerQuestion(true, q.options[0][2]);
    }, 1500);

  } else {
    response.textContent = "❌ Invalid code. Lockdown remains in effect.";
    response.style.color = "#FF4444";
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const answerBtn = document.getElementById("answer-btn");
  const submitBtn = document.getElementById("code-submit");

  if (answerBtn) answerBtn.onclick = answerCall;
  if (submitBtn) submitBtn.onclick = checkCode;
});



function answerQuestion(isCorrect, feedback) {
  document.getElementById("quiz-screen").classList.add("hidden");
  if (isCorrect) {
    document.getElementById("correct-message").textContent = feedback;
    document.getElementById("correct-feedback").classList.remove("hidden");
  } else {
    document.getElementById("wrong-message").textContent = feedback;
    document.getElementById("wrong-feedback").classList.remove("hidden");
  }
}

function showDetective() {
  document.getElementById("correct-feedback").classList.add("hidden");
  document.getElementById("detective-explanation").textContent =
    questions[currentQ].detective;
  const detImg = document.querySelector(".detective-img");
  detImg.src = "detective-photo.jpg";
  detImg.alt = "Detective Portrait";
  document.getElementById("detective-screen").classList.remove("hidden");
}


function continueFromDetective() {
  document.getElementById("detective-screen").classList.add("hidden");
  nextQuestion();
}
function tryAgain() {
  document.getElementById("wrong-feedback").classList.add("hidden");
  showScreen('quiz-screen');
  loadQuestion();
  initScrollHint();
}

function nextQuestion() {
  currentQ++;
  if (currentQ < questions.length) {
    showScreen('quiz-screen');
    loadQuestion();
    initScrollHint();
  } else {
    showRedTwist();
  }
}
// countdown function
function startCountdown() {
    const countdownEl = document.getElementById("countdown");
    const tickAudio = document.getElementById("tick-sound");
    const escapeBtn = document.getElementById("escape-btn");

    let time = 10;

    countdownEl.textContent = time;
    countdownEl.classList.remove("countdown-animate");
    tickAudio.play();

    const interval = setInterval(() => {
        time--;

        // Show fake error popup each second
        for (let i=0;i<=5;i+=1){
            spawnErrorPopup();
        }

        if (time === 0) {
          clearInterval(interval);
          countdownEl.textContent = 0;
          escapeBtn.classList.add("show");  
  return;
}

        countdownEl.textContent = time;
        countdownEl.classList.remove("countdown-animate");
        void countdownEl.offsetHeight;
        countdownEl.classList.add("countdown-animate");
    }, 1000);
}

//error message 
function spawnErrorPopup() {
  // find or create the container
  let popupContainer = document.getElementById("popup-container");
  if (!popupContainer) {
    popupContainer = document.createElement("div");
    popupContainer.id = "popup-container";
    document.body.appendChild(popupContainer);
    // (you might need to add CSS: #popup-container { position: fixed; inset: 0; pointer-events: none; } )
  }

  const popup = document.createElement("div");
  popup.classList.add("error-popup");
  // random position
  const x = Math.random() * (window.innerWidth - 260);
  const y = Math.random() * (window.innerHeight - 140);
  popup.style.left = `${x}px`;
  popup.style.top  = `${y}px`;

  const messages = [
    "SYSTEM.EXE has stopped working.",
    "AI breach in core memory!",
    "Access Denied: Error 403",
    "Fatal Exception 0xDEADCAFE",
    "WARNING: Firewall Breached!",
    "Unexpected Error Occurred.",
    "Security Violation Detected!"
  ];
  popup.textContent = messages[
    Math.floor(Math.random() * messages.length)
  ];

  popupContainer.appendChild(popup);

  // auto-remove after 1.5–4.5s
  const duration = Math.random() * 3000 + 1500;
  setTimeout(() => popup.remove(), duration);
}


function showRedTwist() {
  // show the red-screen
  document.getElementById("red-screen").classList.remove("hidden");
  startCountdown();

  // find or create warning-signs container
  let warnDiv = document.getElementById("warning-signs");
  if (!warnDiv) {
    warnDiv = document.createElement("div");
    warnDiv.id = "warning-signs";
    document.getElementById("red-screen").appendChild(warnDiv);
    // (you might need CSS: #warning-signs { position: absolute; inset: 0; pointer-events: none; })
  }

  // stop after 11s, clear and reveal escape button
  setTimeout(() => {
    clearInterval(warningInterval);
    warnDiv.innerHTML = "";
  }, 11000);
}


// start of segment 2 
function beginEscape() {
    document.getElementById("red-screen").classList.add("hidden");
    document.getElementById("escape-screen").classList.remove("hidden");
    loadPuzzle();
}


//scroll function for quiz pages 
function initScrollHint() {
  const quiz = document.getElementById('quiz-screen');
  quiz.classList.remove('scrolled');
  function hideHint() {
    quiz.classList.add('scrolled');
    quiz.removeEventListener('scroll', hideHint);
  }
  quiz.addEventListener('scroll', hideHint, { once: true });
  setTimeout(() => quiz.classList.add('scrolled'), 3000);
}

//puzzle games
function loadPuzzle() {
  const puzzle = puzzles[currentPuzzle];
  document.getElementById("puzzle-title").textContent = puzzle.title;
  document.getElementById("puzzle-instruction").textContent = puzzle.instruction;
  document.getElementById("puzzle-result").textContent = "";
  document.getElementById("retry-section").classList.add("hidden");
  const container = document.getElementById("puzzle-container");
  container.innerHTML = "";
  if (puzzle.type === 'safe-cracking') loadSafeCrackingPuzzle(puzzle, container);
  else if (puzzle.type === 'laser-maze') loadLaserMazePuzzle(puzzle, container);
  else if (puzzle.type === 'surveillance-hack') loadSurveillanceHackPuzzle(puzzle, container);
}

function loadSafeCrackingPuzzle(puzzle, container) {
  const safeDiv = document.createElement("div");
  safeDiv.className = "safe-container";
  const display = document.createElement("input");
  display.type = "text";
  display.className = "code-input";
  display.value = currentCode;
  display.readOnly = true;
  safeDiv.appendChild(display);

  const keypad = document.createElement("div");
  keypad.className = "keypad";
  for (let i = 1; i <= 9; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.onclick = () => {
      if (currentCode.length < 4) {
        currentCode += i;
        display.value = currentCode;
      }
    };
    keypad.appendChild(btn);
  }
  const clearBtn = document.createElement("button");
  clearBtn.textContent = "CLR";
  clearBtn.onclick = () => {
    currentCode = "";
    display.value = "";
  };
  keypad.appendChild(clearBtn);
  const zeroBtn = document.createElement("button");
  zeroBtn.textContent = "0";
  zeroBtn.onclick = () => {
    if (currentCode.length < 4) {
      currentCode += "0";
      display.value = currentCode;
    }
  };
  keypad.appendChild(zeroBtn);
  const enterBtn = document.createElement("button");
  enterBtn.textContent = "✓";
  enterBtn.onclick = () => {
    if (currentCode === puzzle.correctCode) {
      document.getElementById("puzzle-result").textContent = "Safe cracked! Accessing secure files...";
      setTimeout(() => showPuzzleSuccess(), 2000);
    } else {
      document.getElementById("puzzle-result").textContent = "Access denied. Try again!";
      document.getElementById("retry-section").classList.remove("hidden");
    }
  };
  keypad.appendChild(enterBtn);

  safeDiv.appendChild(keypad);
  container.appendChild(safeDiv);
}

// laser maze NEEDS FIXING 
function loadLaserMazePuzzle(puzzle, container) {
  const laserDiv = document.createElement("div");
  laserDiv.className = "laser-grid";
  laserDiv.style.position = "relative";
  laserDiv.style.width = "300px";  // 5 cols × 60px
  laserDiv.style.height = "300px"; // 5 rows × 60px

  let step = 0;
  const path = puzzle.safePath; // e.g. [0,1,2,7,12,...]

  for (let i = 0; i < 25; i++) {
    const cell = document.createElement("button");
    cell.className = "puzzle-cell";
    cell.dataset.index = i;
    // absolute positioning in a 5×5 grid
    cell.style.position = "absolute";
    cell.style.left = (i % 5) * 60 + "px";
    cell.style.top  = Math.floor(i / 5) * 60 + "px";
    cell.style.width  = "50px";
    cell.style.height = "50px";

    cell.addEventListener("click", () => {
      const idx = Number(cell.dataset.index);

      // correct next step?
      if (idx === path[step]) {
        cell.classList.add("safe");
        step++;
        document.getElementById("puzzle-result").textContent = "Safe! Keep going…";

        // completed the path?
        if (step === path.length) {
          setTimeout(() => showPuzzleSuccess(), 300);
        }
      } else {
        // wrong cell: flash red, show retry
        cell.classList.add("wrong");
        setTimeout(() => cell.classList.remove("wrong"), 500);

        document.getElementById("puzzle-result").textContent =
          "⚠️ Laser triggered! Security alerted!";
        document.getElementById("retry-section").classList.remove("hidden");

        // reset all safe cells & step
        laserDiv.querySelectorAll(".safe").forEach(el => el.classList.remove("safe"));
        step = 0;
      }
    });

    laserDiv.appendChild(cell);
  }

  // horizontal laser lines (just for visuals)
  for (let r = 1; r < 5; r++) {
    const laser = document.createElement("div");
    laser.className = "laser-beam laser-horizontal";
    laser.style.top = r * 60 + "px";
    laserDiv.appendChild(laser);
  }

  container.appendChild(laserDiv);
}


function loadSurveillanceQuestion(q, contentDiv, optDiv) {
  contentDiv.innerHTML = '';
  optDiv.innerHTML     = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'surveillance-container';

  const survDiv = document.createElement('div');
  survDiv.className = 'surveillance-screen';

  
  if (q.content.videoSrc) {
    const vid = document.createElement('video');
    vid.src       = q.content.videoSrc;
    vid.autoplay  = true;
    vid.loop      = true;
    vid.controls  = true;
    survDiv.appendChild(vid);

  } else if (q.content.imgSrc) {
    const img = document.createElement('img');
    img.src       = q.content.imgSrc;
    img.alt       = q.title || 'Surveillance image';
    img.className = 'surveillance-img';
    survDiv.appendChild(img);

  } else if (q.content.text) {
    survDiv.innerHTML = q.content.text.replace(/\n/g, '<br>');
  }

  wrapper.appendChild(survDiv);

  const questionP = document.createElement('p');
  questionP.textContent = q.question;
  questionP.style.margin = '1rem 0';
  contentDiv.appendChild(questionP);
  const optionsContainer = document.createElement('div');
  optionsContainer.className = 'quiz-options';

  q.options.forEach(([text, isCorrect, feedback]) => {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.onclick = () => {
      const vid = survDiv.querySelector('video');
      if (vid) vid.pause();
      answerQuestion(isCorrect, feedback);
    };
    optionsContainer.appendChild(btn);
  });

  wrapper.appendChild(optionsContainer);
  contentDiv.appendChild(wrapper);
}


function loadSurveillanceHackPuzzle(puzzle, container) {
  container.innerHTML = ""; 

  puzzle.feeds.forEach((feed, idx) => {
    const feedDiv = document.createElement("div");
    feedDiv.className = "surveillance-screen";

    // Add image if it exists
    const imgHTML = feed.src ? `<img src="${feed.src}" alt="Surveillance Image" class="surveillance-img" />` : "";

    feedDiv.innerHTML = `
      <strong>CAMERA FEED ${feed.id}</strong><br>
      ${imgHTML}
      <p>${feed.description}</p>
    `;

    feedDiv.style.cursor = "pointer";

    feedDiv.onclick = () => {
      if (idx === puzzle.correct) {
        feedDiv.style.borderColor = "#00FF00";
        document.getElementById("puzzle-result").textContent = "AI feed identified! Disabling security system...";
        setTimeout(() => showPuzzleSuccess(), 2000);
      } else {
        feedDiv.style.borderColor = "#FF0000";
        document.getElementById("puzzle-result").textContent = "Wrong feed! Security system still active!";
        document.getElementById("retry-section").classList.remove("hidden");
      }
    };

    container.appendChild(feedDiv);
  });
}



function showPuzzleSuccess() {
  document.getElementById("escape-screen").classList.add("hidden");
  document.getElementById("puzzle-explanation").textContent = puzzles[currentPuzzle].explanation;
  document.getElementById("puzzle-success").classList.remove("hidden");
}

function continueFromPuzzle() {
  document.getElementById("puzzle-success").classList.add("hidden");
  nextPuzzle();
}

function retryPuzzle() {
  currentCode = "";
  loadPuzzle();
}

function nextPuzzle() {
  currentPuzzle++;
  if (currentPuzzle < puzzles.length) {
    document.getElementById("escape-screen").classList.remove("hidden");
    loadPuzzle();
  } else {
    document.getElementById("final-screen").classList.remove("hidden");
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const answerBtn = document.getElementById("answer-btn");
  if (answerBtn) answerBtn.onclick = answerCall;

  const submitBtn = document.getElementById("code-submit");
  if (submitBtn) submitBtn.onclick = checkCode;
});

