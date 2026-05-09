import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D u_texture;
uniform vec2 u_pointer;
uniform bool u_clicked;
uniform float u_time;
uniform float u_ratio;
uniform vec3 u_color;
varying vec2 vUv;

void main() {
    vec2 uv = vUv;
    vec4 prev = texture2D(u_texture, uv);
    
    // Organic growth logic: Diffusion + small random offsets
    float offset = 0.0018;
    vec4 neighbors = (
        texture2D(u_texture, uv + vec2(offset, 0.0)) +
        texture2D(u_texture, uv - vec2(offset, 0.0)) +
        texture2D(u_texture, uv + vec2(0.0, offset)) +
        texture2D(u_texture, uv - vec2(0.0, offset))
    ) * 0.25;
    
    vec4 color = mix(prev, neighbors, 0.08);
    
    // Slow decay
    color *= 0.994;
    
    // Interaction: Seeds
    vec2 p = u_pointer;
    p.x *= u_ratio;
    vec2 st = uv;
    st.x *= u_ratio;
    
    float dist = distance(st, p);
    if (u_clicked && dist < 0.05) {
        float strength = pow(1.0 - dist/0.05, 3.0);
        // Vary color based on position for a "petal" effect
        float angle = atan(st.y - p.y, st.x - p.x);
        float pattern = sin(angle * 5.0 + u_time * 2.0) * 0.5 + 0.5;
        
        vec3 bloom = u_color + 0.3 * sin(u_time + uv.xyx * 3.0);
        color.rgb = mix(color.rgb, bloom, strength * pattern * 0.6);
        color.a = max(color.a, strength * pattern);
    }
    
    gl_FragColor = color;
}
`;

const displayShader = `
uniform sampler2D u_texture;
varying vec2 vUv;
void main() {
    vec4 color = texture2D(u_texture, vUv);
    // Chromatic aberration and glow
    float r = texture2D(u_texture, vUv + vec2(0.001, 0.0)).r;
    float g = texture2D(u_texture, vUv).g;
    float b = texture2D(u_texture, vUv - vec2(0.001, 0.0)).b;
    
    vec3 base = vec3(r, g, b);
    float glow = length(base) * 0.4;
    
    gl_FragColor = vec4(base + base * glow, color.a * 0.8);
}
`;

const FooterWebGL = ({ freeze }) => {
    const containerRef = useRef();
    const isRenderingRef = useRef(!freeze);

    useEffect(() => {
        isRenderingRef.current = !freeze;
    }, [freeze]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const width = container.clientWidth;
        const height = container.clientHeight;

        const renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true,
            preserveDrawingBuffer: true 
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(width, height);
        container.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        let targetA = new THREE.WebGLRenderTarget(
            width * window.devicePixelRatio,
            height * window.devicePixelRatio,
            { format: THREE.RGBAFormat, type: THREE.HalfFloatType }
        );
        let targetB = targetA.clone();

        const pointer = { 
            x: 0.5 + Math.random() * 0.2, 
            y: 0.3 + Math.random() * 0.2, 
            clicked: true // Start with some flowers
        };
        const activeColor = new THREE.Color(0xff3366);

        // Auto-stop clicking after a short while
        setTimeout(() => { pointer.clicked = false; }, 2000);

        const onMove = (e) => {
            const rect = container.getBoundingClientRect();
            pointer.x = (e.clientX - rect.left) / rect.width;
            pointer.y = 1.0 - (e.clientY - rect.top) / rect.height;
        };
        const onDown = () => {
            pointer.clicked = true;
            activeColor.setHSL(Math.random() * 0.1 + 0.9, 0.8, 0.6); // Pinks/Reds
        };
        const onUp = () => { pointer.clicked = false; };

        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerdown', onDown);
        window.addEventListener('pointerup', onUp);

        const geometry = new THREE.PlaneGeometry(2, 2);
        const growthMaterial = new THREE.ShaderMaterial({
            uniforms: {
                u_texture: { value: null },
                u_pointer: { value: new THREE.Vector2(pointer.x, pointer.y) },
                u_clicked: { value: pointer.clicked },
                u_time: { value: 0 },
                u_ratio: { value: width / height },
                u_color: { value: activeColor }
            },
            vertexShader,
            fragmentShader
        });

        const growthMesh = new THREE.Mesh(geometry, growthMaterial);
        scene.add(growthMesh);

        const displayMaterial = new THREE.ShaderMaterial({
            uniforms: { u_texture: { value: null } },
            vertexShader,
            fragmentShader: displayShader,
            transparent: true
        });
        const displayMesh = new THREE.Mesh(geometry, displayMaterial);
        const displayScene = new THREE.Scene();
        displayScene.add(displayMesh);

        let time = 0;
        const animate = () => {
            if (isRenderingRef.current) {
                time += 0.01;
                
                growthMaterial.uniforms.u_texture.value = targetA.texture;
                growthMaterial.uniforms.u_pointer.value.set(pointer.x, pointer.y);
                growthMaterial.uniforms.u_clicked.value = pointer.clicked;
                growthMaterial.uniforms.u_time.value = time;
                growthMaterial.uniforms.u_color.value = activeColor;

                renderer.setRenderTarget(targetB);
                renderer.render(scene, camera);

                renderer.setRenderTarget(null);
                displayMaterial.uniforms.u_texture.value = targetB.texture;
                renderer.render(displayScene, camera);

                let temp = targetA;
                targetA = targetB;
                targetB = temp;
            }
            requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            renderer.setSize(w, h);
            targetA.setSize(w * window.devicePixelRatio, h * window.devicePixelRatio);
            targetB.setSize(w * window.devicePixelRatio, h * window.devicePixelRatio);
            growthMaterial.uniforms.u_ratio.value = w / h;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerdown', onDown);
            window.removeEventListener('pointerup', onUp);
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            targetA.dispose();
            targetB.dispose();
            geometry.dispose();
            growthMaterial.dispose();
            displayMaterial.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div 
            ref={containerRef} 
            className="footer-webgl-container"
            style={{ 
                position: 'absolute', 
                inset: 0, 
                zIndex: 0, 
                pointerEvents: 'none',
                opacity: 0.7 
            }} 
        />
    );
};

export default FooterWebGL;