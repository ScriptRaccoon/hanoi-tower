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
let speed = 250;
let state;

function init() {
    $("#numberInput").val(diskNumber);
    $(".disk").remove();
    $("#game").css("--disk-number", diskNumber);
    state = [[], [], []];
    for (let i = diskNumber; i >= 1; i--) {
        state[0].push(i);
        $("<div></div>")
            .addClass("disk")
            .css("transition-duration", `${speed}ms`)
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
    $("button, select").prop("disabled", true);
    const sequence = state[0].length > 0 ? [0, 1, 2] : [2, 1, 0];
    const hanoiSequence = Hanoi(diskNumber, ...sequence);
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
    disk.css("--y", 12);
    await sleep(speed * 1.5);
    disk.css("--x", target);
    await sleep(speed * 1.5);
    disk.css("--y", state[target].length);
    await sleep(speed * 1.5);
}
