import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'particles',
  templateUrl: './particles.component.html',
  styleUrls: ['./particles.component.scss']
})
export class ParticlesComponent implements OnInit {

  particlesNumber = 1000;
  maxParticleSize = 3;
  particles: { left: string, top: string, size: string, move: string }[] = [];

  ngOnInit(): void {
    new Array(this.particlesNumber).fill({}).forEach(particle => {
      particle = {
        left: Math.floor(Math.random() * window.innerWidth - (2 * this.maxParticleSize)) + 'px',
        top: Math.floor(Math.random() * window.innerHeight - (2 * this.maxParticleSize)) + 'px',
        size: Math.floor(Math.random() * this.maxParticleSize) + 'px',
        move: 'animate' + (Math.floor(Math.random() * 60) + 1)
      }
      this.particles.push(particle);
    });
  }

}
