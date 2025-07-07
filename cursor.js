window.addEventListener('load', function() {
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);

    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '1001';
    canvas.style.pointerEvents = 'none';

    const ctx = canvas.getContext('2d');

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let points = [];
    const numPoints = 35; // Longer tail for the lizard
    const segmentLength = 8; // Shorter segments for a smoother curve

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        points = [];
        for (let i = 0; i < numPoints; i++) {
            points.push({ x: mouse.x, y: mouse.y });
        }
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    document.addEventListener('mousemove', function(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    function constrainPoints() {
        points[0].x = mouse.x;
        points[0].y = mouse.y;
        for (let i = 1; i < points.length; i++) {
            let p1 = points[i - 1];
            let p2 = points[i];
            let dx = p2.x - p1.x;
            let dy = p2.y - p1.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > segmentLength) {
                let angle = Math.atan2(dy, dx);
                p2.x = p1.x + Math.cos(angle) * segmentLength;
                p2.y = p1.y + Math.sin(angle) * segmentLength;
            }
        }
    }

    function drawLeg(origin, spineAngle, side, index) {
        const seg1 = 15, seg2 = 15, footSize = 4;
        const walkCycle = Math.sin(Date.now() * 0.004 + index * 0.5);
        
        const angle1 = spineAngle + side * 1.3 + walkCycle * side * 0.5;
        const jointX = origin.x + Math.cos(angle1) * seg1;
        const jointY = origin.y + Math.sin(angle1) * seg1;

        const angle2 = angle1 + side * 0.5 + walkCycle * side * 0.3;
        const footX = jointX + Math.cos(angle2) * seg2;
        const footY = jointY + Math.sin(angle2) * seg2;

        ctx.beginPath();
        ctx.moveTo(origin.x, origin.y);
        ctx.lineTo(jointX, jointY);
        ctx.lineTo(footX, footY);
        ctx.stroke();

        for (let i = 0; i < 3; i++) {
            const toeAngle = angle2 + (i - 1) * 0.4;
            ctx.beginPath();
            ctx.moveTo(footX, footY);
            ctx.lineTo(footX + Math.cos(toeAngle) * footSize, footY + Math.sin(toeAngle) * footSize);
            ctx.stroke();
        }
    }

    function drawPoints() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;

        // Draw spine
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
        
        // Draw vertebrae and legs
        for (let i = 1; i < points.length; i++) {
            let p1 = points[i - 1];
            let p2 = points[i];
            let angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);

            // Vertebrae
            let ribLength = 4 * (1 - i / points.length); // Tapering vertebrae
            ctx.beginPath();
            ctx.moveTo(p2.x + Math.cos(angle + Math.PI / 2) * ribLength, p2.y + Math.sin(angle + Math.PI / 2) * ribLength);
            ctx.lineTo(p2.x + Math.cos(angle - Math.PI / 2) * ribLength, p2.y + Math.sin(angle - Math.PI / 2) * ribLength);
            ctx.stroke();

            // Legs
            if (i % 7 === 0 && i < points.length * 0.6) { // Legs only on the front part of the body
                drawLeg(p2, angle, 1, i); // Right leg
                drawLeg(p2, angle, -1, i); // Left leg
            }
        }
    }

    function animate() {
        constrainPoints();
        drawPoints();
        requestAnimationFrame(animate);
    }

    animate();
});
