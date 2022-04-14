import {
  Entity,
  EVENT_MOUSEDOWN,
  EVENT_MOUSEMOVE,
  EVENT_MOUSEUP,
  EVENT_TOUCHEND,
  EVENT_TOUCHMOVE,
  EVENT_TOUCHSTART,
  Picker,
  registerScript,
  ScriptType,
} from 'playcanvas';

class MeshPicker extends ScriptType {
  private _picker: Picker;

  public initialize() {
    this.app.mouse.on(EVENT_MOUSEDOWN, this._mouseSelect.bind(this, 'start'));
    this.app.mouse.on(EVENT_MOUSEMOVE, this._mouseSelect.bind(this, 'move'));
    this.app.mouse.on(EVENT_MOUSEUP, this._mouseSelect.bind(this, 'stop'));

    if (this.app.touch) {
      this.app.touch.on(EVENT_TOUCHSTART, this._touchSelect.bind(this, 'start'));
      this.app.touch.on(EVENT_TOUCHMOVE, this._touchSelect.bind(this, 'move'));
      this.app.touch.on(EVENT_TOUCHEND, this._touchSelect.bind(this, 'stop'));
    }

    this._init();

    window.addEventListener('resize', this._reinit.bind(this));
  }

  private _init() {
    const { canvas } = this.app.graphicsDevice;

    this._picker = new Picker(this.app, canvas.clientWidth, canvas.clientHeight);
  }

  private _reinit() {
    const { canvas } = this.app.graphicsDevice;

    if (this._picker) {
      this._picker = new Picker(this.app, canvas.clientWidth, canvas.clientHeight);
    }
  }

  private _mouseSelect(eventType, event) {
    if (!this._picker) {
      return;
    }

    this._pick(event, eventType);
  }

  private _pick({ x, y }, eventType) {
    this._picker.prepare(this.entity.camera, this.app.scene);

    const selected = this._picker.getSelection(x, y);

    if (selected.length > 0) {
      let entity = selected[0].node;

      while (!(entity instanceof Entity)) {
        entity = entity.parent;
      }

      this.app.fire('click', x, y, entity, eventType);
    }
  }

  private _touchSelect(eventType, event) {
    if (!this._picker) {
      return;
    }

    if (event?.touches.length > 1) {
      return;
    }

    this._pick(event.touches[0] ? event.touches[0] : { x: 0, y: 0 }, eventType);

    event.event.preventDefault();
  }
}

registerScript(MeshPicker, 'MeshPicker');
