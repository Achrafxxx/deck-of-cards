/**
 *
 * https://github.com/daniel-lundin/dom-confetti
 *
 */

export class Confetti {

  angle = 90;
  decay = 0.77;
  spread = 270;
  startVelocity = 50;
  elementCount = 80;
  colors = [
    '#E68F17',
    '#FAB005',
    '#FA5252',
    '#E64980',
    '#BE4BDB',
    '#0B7285',
    '#15AABF',
    '#EE1233',
    '#40C057'
  ];
  random = Math.random;

  root: any;

  constructor(root: any, elementCount?: number) {
    this.root = root;
    if (elementCount) {
      this.elementCount = elementCount;
    }
  }

  start() {
    const elements = this.createElements(this.root, this.elementCount, this.colors);
    const fettis = elements.map((element) => ({
      element,
      physics: this.randomPhysics(this.angle, this.spread, this.startVelocity, this.random)
    }));
    this.animate(this.root, fettis, this.decay);
  }

  shape(element) {
    let list = [
      // Square
      function (e) {
        let size = Math.round((Math.random() + 0.5) * 10) + 'px';
        e.style.width = size;
        e.style.height = size;
        return e;
      },
      // Round
      function (e) {
        let size = Math.round((Math.random() + 0.5) * 10) + 'px';
        e.style.width = size;
        e.style.height = size;
        e.style['border-radius'] = '50%';
        return e;
      },
      // Triangle
      function (e) {
        let size = '' + Math.round((Math.random() + 0.5) * 10);
        let color = e.style['background-color'];
        e.style['background-color'] = 'transparent';

        e.style['border-bottom'] = size + 'px solid ' + color;
        e.style['border-left'] = +size / 2 + 'px solid transparent';
        e.style['border-right'] = +size / 2 + 'px solid transparent';
        e.style.height = 0;
        e.style.width = size;

        return e;
      }];

    return list[Math.floor(Math.random() * list.length)](element);
  }

  createElements(root, elementCount, colors) {
    return Array
      .from({length: elementCount})
      .map((_, index) => {
        const element = document.createElement('div');
        const color = colors[index % colors.length];
        element.style['background-color'] = color; // eslint-disable-line space-infix-ops
        element.style.position = 'fixed';
        root.appendChild(this.shape(element));

        return element;
      });
  }

  randomPhysics(angle, spread, startVelocity, random) {
    const radAngle = angle * (Math.PI / 180);
    const radSpread = spread * (Math.PI / 180);
    return {
      x: 0,
      y: 0,
      wobble: random() * 10,
      velocity: (startVelocity * 0.5) + (random() * startVelocity),
      angle2D: -radAngle + ((0.5 * radSpread) - (random() * radSpread)),
      angle3D: -(Math.PI / 4) + (random() * (Math.PI / 2)),
      tiltAngle: random() * Math.PI
    };
  }

  updateFetti(fetti, progress, decay) {
    fetti.physics.x += Math.cos(fetti.physics.angle2D) * fetti.physics.velocity;
    fetti.physics.y += Math.sin(fetti.physics.angle2D) * fetti.physics.velocity;
    fetti.physics.z += Math.sin(fetti.physics.angle3D) * fetti.physics.velocity;
    fetti.physics.wobble += 0.1;
    fetti.physics.velocity *= decay;
    fetti.physics.y += 3;
    fetti.physics.tiltAngle += 0.1;

    const {x, y, tiltAngle, wobble} = fetti.physics;
    const wobbleX = x + (10 * Math.cos(wobble));
    const wobbleY = y + (10 * Math.sin(wobble));
    const transform = `translate3d(${wobbleX}px, ${wobbleY}px, 0) rotate3d(1, 1, 1, ${tiltAngle}rad)`;

    fetti.element.style.transform = transform;
    fetti.element.style.opacity = 1 - progress;
  }

  animate(root, fettis, decay) {
    const totalTicks = 200;
    let tick = 0;

    let update = () => {
      fettis.forEach((fetti) => this.updateFetti(fetti, tick / totalTicks, decay));

      tick += 1;
      if (tick < totalTicks) {
        requestAnimationFrame(update);
      } else {
        fettis.forEach((fetti) => {
          if (fetti.element.parentNode === root) {
            return root.removeChild(fetti.element);
          }
        });
      }
    };

    requestAnimationFrame(update);
  }
}
