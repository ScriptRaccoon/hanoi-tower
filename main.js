async function sleep(time) {
    return new Promise((res) => setTimeout(res, time));
}

function Hanoi(numberDisks, origin, helper, target) {
    if (numberDisks == 1) {
        return [[origin, target]];
    } else {
        return [
            ...Hanoi(numberDisks - 1, origin, target, helper),
            ...Hanoi(1, origin, helper, target),
            ...Hanoi(numberDisks - 1, helper, origin, target),
        ];
    }
}

let diskNumber = 5;
let delay = 2000;
let state;
let paused = false;
let nextIndex;
let direction;

function init() {
    nextIndex = 0;
    direction = 1;
    $("#numberInput").val(diskNumber);
    $("#delayInput").val(delay);
    $(".disk").remove();
    $("#game").css("--disk-number", diskNumber);
    state = [[], [], []];
    for (let i = diskNumber; i >= 1; i--) {
        state[0].push(i);
        $("<div></div>")
            .addClass("disk")
            .css(
                "transition-duration",
                `${Math.round(delay / 4.5)}ms`
            )
            .attr("id", i)
            .css("--size", i)
            .css("--x", 0)
            .css("--y", diskNumber - i + 1)
            .appendTo("#game");
    }
}

init();

$("#numberInput").change(function () {
    diskNumber = parseInt($(this).val());
    init();
});

$("#startBtn").click(async function () {
    paused = false;
    $("#pauseBtn").prop("disabled", false);
    $("#startBtn, #numberInput").prop("disabled", true);
    const pegs = direction == 1 ? [0, 1, 2] : [2, 1, 0];
    const hanoiSequence = Hanoi(diskNumber, ...pegs);
    for (let i = nextIndex; i < hanoiSequence.length; i++) {
        const [source, target] = hanoiSequence[i];
        await performMove(source, target);
        nextIndex = i + 1;
        if (paused) break;
    }
    $("#pauseBtn").prop("disabled", true);
    $("#startBtn, #numberInput").prop("disabled", false);
    if (nextIndex == hanoiSequence.length) {
        direction *= -1;
        nextIndex = 0;
    }
});

async function performMove(source, target) {
    const diskId = state[source].pop();
    state[target].push(diskId);
    const disk = $(`#${diskId}`);
    disk.css("--y", 12);
    await sleep(delay / 3);
    disk.css("--x", target);
    await sleep(delay / 3);
    disk.css("--y", state[target].length);
    await sleep(delay / 3);
}

$("#pauseBtn").click(() => {
    paused = true;
});

$("#delayInput").change(function () {
    delay = parseInt($(this).val());
    $(".disk").css(
        "transition-duration",
        `${Math.round(delay / 4.5)}ms`
    );
});
