// selectors
const currElement = null;

const prevStep = document.getElementById('prev-step');
const nextStep = document.getElementById('next-step');

prevStep.addEventListener('click', () => {

});
nextStep.addEventListener('click', () => {

});

// show/hide pages
const toggleContent = (li, elementToActivateIds) => {
    // li 
    li.classList.remove('text-gray-500');
    li.classList.add('text-blue-600');
    // span
    const span = li.firstElementChild;
    span.classList.remove('border-gray-500');
    span.classList.add('border-blue-600');
    const allElementIds = ['part1', 'part2', 'part3', 'part4', 'part5', 'part6', 'part7', 'part8', 'part9', 'part10', 'part11'];
    const elementsToDeactivate = allElementIds.filter(el => !elementToActivateIds.includes(el));
    //disable elements            
    for (const id of elementsToDeactivate) {
        document.getElementById(id).classList.add('hidden');
    }
    //enable elements
    for (const id of elementToActivateIds) {
        document.getElementById(id).classList.remove('hidden');
    }
}
const liElements = document.getElementById('multi-step').getElementsByTagName('li');
for (let [index, liElement] of Object.entries(liElements)) {
    const condition = {
        0: ['part1', 'part2'],
        1: ['part3', 'part4'],
        2: ['part5', 'part6', 'part7', 'part8'],
        3: ['part9', 'part10', 'part11'],
    }
    const elementsToActivate = condition[index];
    liElement.addEventListener('click', function() {
        toggleContent(this, elementsToActivate);
        // toggleContent(e.target, elementsToActivate);
    });
}
toggleContent(liElements[0], ['part1', 'part2']);

// enable main
document.getElementById("main").classList.remove('hidden')