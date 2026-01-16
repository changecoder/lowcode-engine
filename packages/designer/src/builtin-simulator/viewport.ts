import { ref } from 'vue';
import { IViewport, AutoFit } from '../simulator';
import { Point } from '../designer';

export default class Viewport implements IViewport {
  private viewportElement?: HTMLElement;
  private _rect = ref<DOMRect>();
  private _bounds?: DOMRect;
  private _scale = ref<number>(1);
  private _contentWidth = ref<number | AutoFit>('100%');
  private _contentHeight = ref<number | AutoFit>('100%');
  private _scrollX = ref<number>(0);
  private _scrollY = ref<number>(0);
  private _scrolling = ref<boolean>(false);

  get rect() {
    return this._rect.value;
  }

  get bounds(): DOMRect {
    if (this._bounds) {
      return this._bounds;
    }
    this._bounds = this.viewportElement!.getBoundingClientRect();
    requestAnimationFrame(() => {
      this._bounds = undefined;
    });
    return this._bounds;
  }

  get contentBounds(): DOMRect {
    const { bounds, scale } = this;
    return new DOMRect(0, 0, bounds.width / scale, bounds.height / scale);
  }

  get height(): number {
    if (!this.rect) {
      return 600;
    }
    return this.rect.height;
  }

  get scrollX() {
    return this._scrollX.value;
  }

  get scrollY() {
    return this._scrollY.value;
  }

  get scale(): number {
    return this._scale.value;
  }

  get contentHeight(): number | AutoFit {
    return this._contentHeight.value;
  }

  get contentWidth(): number | AutoFit {
    return this._contentWidth.value;
  }

  get width(): number {
    if (!this.rect) {
      return 1000;
    }
    return this.rect.width;
  }

  get scrolling(): boolean {
    return this._scrolling.value;
  }

  set width(newWidth: number) {
    this._contentWidth.value = newWidth / this.scale;
    if (this.viewportElement) {
      this.viewportElement.style.width = `${newWidth}px`;
      this.touch();
    }
  }

  set contentWidth(val: number | AutoFit) {
    this._contentWidth.value = val;
  }

  set contentHeight(newContentHeight: number | AutoFit) {
    this._contentHeight.value = newContentHeight;
  }

  set height(newHeight: number) {
    this._contentHeight.value = newHeight / this.scale;
    if (this.viewportElement) {
      this.viewportElement.style.height = `${newHeight}px`;
      this.touch();
    }
  }

  mount(viewportElement: HTMLElement | null) {
    if (!viewportElement || this.viewportElement === viewportElement) {
      return;
    }
    this.viewportElement = viewportElement;
    this.touch();
  }

  touch() {
    if (this.viewportElement) {
      this._rect.value = this.bounds;
    }
  }

  toGlobalPoint(point: Point): Point {
    if (!this.viewportElement) {
      return point;
    }

    const rect = this.bounds;
    return {
      clientX: point.clientX * this.scale + rect.left,
      clientY: point.clientY * this.scale + rect.top,
    };
  }

  toLocalPoint(point: Point): Point {
    if (!this.viewportElement) {
      return point;
    }

    const rect = this.bounds;
    return {
      clientX: (point.clientX - rect.left) / this.scale,
      clientY: (point.clientY - rect.top) / this.scale,
    };
  }
}
