function getRatingColor(rating) {
    if (rating >= 4.0) {
        return '#2ca25f';
    } else if (rating >= 3.0) {
        return '#e9a400';
    } else {
        return '#de2d26';
    }
}

function injectOverview(cell, data) {
    const overview = document.createElement('div');
    overview.className = 'professor-container';
    const ratingColor = getRatingColor(data.avgRating);
    overview.innerHTML = `
    <a href="https://www.ratemyprofessors.com/professor/${data.legacyId}" target="_blank">
            ${data.firstName} ${data.lastName} ↗
    </a>
    <div class="professor-stats">
        <div class="rating-box" style="background:${ratingColor}">
            <span class="rating-number">${data.avgRating}</span>
            <span class="rating-label">/ 5 </span>
        </div>
        <div class ="rating-details">
            <span>Difficulty: <strong>${data.avgDifficulty}</strong></span>
            <span><strong>${Math.round(data.wouldTakeAgainPercent)}%</strong> would take again</span>
            <span><strong>${data.numRatings}</strong> ratings</span>
        </div>
    </div>
    `;
    cell.innerHTML = '';
    cell.appendChild(overview);
}

function injectNotFound(cell, name) {
    const overview = document.createElement('div');
    overview.className = 'professor-container'
    overview.innerHTML = `
    <span class ="professor-name-plain">${name}</span>
    <div class= "professor-stats">
        <div class="rating-box" style="background:#666"
            <span class="rating-number">N/A</span>
        </div>
        <div class="rating-details">
            <span> No RMP data found.</span>
        </div>
    </div>
    `;
    cell.innerHTML = '';
    cell.appendChild(overview);
}

const observer = new MutationObserver(() => {
    const cells = document.querySelectorAll('[xe-field="instructor"]');
    cells.forEach(cell => {
        if (cell.dataset.ninerProcessed) return;
        cell.dataset.ninerProcessed = "true";
        const anchor = cell.querySelector('a.email');
        if (anchor) {
            const name = anchor.textContent.trim();
            anchor.textContent = '...';
            chrome.runtime.sendMessage({ professorName: name }, (response) => {
                if (response && response.success) {
                    injectOverview(cell, response.data);
                } else {
                    injectNotFound(cell, name);
                }
            });
        }
    });
});
observer.observe(document.body, {
    childList: true,
    subtree: true
});