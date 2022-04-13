import { Entity, EVENT_TOUCHEND, EVENT_TOUCHSTART, registerScript, ScriptType } from 'playcanvas';

import Proton from 'proton-engine';

export class GameController extends ScriptType {
  public scratchCard: Entity;

  private proton: Proton;
  private emitter: Proton.FollowEmitter;
  private timerFrameHandler: number;

  public initialize() {
    this.generateCanvas();

    this.addTouchListeners();
  }

  private generateCanvas(): void {
    this.createProton();
  }

  private createProton() {
    this.proton = new Proton();
    this.emitter = new Proton.Emitter();

    this.emitter.rate = new Proton.Rate(new Proton.Span(10, 20), new Proton.Span(0.1, 0.25));
    this.emitter.addInitialize(new Proton.Mass(1));
    this.emitter.addInitialize(new Proton.Radius(1, 2));
    this.emitter.addInitialize(new Proton.Life(1, 2));
    this.emitter.addInitialize(new Proton.V(new Proton.Span(1, 3), new Proton.Span(0, 360), 'polar'));
    this.emitter.addBehaviour(new Proton.RandomDrift(30, 30, 0.05));
    this.emitter.addBehaviour(new Proton.Color('ff0000', 'black', Infinity, Proton.easeOutQuart));
    this.emitter.addBehaviour(new Proton.Scale(1, 0.7));

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
    this.scratchCard.element.on(EVENT_TOUCHSTART, this.onUserPressDown.bind(this));
    this.scratchCard.element.on(EVENT_TOUCHEND, this.onUserPressUp.bind(this));
  }

  private onUserPressDown() {
    return;
  }

  private onUserPressUp() {
    return;
  }
}

registerScript(GameController, 'GameController');

GameController.attributes.add('scratchCard', { type: 'entity' });
