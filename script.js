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
const dashboardScreen = document.getElementById("dashboardScreen");
const endScreen = document.getElementById("endScreen");

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

// dashboard SCREEN VARIABLES
const dashboardphotobg = document.getElementById('dashboardphotobg')
const shouryaText = document.getElementById('shouryaText')
const urgent = document.getElementById('urgent')
const deleteProfileBox = document.getElementById("deleteProfileBox");

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
function playDialogue(messages, showContinue = true, container = dialogue, speed = 45, finished = null) {
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
        "Uh...",
        "Where am I?",
        "Actually, who am I?",
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
        playDialogue(["Hello?", "Anybody here?",], true);
        stage = 2;
        return;
    }

    if (stage === 2) {
        playDialogue([
            "Why is everything blue?"
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
function skipToQuestion5() {

    document.documentElement.requestFullscreen();

    // Hide all previous screens
    startScreen.classList.add("hidden");
    loadingScreen.classList.add("hidden");
    characterScreen.classList.add("hidden");
    lectureScreen.classList.add("hidden");

    // Reset character state
    character.classList.remove(
        "hidden",
        "characterFloat",
        "peekanimation",
        "dizzyFall"
    );

    character.style.transition = "";
    character.style.transform = "";
    character.style.left = "";
    character.style.top = "";

    // Reset dialogue
    clearDialogue();

    // Make sure lecture isn't considered running
    lectureStarted = true;

    // Jump to the enrolled-screen aftermath
    question1ans();


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
        entityBox.classList.remove("entity-boxleft");
        entityBox.classList.add("entity-boxright");
        entityBox.style.left = rect.right + 35 + "px";
    }
    else {
        entityBox.classList.add("entity-boxleft");
        entityBox.classList.remove("entity-boxright");
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

// CLEAR ENTITY DIALOGUES
function clearEntityDialogue() {
    entityBox.classList.remove("entity-boxleft");
    entityBox.classList.remove("entity-boxright");
    entityBox.classList.add("hidden");
    entityBox.textContent = "";
}

// CLEAR narator DIALOGUES
function clearNaratorDialogue() {
    narratorBox.classList.add("hidden");
    narratorBox.textContent = "";
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
        setTimeout(narrator, 500, "Wait... what was that?");
        setTimeout(secondPeek, 3100);
    }, 19000);
    // 19000
}

// lecture scene character peeks for second time
function secondPeek() {
    character.classList.remove("peekanimation");
    narrator("Nah... I'm imagining things.");
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
    setTimeout(narrator, 1500, "I am sure! I saw something.");
    const rect = lectureVideo1.getBoundingClientRect();
    setTimeout(() => {
        character.style.left = (rect.right - character.offsetWidth * 2) + "px";
        character.classList.remove("peekanimation");
        setTimeout(startConversation, 700);
    }, 3000);
    setTimeout(clearDialogue, 3000)
}

// lecture scene character meets narator
function startConversation() {

    setTimeout(narrator, 500, "How are you moving?");
    setTimeout(entity, 1500, "Good question.");

    setTimeout(narrator, 3000, "Who even are you?");
    setTimeout(entity, 4500, "I have no idea.");

    setTimeout(narrator, 7000, "What do you mean by that?");
    setTimeout(entity, 9500, "I was literally born 30 seconds ago.");

    setTimeout(clearEntityDialogue, 12000)
    setTimeout(narrator, 12000, "**Phone ringing**");
    setTimeout(narrator, 15000, "Mom's calling me. I'll be back soon.");
    setTimeout(entity, 17500, "Cool.");
    setTimeout(clearEntityDialogue, 19500)

    setTimeout(narrator, 19500, "Don't touch anything.");
    setTimeout(narrator, 21500, "**He went out of the room**");

    setTimeout(() => {
        checkpoint = checkpointQuestion1
        checkpointQuestion1()
    }, 23500);
}

// LECTURE SCENE MCQ
function checkpointQuestion1() {
    clearDialogue()
    showChoices(
        "What should I do?",
        [
            "Jump back into the video.",
            "Talk to the instructor in the video.",
            "Do nothing, eat 5 Star.",
            "Blow it up!!"
        ],
        3,
        question1ans,
        [
            "It's paused at a solid wall.",
            "Felt like talking to a stone. It's just a video.",
            "Waited too long, the laptop's battery is dead.",
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
    }, 1);
}

// AFTERMATH OF LECTURE SCREEN DAMAGE AFTER BLAST AND NEXT QUESTION ASKED
function question1ans() {
    enrolledScreen.appendChild(character);
    lectureScreen.classList.add("hidden");
    character.classList.remove("hidden");
    enrolledScreen.classList.remove("hidden");
    character.classList.add("absolute");
    character.classList.remove("zindex");

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

    setTimeout(entity, 6500, "That's painful.");
    character.style.zIndex = "100";
    setTimeout(entity, 8500, "Where am I now?");
    setTimeout(() => {
        characterHead.classList.add('headrotate')
    }, 8700);

    setTimeout(() => {
        checkpoint = checkpointQuestion2
        checkpointQuestion2()
    }, 12000);
}

// ENROLLED SCREEN MCQS
function checkpointQuestion2() {
    clearDialogue()
    showChoices(
        "What should I do?",
        [
            "Kick the kickoff word.",
            "Roam around to find the escape.",
            "Try to play the video.",
            "Blow it again!!"
        ],
        0,
        question2ans,
        [
            "",
            "Got dizzy and fell off the screen.",
            "The webpage got destroyed by the blast.",
            "Luck doesn't always support you."
        ],
        selectedOption2
    );
}

// ENROLED scene OPTED OPTION
function selectedOption2(index, callback) {
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
    }, 1);
}

