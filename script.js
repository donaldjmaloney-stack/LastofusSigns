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

const controlPane = document.querySelector('.controls-pane');

// Check to prevent duplicate injection loops on reload
if (!document.getElementById('fireflyToggle')) {
    const ffGroup = document.createElement('div');
    ffGroup.className = 'control-group';
    ffGroup.innerHTML = `<label for="fireflyToggle">Fireflies Graffiti Logo</label>
    <select id="fireflyToggle">
        <option value="NONE">No Graffiti</option>
        <option value="WHITE" selected>White Stencil Paint</option>
        <option value="BLACK">Black Splatter Paint</option>
    </select>`;
    controlPane.appendChild(ffGroup);

    const rustGroup = document.createElement('div');
    rustGroup.className = 'control-group';
    rustGroup.innerHTML = `<label for="rustSlider">Rust Streaks Severity</label>
    <div class="range-slider">
        <input type="range" id="rustSlider" min="0" max="10" value="5">
        <span id="rustVal">5</span>
    </div>`;
    controlPane.appendChild(rustGroup);

    const bannerGroup = document.createElement('div');
    bannerGroup.className = 'control-group';
    bannerGroup.innerHTML = `<label for="bannerSelect">Overlay Warning Banner</label>
    <select id="bannerSelect">
        <option value="NONE" selected>No Banner</option>
        <option value="FEDRA">FEDRA ZONE - NO UNAUTHORIZED ENTRY</option>
        <option value="MILITARY">MILITARY CHECKPOINT AHEAD</option>
    </select>`;
    controlPane.appendChild(bannerGroup);
}

const fireflyToggle = document.getElementById('fireflyToggle');
const rustSlider = document.getElementById('rustSlider');
const bannerSelect = document.getElementById('bannerSelect');

rustSlider.addEventListener('input', (e) => document.getElementById('rustVal').innerText = e.target.value);
document.getElementById('decayLevel').addEventListener('input', (e) => document.getElementById('decayVal').innerText = e.target.value);
document.getElementById('bulletHoles').addEventListener('input', (e) => document.getElementById('bulletVal').innerText = e.target.value);

