export function groupById(table) {
    let groups = {};
    table.forEach((item) => {
        if (groups.hasOwnProperty(item.ID_EVENT)) {
            groups[item.ID_EVENT].participants.push(item.participant);
        } else {
            groups[item.ID_EVENT] = item;
            groups[item.ID_EVENT].participants = [item.participant];
        }
    });
    return Object.values(groups);
}

export function ObjectFilter(obj, fn) {
    Object.keys(obj)
        .filter(key => fn(obj[key]))
        .reduce((res, key) => (res[key] = obj[key], res), {});
}


// export { groupById, ObjectFilter }

// module.exports = {
//     groupById: groupById,
//     ObjectFilter: ObjectFilter
// }

/* 

Object.filter = (obj, fn) =>
    Object.keys(obj)
    .filter(key => fn(obj[key]))
    .reduce((res, key) => (res[key] = obj[key], res), {});

var scores = {
    John: 2,
    Sarah: 3,
    Janet: 1
};
var filtered = Object.filter(scores, score => score > 1);
console.log(filtered);


 */