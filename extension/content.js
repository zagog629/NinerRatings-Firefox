function getRatingColor(rating) {
    if (rating >= 4.0) {
        return '#2ca25f';
    } else if (rating >= 3.0) {
        return '#e9a400';
    } else {
        return '#de2d26';
    }
}

function injectOverview(cell, data, originalName) {
    const overview = document.createElement('div');
    overview.className = 'professor-container';

    const ratingColor = getRatingColor(data.avgRating);
    const lastReview = data.lastRating ? new Date(data.lastRating.replace(' +0000 UTC', 'Z').replace(' ', 'T')).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
    }) : null;
    const wouldTakeAgain = data.wouldTakeAgainPercent === -1 ? "N/A": `$ {
        Math.round(data.wouldTakeAgainPercent)
    } % `;
    const lowRatings = data.numRatings < 10;

    const link = document.createElement('a');
    link.className = 'professor-name';
    link.href = `https: //www.ratemyprofessors.com/professor/${data.legacyId}`;
    link.target = '_blank';

    const dot = document.createElement('span');
    dot.className = 'rating-dot';
    dot.style.background = ratingColor;

    link.appendChild(dot);
    link.appendChild(document.createTextNode(`$ {
        originalName
    }↗`));

    const statsDiv = document.createElement('div');
    statsDiv.className = 'professor-stats';

    const headerDiv = document.createElement('div');
    headerDiv.className = 'professor-header';
    const fullNameSpan = document.createElement('span');
    fullNameSpan.className = 'professor-full-name';
    const strongName = document.createElement('strong');
    strongName.textContent = `$ {
        data.firstName
    }
    $ {
        data.lastName
    }`;
    fullNameSpan.appendChild(strongName);
    headerDiv.appendChild(fullNameSpan);
    statsDiv.appendChild(headerDiv);

    const rowDiv = document.createElement('div');
    rowDiv.className = 'professor-row';

    const ratingBoxDiv = document.createElement('div');
    ratingBoxDiv.className = 'rating-box';
    ratingBoxDiv.style.background = ratingColor;
    const ratingNumber = document.createElement('span');
    ratingNumber.className = 'rating-number';
    ratingNumber.textContent = data.avgRating;
    const ratingLabel = document.createElement('span');
    ratingLabel.className = 'rating-label';
    ratingLabel.textContent = '/ 5 ';
    ratingBoxDiv.appendChild(ratingNumber);
    ratingBoxDiv.appendChild(ratingLabel);
    rowDiv.appendChild(ratingBoxDiv);

    const ratingDetailsDiv = document.createElement('div');
    ratingDetailsDiv.className = 'rating-details';

    const diffSpan = document.createElement('span');
    diffSpan.textContent = 'Difficulty: ';
    const diffStrong = document.createElement('strong');
    diffStrong.textContent = data.avgDifficulty;
    diffSpan.appendChild(diffStrong);

    const takeAgainSpan = document.createElement('span');
    const takeAgainStrong = document.createElement('strong');
    takeAgainStrong.textContent = wouldTakeAgain;
    takeAgainSpan.appendChild(takeAgainStrong);
    takeAgainSpan.appendChild(document.createTextNode(' would take again'));

    const numRatingsSpan = document.createElement('span');
    const numRatingsStrong = document.createElement('strong');
    numRatingsStrong.textContent = data.numRatings;
    numRatingsSpan.appendChild(numRatingsStrong);
    numRatingsSpan.appendChild(document.createTextNode(' ratings'));

    ratingDetailsDiv.appendChild(diffSpan);
    ratingDetailsDiv.appendChild(takeAgainSpan);
    ratingDetailsDiv.appendChild(numRatingsSpan);

    rowDiv.appendChild(ratingDetailsDiv);
    statsDiv.appendChild(rowDiv);

    if (lowRatings) {
        const lowWarnSpan = document.createElement('span');
        lowWarnSpan.className = 'low-ratings-warning';
        const lowWarnStrong = document.createElement('strong');
        lowWarnStrong.textContent = '⚠️ Low rating count';
        lowWarnSpan.appendChild(lowWarnStrong);
        statsDiv.appendChild(lowWarnSpan);
    }

    if (lastReview) {
        const lastRevSpan = document.createElement('span');
        lastRevSpan.className = 'last-review';
        const lastRevStrong = document.createElement('strong');
        lastRevStrong.textContent = 'Last reviewed: ';
        const lastRevEm = document.createElement('em');
        lastRevEm.textContent = lastReview;
        lastRevStrong.appendChild(lastRevEm);
        lastRevSpan.appendChild(lastRevStrong);
        statsDiv.appendChild(lastRevSpan);
    }

    overview.appendChild(link);
    overview.appendChild(statsDiv);

    cell.textContent = '';
    cell.appendChild(overview);

    link.style.setProperty('color', '#2e6da4', 'important');

    link.addEventListener('blur', () = >{
        link.style.setProperty('color', '#2e6da4', 'important');
    });

    link.addEventListener('click', () = >{
        setTimeout(() = >{
            link.style.setProperty('color', '#2e6da4', 'important');
        },
        100);
    });

    overview.addEventListener('mouseenter', () = >{
        const stats = overview.querySelector('.professor-stats');
        const rect = overview.getBoundingClientRect();

        stats.style.position = 'fixed';
        stats.style.top = (rect.top - 100) + 'px';
        stats.style.left = (rect.right + 5) + 'px';

        if (rect.right + 220 > window.innerWidth) {
            stats.style.left = (rect.left - 225) + 'px';
        }

        if (rect.top < 0) {
            stats.style.top = rect.bottom + 'px';
        }
    });
}

