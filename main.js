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

let delay = 1000;
let diskNumber = 5;

const state = {
    A: [5, 4, 3, 2, 1],
    B: [],
    C: [],
};

const offset_x = {
    A: 0,
    B: 175,
    C: 350,
};

function init() {
    $(".disk").remove();
    $("#game").css("--diskNumber", diskNumber);
    for (let i = 1; i <= diskNumber; i++) {
        $("<div></div>")
            .addClass("disk")
            .attr("id", i)
            .css("--size", i)
            .css("--x", 0)
            .css("--y", 11 * (i - 1) + 100)
            .appendTo("#game");
    }
}

init();

$("#diskInput").change(function () {
    init(parseInt($(this).val()));
});

$("#delayInput").change(function () {
    delay = parseInt($(this).val());
});

$("#startBtn").click(async function () {
    $("button, select").prop("disabled", true);
    const hanoiSequence = Hanoi(diskNumber, "A", "B", "C");
    for (let i = 0; i < hanoiSequence.length; i++) {
        const [source, target] = hanoiSequence[i];
        await performMove(source, target);
    }
    $("button, select").prop("disabled", false);
});

async function performMove(source, target) {
    const diskId = state[source].pop();
    state[target].push(diskId);
    const disk = $(`#${diskId}`);
    disk.css("--y", 0);
    await sleep(400);
    disk.css("--x", offset_x[target]);
    await sleep(400);
    disk.css("--y", 11 * (diskNumber - state[target].length) + 100);
    await sleep(400);
}
