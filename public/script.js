let mapping;

window.onload = ()=>{
    fetch('/map',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(res=>res.json()).then(res=>{
        mapping = res;
        makebuttons();
    });
}

function makebuttons(){
    let container = document.querySelector('.btn-holder');
    mapping.forEach(obj=>{
        container.innerHTML += Button(obj);
    });
}

function send(id){
    fetch('/send',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(mapping.filter(obj=>obj.id===id)[0])
    }).catch(err=>console.log(err));
}

function Button(obj){
    return `
        <button class="btn btn-primary" onclick="send(${obj.id})"><img class="img" src="${obj.img}"></button>
    `
}