// AFTERMATH OF ENROLLED SCREEN OPTED OPTION ANIMATION KICK AND FALL
function question2ans() {
    clearDialogue();
    kickTheKick(() => {
        dashboardScreenaction();
    });
}

// KICK THE KICK WORD AND THEN OPENS ENROLLED SCREEN
function kickTheKick(callback = null) {
    let rect = enrolledphotobg.getBoundingClientRect();

    let startLeft = rect.right - character.offsetHeight;
    let startTop = rect.bottom - character.offsetWidth * 2 - character.offsetHeight / 2;

    character.style.left = startLeft + "px";
    character.style.top = startTop + "px";
    character.style.transform = "rotate(0deg)";
    character.style.transition = "all 0.6s ease-out";

    setTimeout(() => {
        character.style.top = startTop - rect.height * 0.5 + "px";
    }, 0);

    setTimeout(() => {
        character.style.transition = "all 0.35s ease";
        character.style.left = startLeft + rect.width * 0.06 + "px";
    }, 600);

    setTimeout(() => {
        character.style.left = startLeft - rect.width * 0.12 + "px";
    }, 950);

    setTimeout(() => {
        character.style.left = startLeft + rect.width * 0.10 + "px";
    }, 1300);

    setTimeout(() => {
        character.style.transition = "all 0.2s ease";
        character.style.transform = "rotate(-15deg)";
    }, 1600);

    setTimeout(() => {
        character.style.transition = "all 1s ease-in";
        character.style.left = startLeft - rect.width * 0.75 + "px";
        character.style.transform = "rotate(90deg)";
        characterHead.classList.remove("headrotate");
        character.classList.remove("characterDamage");
    }, 1800);

    if (callback) {
        setTimeout(() => {
            callback();
        }, 2800);
    }
}

// DASHBOARD SCREEN CONVERSATION WITH NARRATOR
function dashboardScreenaction() {
    dashboardScreen.appendChild(character);
    enrolledScreen.classList.add("hidden");
    character.classList.remove("hidden");
    dashboardScreen.classList.remove("hidden");

    setCharacter(":(", "yellow");

    character.style.transition = "all 1s ease";
    setTimeout(() => {
        character.style.transform = 'rotate(0deg)';
        characterHead.style.transform = 'rotate(90deg)';
    }, 2000);

    setTimeout(entity, 4000, "That's painful, I slipped.", 'right');
    setTimeout(entity, 6500, "At this rate,", 'right');
    setTimeout(entity, 8500, "I am going to die.", 'right');
    setTimeout(entity, 10500, "Before knowing the truth,", 'right');
    setTimeout(entity, 13000, "The truth... behind my origin.", 'right');
    setTimeout(narrator, 16000, "**Door opens**");
    setTimeout(entity, 18000, "He's back.", 'right');
    setTimeout(narrator, 20000, "How are you here?");
    setTimeout(narrator, 22500, "I TOLD YOU NOT TO TOUCH ANYTHING!");

    setTimeout(() => {
        checkpoint = checkpointQuestion3
        checkpointQuestion3()
    }, 25500);

};

// QUESTION FOR STARTING THE CLIMAX
function checkpointQuestion3() {
    clearDialogue()
    showChoices(
        "What should I do to avoid his anger?",
        [
            "Hide behind the edge of the screen.",
            "Impersonate him.",
            "Ignore him and find the truth.",
            "Laugh to make him laugh."
        ],
        1,
        question3ans,
        [
            "Got lost at the edge of the screen.",
            "",
            "You made him more angry.",
            "He thought you were making fun of him."
        ],
        selectedOption3
    );
}

