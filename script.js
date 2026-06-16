// LOADING VARIABLE...
// LOADING VARIABLE......

// GAME STARTING VARIABLE
const gameStart = document.getElementById("gameStart");

// SCREEN VARIABLE
const startScreen = document.getElementById("startScreen");
const loadingScreen = document.getElementById("loadingScreen");
const characterScreen = document.getElementById("characterScreen");
const lectureScreen = document.getElementById("lectureScreen");
const enrolledScreen = document.getElementById("enrolledScreen");

// CHARACTER VARIABLE
const character = document.getElementById("character");
const characterHead = document.getElementById("characterHead");

// LOADING SCREEN TEXT VARIABLE
const bootText = document.getElementById("bootText");
const dialogue = document.getElementById("dialogue");
const nextIndicator = document.getElementById("nextIndicator");
let isTyping = false;
const lines = [
    '------------------',
    "ALTA Portal v03.06",
    '------------------',
    "",
    "Initializing Student Data...",
    "████████████",
    "",
    "Initializing Attendance...",
    "████████████",
    "",
    "Initializing Assignments...",
    "████████████",
    "",
    "Initializing JavaScript...",
    "████████████",
    "",
    "Building  UI..."
];

// TANSITION FROM CHARACTER SCREEN TO LECTURE SCREEN VARIABLE
const blueTransition = document.getElementById("blueTransition");

// LECTURE SCREEN VARIABLES
const lectureVideo1 = document.createElement('video');
const lectureVideo = document.createElement('video');
let lectureStarted = false;
lectureVideo.className = "lectureVideo";
lectureVideo1.className = "lectureVideo1";
lectureVideo.src = 'lecture.mp4'
lectureVideo.preload = 'auto'
lectureVideo.load();

lectureVideo1.src = 'lecture.mp4'
lectureVideo1.preload = 'auto'
lectureVideo1.volume = "0";
lectureVideo1.load();

// ENROLLED SCREEN VARIABLES
const enrolledphotobg = document.getElementById('enrolledphotobg')
enrolledphotobg.loading = "eager";
enrolledphotobg.decode();

// TANSITION FROM LECTURE SCREEN TO ENROLLED SCREEN VARIABLE
const whiteTransition = document.getElementById("whiteTransition");

// DIALOGUE BOX VARIABLES
const narratorBox = document.getElementById("narratorBox");
const entityBox = document.getElementById("entityBox");

// CHOICE SCREEN VARIABLE
const choiceScreen = document.getElementById("choiceScreen");
let currentChoices = [];
let correctAnswer = 0;
let onCorrect = null;
let failReasons = [];
let checkpoint = null;
let onChoose = null;

// GAME END VARIABLE
const gameOverScreen = document.getElementById("gameOverScreen");
const gameOverReason = document.getElementById("gameOverReason");

// SCENE 
let stage = 0;


// VARIABLE ENDS
// VARIABLE ENDS

// GAME STARTS
// GAME STARTS
gameStart.addEventListener("click", startGame);

function startGame() {
    document.documentElement.requestFullscreen();
    startScreen.classList.add("hidden");
    loadingScreen.classList.remove("hidden");
    loadingSequence();
}

// customizable character
function setCharacter(face, color) {
    character.classList.remove("hidden");
    characterHead.textContent = face;
    character.style.color = color;
}

// TYPING EFFECT FOR LOADNG AND CHARACTER PAGE
function playDialogue(messages, showContinue = true, container = dialogue, speed = 40, finished = null) {
    container.innerHTML = "";
    if (container === dialogue) {
        nextIndicator.classList.add("hidden");
    }
    let current = 0;
    function nextMessage() {
        if (current >= messages.length) {
            if (showContinue && container === dialogue) {
                nextIndicator.classList.remove("hidden");
            }
            if (finished) {
                finished();
            }
            return;
        }
        typeText(
            messages[current],
            () => {
                current++;
                setTimeout(nextMessage, 150);
            },
            container,
            speed
        );
    }
    nextMessage();
}

function typeText(
    text,
    callback,
    container = dialogue,
    speed = 40
) {
    isTyping = true;
    let i = 0;
    const line = document.createElement("div");
    container.appendChild(line);
    const typing = setInterval(() => {
        line.textContent += text.charAt(i);
        i++;
        if (i >= text.length) {
            clearInterval(typing);
            isTyping = false;
            callback();
        }
    }, speed);
}

// LOADING SCREEN / BOOT SCREEN
function loadingSequence() {
    playDialogue(
        lines,
        false,
        bootText,
        20,
        () => {
            setTimeout(() => {
                bootText.innerHTML +=
                    "<br><span style='color:red; font-weight:bold'>WARNING<br>Unexpected Entity Detected</span>";
                document.body.classList.add("shake");
                setTimeout(() => {
                    document.body.classList.remove("shake");
                    showCharacter();
                }, 2000);
            }, 600);
        }
    );
}