function injectNotFound(cell, name) {
    const overview = document.createElement('div');
    overview.className = 'professor-container';

    const plainSpan = document.createElement('span');
    plainSpan.className = 'professor-name-plain';

    const dot = document.createElement('span');
    dot.className = 'rating-dot';
    dot.style.background = '#666';

    plainSpan.appendChild(dot);
    plainSpan.appendChild(document.createTextNode(`$ {
        name
    }↗`));

    const statsDiv = document.createElement('div');
    statsDiv.className = 'professor-stats';

    const headerDiv = document.createElement('div');
    headerDiv.className = 'professor-header';
    const fullNameSpan = document.createElement('span');
    fullNameSpan.className = 'professor-full-name';
    const strongName = document.createElement('strong');
    strongName.textContent = name;
    fullNameSpan.appendChild(strongName);
    headerDiv.appendChild(fullNameSpan);

    const ratingBoxDiv = document.createElement('div');
    ratingBoxDiv.className = 'rating-box';
    ratingBoxDiv.style.background = '#666';
    const ratingNumber = document.createElement('span');
    ratingNumber.className = 'rating-number';
    ratingNumber.textContent = 'N/A';
    ratingBoxDiv.appendChild(ratingNumber);

    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'rating-details';
    const detailsSpan = document.createElement('span');
    detailsSpan.textContent = 'Click name to search on RMP';
    detailsDiv.appendChild(detailsSpan);

    statsDiv.appendChild(headerDiv);
    statsDiv.appendChild(ratingBoxDiv);
    statsDiv.appendChild(detailsDiv);

    overview.appendChild(plainSpan);
    overview.appendChild(statsDiv);

    cell.textContent = '';
    cell.appendChild(overview);

    overview.addEventListener('click', () = >{
        window.open(`https: //www.ratemyprofessors.com/search/professors/1253?q=${encodeURIComponent(name)}`, '_blank');
    });

    overview.addEventListener('mouseenter', () = >{
        const stats = overview.querySelector('.professor-stats');
        const rect = overview.getBoundingClientRect();

        stats.style.position = 'fixed';
        stats.style.top = (rect.top - 100) + 'px';
        stats.style.left = (rect.right + 5) + 'px';

        if (rect.right + 220 > window.innerWidth) {
            stats.style.left = (rect.left - 225) + 'px';
        }

        if (rect.top < 0) {
            stats.style.top = rect.bottom + 'px';
        }
    });
}

const observer = new MutationObserver(() = >{
    const cells = document.querySelectorAll('[xe-field="instructor"]');
    cells.forEach(cell = >{
        if (cell.dataset.ninerProcessed) return;
        cell.dataset.ninerProcessed = "true";
        const anchors = cell.querySelectorAll('a.email');
        if (anchors.length > 0) {
            cell.textContent = '';
            anchors.forEach(anchor = >{
                const name = anchor.textContent.trim();
                const wrapper = document.createElement('div');
                wrapper.textContent = '...';
                cell.appendChild(wrapper);
                try {
                    chrome.runtime.sendMessage({
                        professorName: name
                    },
                    (response) = >{
                        if (response && response.success) {
                            injectOverview(wrapper, response.data, name);
                        } else {
                            injectNotFound(wrapper, name);
                        }
                    });
                } catch(e) {
                    wrapper.textContent = name;
                    cell.dataset.ninerProcessed = "";
                }
            });
        }
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