// DASBOARD SCENE OPTED OPTION
function selectedOption3(index, callback) {
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
    }, 1);
}

// AFTERMATH OF DASHBOARD SCENE 1 , CREATING UNRGENCY PROFILE DELETING
function question3ans() {
    clearDialogue();
    let rect = dashboardphotobg.getBoundingClientRect();
    character.style.top = rect.top + character.offsetHeight * 0.4 + "px";
    character.style.left = rect.right - rect.width * 0.06 - character.offsetWidth + "px";
    setTimeout(() => {
        dashboardphotobg.src = 'dashboard without name.png';
        shouryaText.classList.remove("hidden");
        character.prepend(shouryaText);
    }, 2000);
    setTimeout(() => {
        character.classList.add('rotationShaktiman');
    }, 1500);

    setTimeout(entity, 4000, "I am Shourya.");
    setTimeout(entity, 6500, "We are meeting for the first time.");
    setTimeout(narrator, 9500, "WHAT ARE YOU TRYING TO DO?");
    setTimeout(narrator, 12000, "IT'S NOT LIKE I WON'T RECOGNIZE YOU IF YOU CHANGE YOUR NAME!");

    setTimeout(() => {
        narrator("Oh no, I need to call the administrator!");
        deleteProfileBox.classList.remove("hidden");
        urgent.classList.remove("hidden");
    }, 16000);

    setTimeout(entity, 18500, "What's this?");
    setTimeout(entity, 20500, "I am not liking this.");
    setTimeout(narrator, 22500, "WHAT?! You took my name from there, and now the system is deleting my profile!");
    setTimeout(entity, 26500, "It was nice meeting you.");
    setTimeout(narrator, 29000, "You will die too if this page gets deleted.");
    setTimeout(entity, 32000, "NOOOO, I want to LIVE!");
    setTimeout(entity, 34500, "I don't even know how I exist.");
    setTimeout(narrator, 37000, "HELP ME FIX IT THEN!");
    setTimeout(clearDialogue, 40000)

    setTimeout(entity, 41000, "Get out of my sight.");
    setTimeout(() => {
        throwDeleteBox()
        clearDialogue()
    }, 43500);
}

// CHARACTER THROWS THE DELETE DIV
function throwDeleteBox() {
    let boxRect = deleteProfileBox.getBoundingClientRect();
    let targetLeft = boxRect.left + boxRect.width / 2 - character.offsetWidth / 2;
    let targetTop = boxRect.top + boxRect.height / 2 - character.offsetHeight / 2;

    character.style.transition = "all 1.45s cubic-bezier(.1,.9,.2,1)";
    character.style.transform = "rotate(-25deg)";
    character.style.left = targetLeft + boxRect.width * 0.5 + "px";
    character.style.top = targetTop - character.offsetHeight * 0.5 + "px";

    setTimeout(() => {
        deleteProfileBox.classList.add("kicked-away");
        character.style.transform = "rotate(25deg)";
    }, 450);
    setTimeout(() => {
        character.style.transition = "transform 0.4s ease-out";
        character.style.transform = "rotate(0deg)";
    }, 800);

    setTimeout(entity, 1500, "What do I do NOW?!", 'right');

    setTimeout(() => {
        checkpoint = checkpointQuestion4
        checkpointQuestion4()
    }, 4000);
}

// SAVE THE PROFILE QUESTION LEADING TO MY PROFILE
function checkpointQuestion4() {
    clearDialogue()
    showChoices(
        "What should I do to save the profile?",
        [
            "Go to Problem Solving to solve the problem.",
            "Go to Problem of the Day to find the result.",
            "PANIC PANIC PANIC",
            "Blow up the page before the profile gets deleted!!"
        ],
        2,
        question4ans,
        [
            "So many questions and solutions, it took forever to find your solution.",
            "Congratulations, you are the only problem today.",
            "",// right ans
            "There is nothing left."
        ],
        selectedOption4
    );
}

// SAVE THE PROFLE OPTED OPTION
function selectedOption4(index, callback) {
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
    }, 10);
}

