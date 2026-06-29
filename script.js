document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('scale-slider');
    const engine = document.getElementById('engine');
    const nameDisplay = document.getElementById('object-name');
    const sizeDisplay = document.getElementById('object-size');
    const nodes = document.querySelectorAll('.cosmic-node');

    // High precision dataset mapping exponent to metrics
    const universeData = {
        "-15": { name: "Quark", metric: "0.000000000000001 meters (10⁻¹⁵ m)" },
        "-10": { name: "Atom (Hydrogen)", metric: "0.0000000001 meters (10⁻¹⁰ m)" },
        "-6":  { name: "Human Cell", metric: "0.000005 meters (10⁻⁶ m)" },
        "0":   { name: "Human Being", metric: "1.7 meters (10⁰ m)" },
        "3":   { name: "Mount Everest", metric: "8,848 meters (10³ m)" },
        "6":   { name: "Planet Earth", metric: "12,742,000 meters (10⁶ m)" },
        "9":   { name: "The Sun", metric: "1,392,700,000 meters (10⁹ m)" },
        "15":  { name: "Milky Way Galaxy", metric: "9.46 × 10¹⁷ meters (10¹⁵ m)" }
    };

    function processScaleTransform() {
        const sliderValue = parseFloat(slider.value);
        
        // Logarithmic conversion multiplier for consistent zoom performance
        const scaleFactor = Math.pow(10, -sliderValue);
        engine.style.transform = `scale(${scaleFactor})`;

        let targetedNode = null;
        let minimumExponentDistance = Infinity;

        nodes.forEach(node => {
            const nodeExponent = parseFloat(node.getAttribute('data-exponent'));
            const exponentDistance = Math.abs(sliderValue - nodeExponent);

            // Dynamically clip/fade nodes out of view to optimize mobile render performance
            if (exponentDistance < 3.5) {
                // Smooth fade window calculation
                node.style.opacity = (1 - (exponentDistance / 3.5)).toString();
                node.style.pointerEvents = "auto";
            } else {
                node.style.opacity = "0";
                node.style.pointerEvents = "none";
            }

            // Identify active display metadata
            if (exponentDistance < minimumExponentDistance) {
                minimumExponentDistance = exponentDistance;
                targetedNode = universeData[nodeExponent.toString()];
            }
        });

        // Safe DOM updates
        if (targetedNode) {
            nameDisplay.textContent = targetedNode.name;
            sizeDisplay.textContent = `Size: ${targetedNode.metric}`;
        }
    }

    // High frequency performance handlers
    slider.addEventListener('input', processScaleTransform);
    slider.addEventListener('touchmove', processScaleTransform, { passive: true });

    // Bootstrap execution
    processScaleTransform();
});
