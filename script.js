const canvas = document.getElementById('signCanvas');
const ctx = canvas.getContext('2d');

const routeDatabase = {
    custom: {
        shield: "INTERSTATE",
        num: "90",
        l1: "CUSTOM SIGN",
        l2: "EXIT ONLY",
        l3: "NEXT RIGHT",
        desc: "Manually adjust text, routes, and decay options using the inputs below to build your custom chapter screen overlay."
    },
    tx75: {
        shield: "TEXAS",
        num: "75",
        l1: "OUTBREAK DAY",
        l2: "EXIT 2013",
        l3: "TEXAS OUTSKIRTS",
        desc: "Prologue: The route Joel, Tommy, and Sarah took trying to flee their Austin neighborhood as the cordyceps infection compromised the city."
    },
    i35: {
        shield: "INTERSTATE",
        num: "35",
        l1: "AUSTIN NORTH",
        l2: "DALLAS 180 MILES",
        l3: "EVACUATION ROUTE",
        desc: "Prologue Highway: The primary interstate corridor jammed with flaming wrecks, military checkpoints, and frantic crowds trying to escape north."
    },
    i90: {
        shield: "INTERSTATE",
        num: "90",
        l1: "LINCOLN TOWN",
        l2: "BILL'S ZONE",
        l3: "BOSTON OUTSKIRTS",
        desc: "Chapter 3/4: Route leading out of the Boston Quarantine Zone past the military pressure traps into Bill's fortified town limits."
    },
    i70: {
        shield: "INTERSTATE",
        num: "70",
        l1: "PITTSBURGH",
        l2: "EXPECT AMBUSH",
        l3: "BRIDGE CLOSED",
        desc: "Chapter 5: The cross-country interstate corridor where Joel and Ellie run into the Hunter highway barricade and vehicular trap."
    },
    us11: {
        shield: "US",
        num: "11",
        l1: "SUBURBS AHEAD",
        l2: "SEWER EXPULSION",
        l3: "RADIO TOWER",
        desc: "Chapter 6: The bypass highway traveled with Sam and Henry running away from downtown Pittsburgh towards the suburban residential line."
    },
    i15: {
        shield: "INTERSTATE",
        num: "15",
        l1: "SALT LAKE CITY",
        l2: "ST. MARY'S HOSP",
        l3: "QUARANTINE TERMINAL",
        desc: "Chapter 9/10: The final long-range interstate entry point taken to reach the Firefly medical staging labs at Saint Mary's Hospital."
    },
    us89: {
        shield: "US",
        num: "89",
        l1: "JACKSON HOLE",
        l2: "TOMMY'S DAM",
        l3: "WYOMING WILDERNESS",
        desc: "Chapter 7: The winding scenic mountain highway infrastructure leading down toward the hydro-electric dam settlement."
    }
};

const routeSelect = document.getElementById('routeSelect');
const shieldType = document.getElementById('shieldType');
const shieldNumber = document.getElementById('shieldNumber');
const line1 = document.getElementById('line1');
const line2 = document.getElementById('line2');
const line3 = document.getElementById('line3');
const decayLevel = document.getElementById('decayLevel');
const bulletHoles = document.getElementById('bulletHoles');

document.getElementById('decayLevel').addEventListener('input', (e) => document.getElementById('decayVal').innerText = e.target.value);
document.getElementById('bulletHoles').addEventListener('input', (e) => document.getElementById('bulletVal').innerText = e.target.value);

[routeSelect, shieldType, shieldNumber, line1, line2, line3, decayLevel, bulletHoles].forEach(element => {
    element.addEventListener('input', renderSign);
});

routeSelect.addEventListener('change', function() {
    const data = routeDatabase[this.value];
    document.getElementById('routeDescription').innerText = data.desc;
    if(this.value !== 'custom') {
        shieldType.value = data.shield;
        shieldNumber.value = data.num;
        line1.value = data.l1;
        line2.value = data.l2;
        line3.value = data.l3;
    }
    renderSign();
});

function generateSeededNoise(width, height, count, seed) {
    let points = [];
    let localSeed = seed;
    for (let i = 0; i < count; i++) {
        localSeed = (localSeed * 9301 + 49297) % 233280;
        let x = 40 + (localSeed % (width - 80));
        localSeed = (localSeed * 9301 + 49297) % 233280;
        let y = 40 + (localSeed % (height - 80));
        points.push({x, y});
    }
    return points;
}
function drawShield(type, number, x, y) {
    ctx.save();
    ctx.translate(x, y);
    let sz = 75; 

    if (type === 'TEXAS') {
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#111111';
        ctx.lineWidth = 4;
        ctx.fillRect(-sz/2, -sz/2, sz, sz);
        ctx.strokeRect(-sz/2, -sz/2, sz, sz);
        
        ctx.fillStyle = '#111111';
        ctx.font = '900 12px "Overpass", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("TEXAS", 0, -18);
        
        ctx.font = '900 32px "Overpass", sans-serif';
        ctx.fillText(number, 0, 15);

    } else if (type === 'INTERSTATE') {
        ctx.beginPath();
        ctx.moveTo(-sz/2, -sz/3);
        ctx.quadraticCurveTo(-sz/2, -sz/2, 0, -sz/2);
        ctx.quadraticCurveTo(sz/2, -sz/2, sz/2, -sz/3);
        ctx.lineTo(sz/2, 0);
        ctx.quadraticCurveTo(sz/2, sz/3, 0, sz/2);
        ctx.quadraticCurveTo(-sz/2, sz/3, -sz/2, 0);
        ctx.closePath();
        
        ctx.fillStyle = '#1a3a6c'; 
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.save();
        ctx.clip();
        ctx.fillStyle = '#9c2424'; 
        ctx.fillRect(-sz, -sz/2, sz*2, sz/3 + 3);
        ctx.restore();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = '900 34px "Overpass", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(number, 0, 18);

    } else if (type === 'US') {
        ctx.beginPath();
        ctx.moveTo(-sz/2, -sz/2);
        ctx.lineTo(sz/2, -sz/2);
        ctx.lineTo(sz/2, -sz/6);
        ctx.quadraticCurveTo(sz/2, sz/4, 0, sz/2);
        ctx.quadraticCurveTo(-sz/2, sz/4, -sz/2, -sz/6);
        ctx.closePath();

        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = '#111111';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.fillStyle = '#111111';
        ctx.font = '900 34px "Overpass", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(number, 0, 12);
    }

    ctx.restore();
}