[routeSelect, shieldType, shieldNumber, line1, line2, line3, decayLevel, bulletHoles, fireflyToggle, rustSlider, bannerSelect].forEach(element => {
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

function drawFireflyGraffiti(x, y, color) {
    const pngSource = document.getElementById('fireflyLocalPNG');
    
    // Safety check: if the PNG file isn't found or loaded yet, skip drawing to prevent app crashing
    if (!pngSource) return;

    ctx.save();
    
    // 1. Set up a temporary hidden canvas buffer to strip the PNG's color and apply porous paint textures
    let offCanvas = document.createElement('canvas');
    offCanvas.width = 160;
    offCanvas.height = 160;
    let oCtx = offCanvas.getContext('2d');

    // Draw your clean firefly.png file onto the hidden layer
    oCtx.drawImage(pngSource, 10, 10, 140, 140);

    // 2. The Stencil Mask: Convert the shape silhouette into a solid paint layer (White or Black)
    oCtx.globalCompositeOperation = 'source-in';
    oCtx.fillStyle = color === 'WHITE' ? 'rgba(230, 238, 232, 0.78)' : 'rgba(14, 18, 15, 0.88)';
    oCtx.fillRect(0, 0, 160, 160);

    // 3. Stencil Texture: Add dynamic micro-speckles inside the logo bounds to mimic standard aerosol grit
    oCtx.globalCompositeOperation = 'source-atop';
    oCtx.fillStyle = color === 'WHITE' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
    for(let i = 0; i < 40; i++) {
        oCtx.fillRect(Math.random() * 160, Math.random() * 160, Math.random() * 2 + 1, Math.random() * 2 + 1);
    }

    // 4. Paint the finalized textured stencil logo onto your green highway road sign panel
    ctx.drawImage(offCanvas, x - 80, y - 80);

    // 5. Seeded Random System: Prevents spray paint particles from flickering or jumping around when typing text
    let localSeed = 54321;
    function seededRandom() {
        localSeed = (localSeed * 9301 + 49297) % 233280;
        return localSeed / 233280;
    }

    // 6. Aerosol Mist Overspray Pass: Simulates authentic stencil bleeding around the outside edge of the emblem
    for(let s = 0; s < 140; s++) {
        let angle = seededRandom() * Math.PI * 2;
        let radius = seededRandom() * 85;
        let sx = x + Math.cos(angle) * radius;
        let sy = y + Math.sin(angle) * radius;
        ctx.fillStyle = color === 'WHITE' ? `rgba(230,238,232,${seededRandom() * 0.12})` : `rgba(14,18,15,${seededRandom() * 0.12})`;
        ctx.beginPath(); 
        ctx.arc(sx, sy, seededRandom() * 2.2 + 0.4, 0, Math.PI * 2); 
        ctx.fill();
    }

    // 7. Vertical Paint Drips: Renders survivalist spray runs running down from the base of the wing elements
    ctx.fillStyle = color === 'WHITE' ? 'rgba(230,238,232,0.65)' : 'rgba(14,18,15,0.75)';
    for(let d = 0; d < 4; d++) {
        // Distribute the runs across the width of the lower logo body section
        let dx = x + (seededRandom() - 0.5) * 55;
        let startY = y + 10 + (seededRandom() * 15);
        let dl = seededRandom() * 50 + 25;
        let dw = seededRandom() * 1.6 + 1.4;
        
        // Draw the vertical drip line body
        ctx.fillRect(dx - dw/2, startY, dw, dl);
        
        // Draw the terminal heavy bulbous paint droplet hanging at the bottom tip of the streak
        ctx.beginPath();
        ctx.arc(dx, startY + dl, dw * 0.95, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.restore();
}

function renderSign() {
    const w = canvas.width; const h = canvas.height;
    const decay = parseInt(decayLevel.value);
    const rust = parseInt(rustSlider.value);
    
    ctx.fillStyle = '#101412'; ctx.fillRect(0, 0, w, h);

    const padding = 30; const sw = w - padding * 2; const sh = h - padding * 2;
    const greenHue = 150 - (decay * 3);
    const greenSat = 35 - (decay * 2);
    const greenLight = 14 - (decay * 0.6);
    ctx.fillStyle = `hsl(${greenHue}, ${greenSat}%, ${greenLight}%)`;
    
    ctx.beginPath(); ctx.roundRect(padding, padding, sw, sh, 18); ctx.fill();

    ctx.globalCompositeOperation = 'source-atop';
    for (let i = 0; i < decay * 4; i++) {
        let rX = Math.random() * sw + padding; let rY = Math.random() * sh + padding;
        let rRad = Math.random() * (decay * 25) + 10;
        let grd = ctx.createRadialGradient(rX, rY, 2, rX, rY, rRad);
        grd.addColorStop(0, `rgba(${80 + decay*8}, ${60 + decay*2}, 30, ${0.15 * (decay/4)})`);
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(rX, rY, rRad, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';

    ctx.strokeStyle = `rgba(210, 220, 215, ${0.85 - (decay * 0.05)})`;
    ctx.lineWidth = 7; ctx.beginPath(); ctx.roundRect(padding + 12, padding + 12, sw - 24, sh - 24, 10); ctx.stroke();

    if (shieldType.value !== 'NONE') {
        drawShield(shieldType.value, shieldNumber.value, w / 2 - 120, h / 2 - 110);
    }

    ctx.fillStyle = `rgba(235, 242, 238, ${0.9 - (decay * 0.04)})`;
    ctx.textAlign = "left";
    if (shieldType.value !== 'NONE') {
        ctx.font = '900 36px "Overpass", sans-serif'; ctx.fillText("WEST", w / 2 - 45, h / 2 - 100);
    }

    ctx.textAlign = "center";
    ctx.font = '900 52px "Overpass", sans-serif';
    ctx.fillText(line1.value.toUpperCase(), w / 2, h / 2 + 10);
    ctx.font = '600 44px "Overpass", sans-serif';
    ctx.fillText(line2.value.toUpperCase(), w / 2, h / 2 + 80);
    ctx.font = '600 34px "Overpass", sans-serif';
    ctx.fillStyle = `rgba(225, 235, 228, ${0.75 - (decay * 0.05)})`; 
    ctx.fillText(line3.value.toUpperCase(), w / 2, h / 2 + 145);

    if (fireflyToggle.value !== 'NONE') {
        drawFireflyGraffiti(w / 2 + 240, h / 2 - 95, fireflyToggle.value);
    }

    if (bannerSelect.value !== 'NONE') {
        ctx.fillStyle = '#942b2b';
        ctx.fillRect(padding + 20, h - 95, sw - 40, 45);
        ctx.lineWidth = 2; ctx.strokeStyle = '#d4ded9'; ctx.strokeRect(padding + 22, h - 93, sw - 44, 41);
        ctx.fillStyle = '#ffffff'; ctx.font = '900 20px "Overpass", sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(bannerSelect.value === 'FEDRA' ? "FEDRA ZONE - NO UNAUTHORIZED ENTRY" : "MILITARY CHECKPOINT AHEAD", w / 2, h - 65);
    }

    const impacts = parseInt(bulletHoles.value);
    const holePositions = generateSeededNoise(w, h, impacts, 42); 
    
    holePositions.forEach(pt => {
        ctx.fillStyle = '#1c211f'; ctx.beginPath(); ctx.arc(pt.x, pt.y, 7, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#4c5350'; ctx.beginPath(); ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#050706'; ctx.beginPath(); ctx.arc(pt.x, pt.y, 1.5, 0, Math.PI * 2); ctx.fill();
        
        let activeRust = Math.max(decay, rust);
        if(activeRust > 1) {
            let streakGrad = ctx.createLinearGradient(pt.x, pt.y, pt.x, pt.y + (activeRust * 8));
            streakGrad.addColorStop(0, `rgba(95, 42, 12, ${0.45 * (activeRust/5)})`);
            streakGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = streakGrad; ctx.fillRect(pt.x - 2, pt.y + 2, 4, activeRust * 8);
        }
    });
}

// Initial source image asset checking hook on boot
const baseLogo = document.getElementById('fireflyLogoSource');
if(baseLogo) {
    baseLogo.onload = () => renderSign();
}

document.fonts.ready.then(() => {
    document.getElementById('routeDescription').innerText = routeDatabase.tx75.desc;
    renderSign();
});

document.getElementById('downloadBtn').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `tlou-episode-sign-${line1.value.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL(); link.click();
});
