import { Entity, GraphNode, registerScript, ScriptType, Vec3 } from 'playcanvas';
import Proton from 'proton-engine';

export class GameController extends ScriptType {
  public scratchCard: Entity;

  private timer: null | ReturnType<typeof setTimeout>;

  private proton;
  private emitter;
  private timerFrameHandler: number;

  private currentCard: GraphNode;
  private canvas: HTMLCanvasElement;
  private canvasProton: HTMLCanvasElement;

  public initialize() {
    this.addTouchListeners();

    this.currentCard = this.scratchCard.clone();
    this.app.root.addChild(this.currentCard);
    this.currentCard.setPosition(new Vec3(0, 0, 1));
    this.currentCard.enabled = true;

    const bodyElement = document.getElementsByTagName('body')[0];

    this.canvas = document.getElementById('application-canvas') as HTMLCanvasElement;
    this.canvasProton = document.createElement('canvas');
    this.canvasProton.width = this.canvas.width;
    this.canvasProton.height = this.canvas.height;
    this.canvasProton.style.pointerEvents = 'none';
    this.canvasProton.style.zIndex = '1';
    this.canvasProton.style.marginTop = this.canvas.style.marginTop;
    this.canvasProton.style.position = 'absolute';

    bodyElement.appendChild(this.canvasProton);

    this.generateCanvas();
  }

  private generateCanvas(): void {
    this.createProton();
  }

  private createProton() {
    this.proton = new Proton();
    this.emitter = new Proton.Emitter(null);
    this.emitter.rate = new Proton.Rate(new Proton.Span(10, 20, null), new Proton.Span(0.1, 0.25, null));
    this.emitter.addInitialize(new Proton.Mass(1, null, null));
    this.emitter.addInitialize(new Proton.Radius(1, 2, null));
    this.emitter.addInitialize(new Proton.Life(1, 2, null));
    this.emitter.addInitialize(
      new Proton.Velocity(new Proton.Span(1, 3, null), new Proton.Span(0, 360, null), 'polar'),
      null,
    );
    this.emitter.addBehaviour(new Proton.RandomDrift(30, 30, 0.05, null, null));
    this.emitter.addBehaviour(new Proton.Color('ff0000', 'black', Infinity, Proton.easeOutQuart.bind(null)));
    this.emitter.addBehaviour(new Proton.Scale(1, 0.7, null, null));
    this.proton.addEmitter(this.emitter);

    const renderer = new Proton.CanvasRenderer(this.canvasProton);
    this.proton.addRenderer(renderer);
    this.timerFrameHandler = requestAnimationFrame(this.frameHandler.bind(this));
  }

  private frameHandler() {
    this.proton.update();
    this.timerFrameHandler = requestAnimationFrame(this.frameHandler.bind(this));
  }

  private addTouchListeners() {
    this.app.on('click', this.onClick.bind(this));
  }

  private onClick(x: number, y: number, entity: Entity, eventType: string) {
    console.log(eventType);

    if (entity.name === this.currentCard.name) {
      this.scratchingEffect(x, y);

      console.log(x, y, entity, this.currentCard);
    }
  }

  private scratchingEffect(x: number, y: number) {
    clearTimeout(this.timer);

    if (!this.timer) {
      this.emitter.emit();
    }

    this.timer = window.setTimeout(() => {
      this.emitter.stop();
      this.timer = null;
    }, 50);

    //this.brush.update(x, y);
    this.emitter.p.x = x;
    this.emitter.p.y = y;
  }
}

registerScript(GameController, 'GameController');

GameController.attributes.add('scratchCard', { type: 'entity' });