function renderSign() {
    const w = canvas.width;
    const h = canvas.height;
    const decay = parseInt(decayLevel.value);
    
    ctx.fillStyle = '#101412'; 
    ctx.fillRect(0, 0, w, h);

    const padding = 30;
    const sw = w - padding * 2;
    const sh = h - padding * 2;
    
    const greenHue = 150 - (decay * 3);
    const greenSat = 35 - (decay * 2);
    const greenLight = 14 - (decay * 0.6);
    ctx.fillStyle = `hsl(${greenHue}, ${greenSat}%, ${greenLight}%)`;
    
    ctx.beginPath();
    ctx.roundRect(padding, padding, sw, sh, 18);
    ctx.fill();

    ctx.globalCompositeOperation = 'source-atop';
    
    for (let i = 0; i < decay * 4; i++) {
        let rX = Math.random() * sw + padding;
        let rY = Math.random() * sh + padding;
        let rRad = Math.random() * (decay * 25) + 10;
        let grd = ctx.createRadialGradient(rX, rY, 2, rX, rY, rRad);
        grd.addColorStop(0, `rgba(${80 + decay*8}, ${60 + decay*2}, 30, ${0.15 * (decay/4)})`);
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(rX, rY, rRad, 0, Math.PI * 2);
        ctx.fill();
    }

    for (let i = 0; i < decay * 2; i++) {
        let mX = Math.random() * sw + padding;
        let mY = (Math.random() < 0.5) ? padding + 10 : padding + sh - 20; 
        let mRad = Math.random() * (decay * 35) + 15;
        let grd = ctx.createRadialGradient(mX, mY, 5, mX, mY, mRad);
        grd.addColorStop(0, `rgba(35, 55, 25, ${0.4 * (decay/5)})`);
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(mX, mY, mRad, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';

    ctx.strokeStyle = `rgba(210, 220, 215, ${0.85 - (decay * 0.05)})`;
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.roundRect(padding + 12, padding + 12, sw - 24, sh - 24, 10);
    ctx.stroke();

    if (shieldType.value !== 'NONE') {
        drawShield(shieldType.value, shieldNumber.value, w / 2 - 120, h / 2 - 110);
    }

    ctx.fillStyle = `rgba(235, 242, 238, ${0.9 - (decay * 0.04)})`;
    ctx.textAlign = "left";
    
    if (shieldType.value !== 'NONE') {
        ctx.font = '900 36px "Overpass", sans-serif';
        ctx.fillText("WEST", w / 2 - 45, h / 2 - 100);
    }

    ctx.textAlign = "center";
    
    ctx.font = '900 52px "Overpass", sans-serif';
    ctx.fillText(line1.value.toUpperCase(), w / 2, h / 2 + 10);

    ctx.font = '600 44px "Overpass", sans-serif';
    ctx.fillText(line2.value.toUpperCase(), w / 2, h / 2 + 80);

    ctx.font = '600 34px "Overpass", sans-serif';
    ctx.fillStyle = `rgba(225, 235, 228, ${0.75 - (decay * 0.05)})`; 
    ctx.fillText(line3.value.toUpperCase(), w / 2, h / 2 + 145);

    const impacts = parseInt(bulletHoles.value);
    const holePositions = generateSeededNoise(w, h, impacts, 42); 
    
    holePositions.forEach(pt => {
        ctx.fillStyle = '#1c211f';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#4c5350';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#050706';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        if(decay > 3) {
            let streakGrad = ctx.createLinearGradient(pt.x, pt.y, pt.x, pt.y + (decay * 6));
            streakGrad.addColorStop(0, `rgba(90, 45, 15, ${0.4 * (decay/5)})`);
            streakGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = streakGrad;
            ctx.fillRect(pt.x - 2, pt.y + 2, 4, decay * 6);
        }
    });
}

document.fonts.ready.then(() => {
    document.getElementById('routeDescription').innerText = routeDatabase.tx75.desc;
    renderSign();
});

document.getElementById('downloadBtn').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `tlou-episode-sign-${line1.value.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL();
    link.click();
});
