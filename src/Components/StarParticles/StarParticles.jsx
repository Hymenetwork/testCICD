import { useCallback} from 'react'

import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";

export const StarParticles = () => {
    const particlesInit = useCallback(async engine => {
        await loadSlim(engine);
    }, []);

    return (
        <Particles
            id="star-particles"
            init={particlesInit}
            options={{
                "particles": {
                    "number": {
                        "value": 200,
                        "density": {
                            "enable": true,
                            "value_area": 789.1476416322727
                        }
                    },
                    "color": {
                        "value": "#ffffff"
                    },
                    "shape": {
                        "type": "circle",
                        "stroke": {
                            "width": 0,
                            "color": "#000000"
                        },
                        "polygon": {
                            "nb_sides": 5
                        }
                    },
                    "opacity": {
                        "value": 0.48927153781200905,
                        "random": false,
                        "anim": {
                            "enable": true,
                            "speed": 0.2,
                            "opacity_min": 0,
                            "sync": false
                        }
                    },
                    "size": {
                        "value": 2,
                        "random": true,
                        "anim": {
                            "enable": true,
                            "speed": 2,
                            "size_min": 0,
                            "sync": false
                        }
                    },
                    "move": {
                        "enable": true,
                        "speed": 0.2,
                        "direction": "none",
                        "random": true,
                        "straight": false,
                        "out_mode": "out",
                        "bounce": false,
                            "attract": {
                            "enable": false,
                            "rotateX": 600,
                            "rotateY": 1200
                        }
                    }
                    },
                "retina_detect": true
            }}
        />
    )
}