// LOADS CHARACTER SCREEN AND PLAY DIALOGUES
function showCharacter() {
    loadingScreen.classList.add("hidden");
    characterScreen.prepend(character);
    character.classList.add('characterFloat')
    characterScreen.classList.remove("hidden");
    setCharacter('"."', 'white')
    playDialogue([
        "uh...",
        "Where am I?",
        "actually ,Who am I?",
    ], true);
    stage = 1;
}

// FOR NEXT DIALOGUE AFTER CLCKING
characterScreen.addEventListener("click", (e) => {
    if (isTyping) return;
    if (nextIndicator.classList.contains("hidden"))
        return;
    nextIndicator.classList.add("hidden");

    if (stage === 1) {
        playDialogue(["hello?", "anybody here?",], true);
        stage = 2;
        return;
    }

    if (stage === 2) {
        playDialogue([
            "why is everything blue?"
        ], false)
        setTimeout(() => {
            blueTransition.classList.remove("hidden");
        }, 1000);
        setTimeout(() => {
            characterScreen.classList.add("hidden");
            character.classList.add("hidden");
            startLectureScene();
        }, 2600);
        setTimeout(() => {
            blueTransition.classList.add("hidden");
        }, 5000);
        stage = 3
    }
});

// temporary button to skip 
function skipToLecture() {
    startScreen.classList.add("hidden");
    loadingScreen.classList.add("hidden");
    characterScreen.classList.add("hidden");
    question1ans();
    // startLectureScene()
    // document.documentElement.requestFullscreen();
}

// FUNCTION TO GENRATE MCQ
function showChoices(
    question,
    choices,
    correctIndex,
    successFunction,
    reasons,
    chooseFunction
) {
    correctAnswer = correctIndex;
    onCorrect = successFunction;
    failReasons = reasons;
    onChoose = chooseFunction;
    choiceScreen.innerHTML = "";

    let title = document.createElement("h2");
    title.textContent = question;
    choiceScreen.appendChild(title);

    choices.forEach((choice, index) => {
        let btn = document.createElement("button");
        btn.textContent = choice;
        btn.onclick = () => answer(index);
        choiceScreen.appendChild(btn);
    });
    choiceScreen.classList.remove("hidden");
}

// FUNCTION TO SET UP WHAT TO DO IN RIGHT ANS
function answer(index) {
    choiceScreen.classList.add("hidden");
    if (onChoose) {
        onChoose(index, continueChoice);
    } else {
        continueChoice();
    }
    function continueChoice() {
        if (index === correctAnswer) {
            if (onCorrect) {
                onCorrect();
            }
            return;
        }
        gameOver(index);
    }
}

// FUNCTION TO END GAME IF WRONG ANSWER
function gameOver(index) {
    gameOverReason.textContent = failReasons[index];
    gameOverScreen.classList.remove("hidden");
}

// FUNCTION TO RETRY THE GAME'S QUIZ
function restartCheckpoint() {
    gameOverScreen.classList.add("hidden");
    if (checkpoint) {
        checkpoint();
    }
}

// starts lecture scene
function startLectureScene() {
    if (lectureStarted) return;
    lectureStarted = true;
    lectureScreen.classList.remove("hidden");
    character.classList.remove('characterFloat')
    if (!lectureScreen.contains(lectureVideo)) {
        lectureScreen.appendChild(lectureVideo);
    }
    if (!lectureScreen.contains(lectureVideo1)) {
        lectureScreen.appendChild(lectureVideo1);
    }
    lectureVideo.play();
    lectureVideo1.play();
    setTimeout(firstPeek, 1000);
}

// caption 
function narrator(text) {
    narratorBox.classList.remove("hidden");
    narratorBox.textContent = "";
    narratorBox.textContent = text;
}

//  character dialouge whereever he goes
function entity(text, side = "left") {
    entityBox.classList.remove("hidden");
    entityBox.textContent = text;
    entityBox.classList.add("boxpop");
    setTimeout(() => {
        entityBox.classList.remove("boxpop");
    }, 1200);

    let rect = character.getBoundingClientRect();

    if (side === "right") {
        entityBox.classList.add("entity-boxright");
        entityBox.style.left = rect.right + 35 + "px";
    }
    else {
        entityBox.classList.add("entity-boxleft");
        entityBox.style.left = rect.left - entityBox.offsetWidth - 35 + "px";
    }
    entityBox.style.top = rect.top + "px";
}

