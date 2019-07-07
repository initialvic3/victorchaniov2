import React, { useRef, useEffect } from "react";
import debounce from "./utils/debounce";
import { randomFromRange, distance } from "./utils/canvasHelpers";
import { resolveCollision } from "./utils/collisionHelpers";

const TWO_PI = Math.PI * 2;
const COLOURS = ["#6F4FFF", "#1C5DE8", "#2BD9FF", "#1CE8A3", "#1FFF3C"];
let PARTICLE_COUNT = 100;

interface BackgroundProps {}

//Testing out object collision logic
//Pretty laggy
const Background: React.FC<BackgroundProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  //Mouse coordinates
  let mouse: { x: number; y: number } = {
    x: -1000,
    y: -1000,
  };

  useEffect(() => {
    //Hide body overflow
    const body = document.getElementsByTagName("body");
    const bodyStyle = body.item(0)!.style;
    bodyStyle.overflow = "hidden";

    //Set the canvas dimensions
    const canvas = canvasRef.current!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //Set particle count to one per 100x100 box
    PARTICLE_COUNT = ~~(canvas.width / 100) * ~~(canvas.height / 100);
    window.addEventListener(
      "resize",
      debounce(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }, 500)
    );

    //Set mouse coordinates
    window.addEventListener("mousemove", event => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    });

    //Set onclick to do something
    window.addEventListener("click", () => {
      //Do something here
    });

    //Get context
    const ctx = canvas.getContext("2d")!;

    //Define particle class
    type ParticleProps = {
      x: number;
      y: number;
      radius: number;
      color: string;
    };
    class Particle {
      public x: number;
      public y: number;
      public velocity: {
        x: number;
        y: number;
      };
      public radius: number;
      public mass: number;
      public color: string;
      private opacity: number;
      constructor(inputs: ParticleProps) {
        this.x = inputs.x;
        this.y = inputs.y;
        this.velocity = {
          x: (Math.random() - 0.5) * 1,
          y: (Math.random() - 0.5) * 1,
        };
        this.radius = inputs.radius;
        this.mass = TWO_PI * inputs.radius ** 2;
        this.color = inputs.color;
        this.opacity = 0.1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, TWO_PI);
        // ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.fill();
        // ctx.restore();
        // ctx.strokeStyle = this.color;
        // ctx.stroke();
        ctx.closePath();
      }
      update() {
        this.draw();

        for (let i = 0; i < particles.length; i++) {
          if (this === particles[i]) continue;
          const other = particles[i];
          if (
            distance(this.x, this.y, other.x, other.y) <
            this.radius + other.radius
          ) {
            resolveCollision(this, other);
            //If it collides
          }
        }

        //Handle boundary collision
        if (this.x <= this.radius || this.x >= canvas.width - this.radius) {
          this.velocity.x = -this.velocity.x;
        }
        if (this.y <= this.radius || this.y >= canvas.height - this.radius) {
          this.velocity.y = -this.velocity.y;
        }

        //Handle mouseover
        if (
          distance(mouse.x, mouse.y, this.x, this.y) < 120 &&
          this.opacity < 0.8
        ) {
          this.opacity += 0.04;
        } else if (this.opacity > 0.1) {
          this.opacity -= 0.04;
          this.opacity = Math.max(0.1, this.opacity);
        }

        //Move the particle
        this.x += this.velocity.x;
        this.y += this.velocity.y;
      }
    }
    //Generate Random particle properties
    const randomParticleProps = () => {
      const radius = 15 || randomFromRange(10, 30);
      return {
        x: Math.random() * (canvas.width - radius * 2) + radius,
        y: Math.random() * (canvas.height - radius * 2) + radius,
        radius,
        color: COLOURS[(Math.random() * COLOURS.length) >> 0],
      };
    };

    // Implementation
    let MAX_TRIES = 100;
    let tryCount = 0;
    let particles: Particle[];
    function init() {
      //N^3 Space almost (or worse) :(
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        if (tryCount > MAX_TRIES) break;
        let { x, y, radius, color } = randomParticleProps();
        if (i !== 0) {
          for (let j = 0; j < particles.length; j++) {
            if (tryCount > MAX_TRIES) break;

            const old = particles[j];
            if (distance(x, y, old.x, old.y) < radius + old.radius) {
              //Circle overlaps with selected old particle
              const newResults = randomParticleProps();
              x = newResults.x;
              y = newResults.y;
              radius = newResults.radius;
              color = newResults.color;

              //Reset comparison for all existing particles
              j = -1;
            }
          }
        }
        particles.push(new Particle({ x, y, radius, color }));
      }
      console.log(particles);
    }

    // Animation Loop
    function animate() {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillText("NOT BHED", mouse.x, mouse.y);

      particles.forEach(p => p.update());
    }

    init();
    animate();
  }, []);

  return (
    <>
      <canvas id="thing" ref={canvasRef} />
    </>
  );
};
export default Background;
