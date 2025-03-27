const character = document.getElementById('character');
let posX = 0;
let posY = 0;

document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'w': // Move up
            posY -= 10;
            break;
        case 's': // Move down
            posY += 10;
            break;
        case 'a': // Move left
            posX -= 10;
            break;
        case 'd': // Move right
            posX += 10;
            break;
    }
    character.style.transform = `translate(${posX}px, ${posY}px)`;
});
