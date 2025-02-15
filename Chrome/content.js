let isVoteEnabled = false;

// Chrome Storage에서 상태 불러오기
chrome.storage.local.get(["isVoteEnabled"], (result) => {
    isVoteEnabled = result.isVoteEnabled ?? false;
});

// 백그라운드에서 상태 변경 메시지 받기
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "UPDATE_VOTE_STATUS") {
        isVoteEnabled = message.status;
    }
});

// 추천 버튼 클릭 함수
function clickVoteButton() {
    if (!isVoteEnabled) return;
    const button =
        document.querySelector("#btn_episode_vote") ||
        document.querySelector("#btn_episode_text");
    if (button) {
        button.click();
        observeForRetentionButton();
    }
}

// 추천 유지 버튼 감시 함수
function observeForRetentionButton() {
    if (!isVoteEnabled) {
        observer.disconnect();
        return;
    }

    const observer = new MutationObserver(() => {
        const retentionButton = document.querySelector(
            ".layer-botton-section .color-pp"
        );
        if (retentionButton) {
            retentionButton.click();
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// MutationObserver 설정 (추천 버튼 감시)
const observer = new MutationObserver(() => {
    const button =
        document.querySelector("#btn_episode_vote") ||
        document.querySelector("#btn_episode_text");
    if (button || isVoteEnabled) {
        clickVoteButton();
        observer.disconnect();
    }
});

observer.observe(document.body, { childList: true, subtree: true });
