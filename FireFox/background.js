chrome.browserAction.onClicked.addListener((tab) => {
    chrome.storage.local.get(["isVoteEnabled"], (result) => {
        const newStatus = !result.isVoteEnabled;

        // 새로운 상태 저장
        chrome.storage.local.set({ isVoteEnabled: newStatus }, () => {
            updateIcon(newStatus);

            // 모든 활성 탭에 상태 변경 메시지 전달
            chrome.tabs.query({}, (tabs) => {
                tabs.forEach((t) => {
                    chrome.tabs.sendMessage(t.id, {
                        type: "UPDATE_VOTE_STATUS",
                        status: newStatus,
                    });
                });
            });
        });
    });
});

// 아이콘 업데이트 함수
function updateIcon(isEnabled) {
    const iconPath = isEnabled
        ? "icons/icon_on_128.png"
        : "icons/icon_off_128.png";
    chrome.browserAction.setIcon({ path: iconPath });
}

// 확장 프로그램이 실행될 때 상태에 따라 아이콘 설정
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(["isVoteEnabled"], (result) => {
        updateIcon(result.isVoteEnabled ?? true);
    });
});
