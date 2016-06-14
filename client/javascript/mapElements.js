//Contains custom elements to use on the Map

//Create the Generate Map Button
export function genCtrl(parentDiv, map, idText, onClickFn) {
    // Set CSS for the control border.
    var Button = document.createElement('div');
    Button.style.backgroundColor = '#fff';
    Button.style.border = '2px solid #fff';
    Button.style.borderRadius = '3px';
    Button.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    Button.style.cursor = 'pointer';
    Button.style.marginBottom = '2px';
    Button.style.textAlign = 'center';
    Button.title = 'Click to generate a new route';
    parentDiv.appendChild(Button);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.id = idText;
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = idText;
    parentDiv.style.marginBottom = "8px";
    Button.appendChild(controlText);

    //Add any onclick events
    Button.addEventListener('click', onClickFn);
}

//save route button
export function saveRoute(parentDiv, map) {
    // Set CSS for the control border.
    var Button = document.createElement('div');
    Button.className = "fixed-action-btn click-to-toggle";
    parentDiv.appendChild(Button);

    Button.style.bottom = '3vh';
    Button.style.right = '3vw';

    var a = document.createElement('a');
    a.className = "btn-floating btn-large red";
    Button.appendChild(a);


    var i = document.createElement('i');
    i.className = "material-icons";
    i.innerHTML = "menu";
    a.appendChild(i);

    var ul = document.createElement('ul');
    //share, blue, share this route
    var btns = ['my_location', 'directions_run', 'save', 'settings']
    var btnclrs = ['purple', 'green', 'blue', 'red'];
    var btntitles = ['Change your location', 'Accept route', 'Save this route', "Route settings"]

    for (var i=0; i<btns.length; i++){
        var li = document.createElement('li');
        var a2 = document.createElement('a');
        a2.className = 'btn-floating '+ btnclrs[i];
        a2.title = btntitles[i];
        a2.id = btns[i];
        li.appendChild(a2);

        var i2 = document.createElement('i');
        i2.className = "material-icons";
        i2.innerHTML = btns[i];
        a2.appendChild(i2);
        ul.appendChild(li);
    }

    Button.appendChild(ul);
}