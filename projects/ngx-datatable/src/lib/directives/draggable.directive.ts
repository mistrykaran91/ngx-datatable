import {
  booleanAttribute,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DraggableDragEvent, TableColumnInternal } from '../types/internal.types';

/**
 * Draggable Directive for Angular2
 *
 * Inspiration:
 *   https://github.com/AngularClass/angular2-examples/blob/master/rx-draggable/directives/draggable.ts
 *   http://stackoverflow.com/questions/35662530/how-to-implement-drag-and-drop-in-angular2
 *
 */
@Directive({
  selector: '[draggable]',
  standalone: true
})
export class DraggableDirective implements OnDestroy, OnChanges {
  @Input() dragEventTarget: any;
  @Input() dragModel: TableColumnInternal;
  @Input({ transform: booleanAttribute }) dragX = true;
  @Input({ transform: booleanAttribute }) dragY = true;

  @Output() dragStart = new EventEmitter<DraggableDragEvent>();
  @Output() dragging = new EventEmitter<DraggableDragEvent>();
  @Output() dragEnd = new EventEmitter<DraggableDragEvent>();

  element = inject(ElementRef).nativeElement;
  isDragging = false;
  subscription: Subscription;

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.dragEventTarget &&
      changes.dragEventTarget.currentValue &&
      this.dragModel.dragging
    ) {
      this.onMousedown(changes.dragEventTarget.currentValue);
    }
  }

  ngOnDestroy(): void {
    this._destroySubscription();
  }

  onMouseup(event: MouseEvent): void {
    if (!this.isDragging) {
      return;
    }

    this.isDragging = false;
    this.element.classList.remove('dragging');

    if (this.subscription) {
      this._destroySubscription();
      this.dragEnd.emit({
        event,
        element: this.element,
        model: this.dragModel
      });
    }
  }

  onMousedown(event: MouseEvent): void {
    // we only want to drag the inner header text
    const isDragElm = (event.target as HTMLElement).classList.contains('draggable');

    if (isDragElm && (this.dragX || this.dragY)) {
      event.preventDefault();
      this.isDragging = true;

      const mouseDownPos = { x: event.clientX, y: event.clientY };

      const mouseup = fromEvent<MouseEvent>(document, 'mouseup');
      this.subscription = mouseup.subscribe(ev => this.onMouseup(ev));

      const mouseMoveSub = fromEvent<MouseEvent>(document, 'mousemove')
        .pipe(takeUntil(mouseup))
        .subscribe(ev => this.move(ev, mouseDownPos));

      this.subscription.add(mouseMoveSub);

      this.dragStart.emit({
        event,
        element: this.element,
        model: this.dragModel
      });
    }
  }

  move(event: MouseEvent, mouseDownPos: { x: number; y: number }): void {
    if (!this.isDragging) {
      return;
    }

    const x = event.clientX - mouseDownPos.x;
    const y = event.clientY - mouseDownPos.y;

    if (this.dragX) {
      this.element.style.left = `${x}px`;
    }
    if (this.dragY) {
      this.element.style.top = `${y}px`;
    }

    this.element.classList.add('dragging');

    this.dragging.emit({
      event,
      element: this.element,
      model: this.dragModel
    });
  }

  private _destroySubscription(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }
}