// AFTERMATH OF DASHBOARD LAST SCENE , MY PROFILE 
function question4ans() {
    clearDialogue();
    let rect = dashboardphotobg.getBoundingClientRect();
    character.style.transition = "all 0.4s ease-in-out";
    setTimeout(() => {
        character.style.left = rect.left + rect.width * 0.2 - character.offsetWidth + "px";
    }, 0);
    setTimeout(() => {
        character.style.left = rect.right - rect.width * 0.06 - character.offsetWidth + "px";
    }, 500);

    setTimeout(() => {
        character.style.left = rect.left + rect.width * 0.2 - character.offsetWidth + "px";
    }, 1000);

    setTimeout(() => {
        character.style.top = rect.top + character.offsetHeight * 0.2 + "px";
        character.style.left = rect.right - rect.width * 0.06 - character.offsetWidth + "px";
        dashboardphotobg.src = 'logout-dasboard.png';
    }, 1500);

    setTimeout(entity, 3000, "What's this?");
    setTimeout(entity, 5500, "Profile... there must be a solution here.");

    setTimeout(() => {
        dashboardphotobg.src = 'profile-without-name.png';
        setTimeout(entity, 1500, "My name is gone from here too.");
        setTimeout(entity, 4500, "I don't have time.");
    }, 8500);
    setTimeout(() => {
        checkpoint = checkpointQuestion5
        checkpointQuestion5()
    }, 15500);
}

// FINAL QUESTION ASKED
function checkpointQuestion5() {
    clearDialogue()
    showChoices(
        "How do I save the profile?",
        [
            "Do black magic to reverse the deletion.",
            "Fill the box with the user's name.",
            "Try to place the name from your head into the box.",
            "Die with grace (Indian serial style)."
        ],
        3,
        question5ans,
        [
            "The tech world doesn't believe in this.",
            "Forgot this name.",
            "The name is too high to reach.",
            ""// right ans
        ],
        selectedOption5
    );
}

// LAST scene OPTED OPTION
function selectedOption5(index, callback) {
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
    }, 100);
}

// ENDING SCENE
function question5ans() {
    clearDialogue();

    let rect = dashboardphotobg.getBoundingClientRect();

    character.style.top = rect.top / 2 + character.offsetHeight + "px";

    character.style.left = rect.right / 2 - character.offsetWidth * 0.5 + "px";


    setTimeout(entity, 1000, "I am starting to feel dizzy.");
    setTimeout(entity, 3000, "I am dying with this website.");

    setTimeout(() => {
        character.classList.add("dizzyFall");
    }, 5000);

    setTimeout(() => {
        let textRect = shouryaText.getBoundingClientRect();
        document.body.prepend(shouryaText);
        shouryaText.classList.remove("hidden");
        shouryaText.style.left = textRect.left + "px";
        shouryaText.style.top = textRect.top + "px";
        shouryaText.style.transform = 'rotate(90deg)';
        shouryaText.style.zIndex = "11100";
    }, 7700);

    setTimeout(() => {
        shouryaText.style.transition = "all 1s ease-in";
        const textRect = shouryaText.getBoundingClientRect();
        const dashboardRect = dashboardScreen.getBoundingClientRect();
        shouryaText.style.top = dashboardRect.bottom - textRect.height + "px";
        shouryaText.style.left = textRect.left + "px";
        shouryaText.style.transform = "rotate(90deg)";
        urgent.classList.add('hidden')
    }, 9200);


    setTimeout(() => {
        clearDialogue();
        setTimeout(entity, 0, "Why is it so quiet?");
        setTimeout(entity, 2200, "Am I dead?");

        setTimeout(() => {
            clearDialogue();
            character.style.transform = "rotate(0deg)";
        }, 3200);

        setTimeout(entity, 4200, "Ahh! That name also fell down when I fell. Are we safe now?");
        setTimeout(narrator, 7600, "**Door opens**");
        setTimeout(narrator, 9600, "Thank you, thank you...");
        setTimeout(narrator, 11800, "Phew! They had a backup...");
        setTimeout(narrator, 14000, "You already stopped the deletion. How?");
        setTimeout(() => {
            setCharacter(":D", "black");
        }, 16400);
        setTimeout(entity, 16600, "I am not that special. I only needed my left hand to do it.");
        setTimeout(narrator, 19600, "I knew you were talented even when you didn't know who you were.");
        setTimeout(entity, 22800, "Sorry, I was kidding.");
        setTimeout(entity, 24800, "Can you please tell me what I am?");
        setTimeout(narrator, 27200, "Your right hand must know, ask him. If not, ask the left one.");
        setTimeout(entity, 30200, "Sorry for everything I did. Please tell me the truth?");
        setTimeout(narrator, 33200, "Okay, whatever. You are...");
        setTimeout(narrator, 35400, "A part of a big webpage that I learned from AI genesis.");
        setTimeout(narrator, 38400, "I also don't know much. My teachers can explain it better.");
        setTimeout(narrator, 41800, "I am also learning from them. You should join our college too.");
        setTimeout(narrator, 45000, "So we can learn about all this together.");
        setTimeout(() => {
            endScreen.classList.remove('hidden');
            dashboardScreen.classList.add('hidden');
            clearDialogue()
        }, 48000);
    }, 10500);
}
