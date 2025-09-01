import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
  OnDestroy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
  query,
  stagger,
} from '@angular/animations';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('float', [
      state('*', style({ transform: 'translateY(0px)' })),
      transition('* => *', [
        animate(
          '3s ease-in-out',
          keyframes([
            style({ transform: 'translateY(0px)', offset: 0 }),
            style({ transform: 'translateY(-20px)', offset: 0.5 }),
            style({ transform: 'translateY(0px)', offset: 1 }),
          ])
        ),
      ]),
    ]),

    trigger('staggerCards', [
      transition('* => *', [
        query(
          '.experience-card',
          [
            style({ opacity: 0, transform: 'translateY(50px) scale(0.8)' }),
            stagger(200, [
              animate(
                '0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                style({ opacity: 1, transform: 'translateY(0px) scale(1)' })
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),

    trigger('glitchText', [
      state('normal', style({ transform: 'translate(0)' })),
      state('glitch', style({ transform: 'translate(2px, 1px)' })),
      transition('normal => glitch', animate('0.1s')),
      transition('glitch => normal', animate('0.1s')),
    ]),

    trigger('morphShape', [
      state('*', style({})),
      transition('* => *', [animate('2s ease-in-out')]),
    ]),

    trigger('buttonPulse', [
      state('idle', style({ transform: 'scale(1)' })),
      state('hover', style({ transform: 'scale(1.05)' })),
      transition(
        'idle <=> hover',
        animate('0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)')
      ),
    ]),
  ],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('heroCanvas', { static: false })
  heroCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('particleCanvas', { static: false })
  particleCanvas!: ElementRef<HTMLCanvasElement>;

  floatState = 0;
  glitchState = 'normal';
  buttonStates: { [key: string]: string } = {};

  particles: any[] = [];
  mouseX = 0;
  mouseY = 0;
  animationId: number = 0;

  typewriterText = "I'm a Software Engineer";
  displayText = '';
  typewriterIndex = 0;

  isBrowser: boolean;

  skillIcons = [
    { name: 'HTML5', icon: 'html-5.png', color: '#e34c26' },
    { name: 'CSS3', icon: 'css3.png', color: '#1572b6' },
    { name: 'JavaScript', icon: 'javascript.png', color: '#f7df1e' },
    { name: 'TypeScript', icon: 'typescript.png', color: '#3178c6' },
    { name: 'Angular', icon: 'angularjs.png', color: '#dd0031' },
    { name: 'Node.js', icon: 'nodejs.png', color: '#339933' },
    { name: 'Express', icon: 'express.png', color: '#000000' },
    { name: 'PostgreSQL', icon: 'postgresql.png', color: '#336791' },
  ];

  experiences = [
    {
      id: 'exp1',
      company: 'Expintek',
      role: 'Frontend Developer',
      period: '2022 - 2023',
      description:
        'Worked as a frontend developer at Expintek, building responsive web apps...',
      logo: 'expintek.png',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      id: 'exp2',
      company: 'CharisBI',
      role: 'Fullstack Developer',
      period: '2023 - 2024',
      description:
        'Worked as a fullstack developer at CharisBI, building and maintaining web apps...',
      logo: 'charisbi.png',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
  ];

  projects = [
    {
      name: 'AbiJotters Ecommerce',
      description: 'An ecommerce website for AbiJotters...',
      image: 'app-1.png',
      tech: ['Angular', 'Node.js', 'PostgreSQL', 'Stripe'],
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      name: 'Qwikbuy Ecommerce Template',
      description: 'An ecommerce template showcasing a modern design...',
      image: 'app-2.png',
      tech: ['Angular', 'SCSS', 'TypeScript'],
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.startTypewriter();
    this.initializeButtonStates();
    this.startFloatingAnimation();
    this.startGlitchEffect();
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.initializeCanvas();
      this.createParticleSystem();
      this.animate();
      this.addEventListeners();
    }
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  // ================= Animations & Effects =================

  startTypewriter() {
    if (this.typewriterIndex < this.typewriterText.length) {
      this.displayText += this.typewriterText.charAt(this.typewriterIndex);
      this.typewriterIndex++;
      setTimeout(() => this.startTypewriter(), 100);
    }
  }

  initializeButtonStates() {
    this.experiences.forEach((exp) => (this.buttonStates[exp.id] = 'idle'));
  }

  startFloatingAnimation() {
    setInterval(() => {
      this.floatState++;
    }, 3000);
  }

  startGlitchEffect() {
    setInterval(() => {
      this.glitchState = this.glitchState === 'normal' ? 'glitch' : 'normal';
    }, 5000);
  }

  // ================= Canvas & Particles =================

  initializeCanvas() {
    if (!this.isBrowser) return;
    const canvas = this.heroCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height
    );
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.font = 'bold 120px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Welcome', canvas.width / 2, canvas.height / 2);
  }

  createParticleSystem() {
    if (!this.isBrowser) return;
    const canvas = this.particleCanvas.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    this.particles = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      radius: Math.random() * 3 + 1,
    }));
  }

  animate() {
    if (!this.isBrowser) return;
    const canvas = this.particleCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#764ba2';
        ctx.fill();
      });

      this.animationId = requestAnimationFrame(draw);
    };

    draw();
  }

  addEventListeners() {
    if (!this.isBrowser) return;
    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    window.addEventListener('resize', () => {
      this.initializeCanvas();
      this.createParticleSystem();
    });
  }

  // ================= Hover Animations =================

  onButtonHover(id: string, state: string = 'hover') {
    this.buttonStates[id] = state;
  }

  onButtonLeave(id: string, state: string = 'idle') {
    this.buttonStates[id] = state;
  }

  scrollToSection(sectionId: string) {
    if (this.isBrowser) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }
  openProject(project: any) {
    if (this.isBrowser && project.link) {
      window.open(project.link, '_blank');
    }
  }

  onSkillHover(skill: any) {
    this.buttonStates[skill.name] = 'hover';
  }

  onSkillLeave(skill: any) {
    this.buttonStates[skill.name] = 'idle';
  }
}
