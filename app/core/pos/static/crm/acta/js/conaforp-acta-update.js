const curr_path = window.location.pathname;

fetch(curr_path, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    // body: JSON.stringify(payload),
})
.then(res => {
    console.log(res)
})
.catch(console.log)