// CLEAR DIALOGUE FOR NARRATOR AND CHARACTER
function clearDialogue() {
    narratorBox.classList.add("hidden");
    entityBox.classList.remove("entity-boxleft");
    entityBox.classList.remove("entity-boxright");
    entityBox.classList.add("hidden");
    narratorBox.textContent = "";
    entityBox.textContent = "";
}

// lecture scene character peeks for once
function firstPeek() {
    lectureScreen.appendChild(character);
    character.classList.remove("hidden");
    character.classList.add("absolute", "zindex");
    setCharacter("o_o", "white");
    const rect = lectureVideo1.getBoundingClientRect();
    character.style.left = (rect.left + rect.width * 0.78 - character.offsetWidth) + "px";
    setTimeout(() => {
        character.classList.add("peekanimation");
        setTimeout(narrator, 500, "wait... what was that?");
        setTimeout(secondPeek, 3100);
    }, 19000);
    // 19000
}

// lecture scene character peeks for second time
function secondPeek() {
    character.classList.remove("peekanimation");
    narrator("nah... i'm imagining things.");
    const rect = lectureVideo1.getBoundingClientRect();
    character.style.left = (rect.left + rect.width * 0.78 - character.offsetWidth) + "px";
    setTimeout(() => {
        character.classList.add("peekanimation");
        setTimeout(jumpOut, 500);
    }, 1000);
}

// lecture scene character come from the behind of the video
function jumpOut() {
    narrator("WHAT THE—");
    setTimeout(narrator, 1500, "I am sure! I saw something");
    const rect = lectureVideo1.getBoundingClientRect();
    setTimeout(() => {
        character.style.left = (rect.right - character.offsetWidth * 2) + "px";

        setTimeout(startConversation, 700);
    }, 3000);
    setTimeout(clearDialogue, 3000)
}

// lecture scene character meets narator
function startConversation() {

    setTimeout(narrator, 500, "How are you moving?");
    setTimeout(entity, 1500, "good question.");

    setTimeout(narrator, 3000, "who even are you?");
    setTimeout(entity, 4500, "i have no idea.");

    setTimeout(narrator, 7000, "what do you mean by that?");
    setTimeout(entity, 9500, "i was literally born 30 seconds ago.");

    setTimeout(narrator, 12000, "**phone ringing**");
    setTimeout(narrator, 17000, "mom's calling me. I will be back soon");
    setTimeout(entity, 18500, "cool.");
    setTimeout(() => {
        entityBox.classList.remove("entity-boxleft");
        entityBox.classList.remove("entity-boxright");
        entityBox.classList.add("hidden");
    }, 20000);

    setTimeout(narrator, 20000, "don't touch anything.");
    setTimeout(narrator, 22000, "**He went out of the room**");
    // 
    // 
    setTimeout(() => {
        checkpoint = checkpointQuestion1
        checkpointQuestion1()
    }, 23000);
}

// LECTURE SCENE MCQ
function checkpointQuestion1() {
    clearDialogue()
    showChoices(
        "What should I do?",
        [
            "Jump back into the video.",
            "Talk to instructor in the video.",
            "do nothing eat 5 star.",
            "blast it!!"
        ],
        3,
        question1ans,
        [
            "Its paused to solid wall",
            "Felt like talkig to stone. It's a video",
            "Waited too long ,laptop's battery is dead.",
            ""
        ],
        selectedOption1
    );
}

// lecture scene OPTED OPTION
function selectedOption1(index, callback) {
    if (index === 0) {
        entity("SOON");
    }
    if (index === 1) {
        entity("soon");
    }
    if (index === 2) {
        entity("soon");
    }
    if (index === 3) {
        entity("soon");
    }

    setTimeout(() => {
        clearDialogue();
        callback();
    }, 3000);
}

function question1ans() {
    enrolledScreen.appendChild(character);
    lectureScreen.classList.add("hidden");
    character.classList.remove("hidden");
    enrolledScreen.classList.remove("hidden");
    character.classList.add("absolute");

    whiteTransition.classList.remove('hidden')

    character.style.transform = 'rotate(90deg)';
    character.classList.add("characterDamage");
    setCharacter("*_*", "black");

    let rect = enrolledphotobg.getBoundingClientRect();
    character.style.left = rect.right - character.offsetHeight + "px";
    character.style.top = rect.bottom - character.offsetWidth * 2 - character.offsetHeight / 2 + "px";

    setTimeout(() => {
        character.style.transform = 'rotate(0deg)';
        character.style.transition = ' all 2s ease';

    }, 5000);

    setTimeout(entity, 6500, "That's painful");
    
    character.style.zIndex = "100";
}
