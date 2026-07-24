// sabi user ke data ki extra information dalna

const itemFeatures = {
    "A": {
        popularity: 0.8,
        ctr: 0.15,
        category: "action"
    },
    "B": {
        popularity: 0.5,
        ctr: 0.08,
        category: "comedy"
    },
    "C": {
        popularity: 0.7,
        ctr: 0.12,
        category: "action"
    }
};

// har user ki extra info uske sth merge krna  aur return krna

function enrichWithFeatures(candidates) {
    const enrichedCandidates = candidates.map((candidate) => {
        const features = itemFeatures[candidate.itemId];

        return {
            ...candidate,
            ...features
        };
    });

    return enrichedCandidates;
}

module.exports = {
    itemFeatures,enrichWithFeatures
};