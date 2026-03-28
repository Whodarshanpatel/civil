import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const createTextTexture = (text, size, font, color, aspect = 1.0) => {
    const canvas = document.createElement("canvas");
    // Ensure max texture constraints but maintain aspect
    canvas.height = 1024;
    canvas.width = 1024 * aspect;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(canvas);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw thick stroke if outline color is provided, else standard fill
    ctx.font = `bold ${size}px ${font}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    // Check if color is 'outline' format (e.g. for the second line)
    // We'll just stick to a regular fill color but allow modifying it in the component.
    if (color === 'transparent-outline') {
        ctx.strokeStyle = '#1a1a1a'; // var(--black) equivalent
        ctx.lineWidth = size * 0.04; // scale outline to size
        ctx.strokeText(text, canvas.width / 2, canvas.height / 2);
    } else {
        ctx.fillStyle = color;
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
};

const vertexShader = `
    varying vec2 vUv;
    uniform vec3 uDisplacement;

    float easeInOutCubic(float x) {
        return x < 0.5 ? 4.0 * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 3.0) / 2.0;
    }

    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }

    void main() {
        vUv = uv;
        vec3 displaced = position;
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        float dist = length(uDisplacement - worldPosition.rgb);
        float minDistance = 3.0;

        if (dist < minDistance) {
            float mapped = map(dist, 0.0, minDistance, 1.0, 0.0);
            displaced.z += easeInOutCubic(mapped);
        }

        gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
    }
`;

const fragmentShader = `
    varying vec2 vUv;
    uniform sampler2D uTexture;

    void main() {
        gl_FragColor = texture2D(uTexture, vUv);
    }
`;

export function LiquidText({
    text = "Liquid Text",
    fontSize = 200,
    font = "Fredoka, sans-serif",
    color,
    lightColor = "#1a1a1a",
    darkColor = "#ffffff",
    className = "",
    style = {}
}) {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const width = rect.width || 1;
        const height = rect.height || 1;
        if (height === 0) return;

        const scene = new THREE.Scene();
        scene.background = null;

        const cameraDistance = 8;
        const aspect = width / height;
        const camera = new THREE.OrthographicCamera(
            -cameraDistance * aspect, cameraDistance * aspect,
            cameraDistance, -cameraDistance, 0.01, 1000
        );
        camera.position.set(0, -10, 5);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height, false);
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        container.appendChild(renderer.domElement);

        // Use aspect bounds for geometry to avoid clipping on wide screens
        const geometry = new THREE.PlaneGeometry(cameraDistance * aspect * 2, cameraDistance * 2, 100, 100);
        const getActiveColor = () => color || (document.documentElement.classList.contains("dark") ? darkColor : lightColor);

        let currentColor = getActiveColor();
        let textTexture = createTextTexture(text, fontSize, font, currentColor, aspect);

        const shaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTexture: { value: textTexture },
                uDisplacement: { value: new THREE.Vector3(0, 0, 0) },
            },
            vertexShader,
            fragmentShader,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide,
        });

        const plane = new THREE.Mesh(geometry, shaderMaterial);
        plane.rotation.z = Math.PI / 4;
        scene.add(plane);

        const hitPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(500, 500),
            new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
        );
        scene.add(hitPlane);

        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();

        const onPointerMove = (e) => {
            const bounds = container.getBoundingClientRect();
            pointer.x = ((e.clientX - bounds.left) / bounds.width) * 2 - 1;
            pointer.y = -((e.clientY - bounds.top) / bounds.height) * 2 + 1;
            raycaster.setFromCamera(pointer, camera);
            const [hit] = raycaster.intersectObject(hitPlane);
            if (hit) shaderMaterial.uniforms.uDisplacement.value.copy(hit.point);
        };

        container.addEventListener("pointermove", onPointerMove);

        const handleResize = () => {
            const r = container.getBoundingClientRect();
            if (r.height === 0) return;
            const a = r.width / r.height;
            camera.left = -cameraDistance * a;
            camera.right = cameraDistance * a;
            camera.updateProjectionMatrix();
            renderer.setSize(r.width, r.height, false);
        };

        window.addEventListener("resize", handleResize);

        let animationId = 0;
        const render = () => {
            animationId = requestAnimationFrame(render);
            renderer.render(scene, camera);
        };
        render();

        const observer = new MutationObserver(() => {
            const next = getActiveColor();
            if (next !== currentColor) {
                const tex = createTextTexture(text, fontSize, font, next, aspect);
                shaderMaterial.uniforms.uTexture.value = tex;
                textTexture.dispose();
                textTexture = tex;
                currentColor = next;
            }
        });
        if (!color) observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

        return () => {
            window.removeEventListener("resize", handleResize);
            container.removeEventListener("pointermove", onPointerMove);
            cancelAnimationFrame(animationId);
            observer.disconnect();
            if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
            renderer.dispose();
            textTexture.dispose();
            geometry.dispose();
            shaderMaterial.dispose();
        };
    }, [text, fontSize, font, color, lightColor, darkColor]);

    return <div ref={containerRef} className={className} style={{ position: 'relative', width: '100%', height: '100%', ...style }} />;
}

export default LiquidText;
