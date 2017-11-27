let abtest = null;

export const loadABTest = (data) => {
    abtest = data || null;
    sessionStorage.setItem('SESSION_ABTEST', JSON.stringify(abtest));
};

export const retrieveABTest = () => {
    abtest = JSON.parse(sessionStorage.getItem('SESSION_ABTEST'));
};

export const getABTest = (experimentName) => {
    !abtest && retrieveABTest();
    let experiment = abtest && abtest.find((data) => {
        return data.name === experimentName;
    });
    return experiment;
};

export const getABTestKey = () => {
    !abtest && retrieveABTest();
    let key = abtest && abtest.length > 0 && abtest.sort((a, b) => {
        return a.group < b.group ? -1 : a.group > b.group ? 1 : 0;
    }).map(x => {
        return x.name + '=' + x.group;
    }).reduce((acc, x) => {
        return acc + '&' + x;
    });
    return key;
};
