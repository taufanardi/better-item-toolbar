import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { ItemToolbarService } from '../item-toolbar.service';
import { ItemDropdownController } from '../item-dropdown/item-dropdown-controller';
import { ItemOverlayBuilderConfig } from '../item-dropdown/item-dropdown-overlay-builder';
import { DOWN_ARROW, SPACE, UP_ARROW } from '@angular/cdk/keycodes';

@Component({
  selector: 'tfaster-toolbar-item',
  templateUrl: './toolbar-item.component.html',
  styleUrls: ['./toolbar-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarItemComponent<T> implements OnInit {

  @ViewChild(CdkOverlayOrigin, {static: true})
  private _itemDropdownOrigin: CdkOverlayOrigin;

  @Input()
  public itemTemplate: TemplateRef<any>;

  @Input()
  public dropdownTemplate: TemplateRef<any>;

  @Input()
  public dropdownOverlayConfig: ItemOverlayBuilderConfig;

  @Input()
  public itemData: T;

  @Output()
  public removeClick = new EventEmitter<void>();

  public itemTemplateContext: any;

  private _itemDropdownCtrl: ItemDropdownController<T>;

  constructor(private _itemToolbarService: ItemToolbarService<T>) {
  }

  ngOnInit() {
    if (this._hasDropdown) {
      this._itemDropdownCtrl = this._itemToolbarService
        .overlayBuilder()
        .withConfig(this.dropdownOverlayConfig)
        .buildAndConnect(this._itemDropdownOrigin, this.dropdownTemplate);
      this.itemTemplateContext = {
        $implicit: this.itemData,
        dropdownController: this._itemDropdownCtrl,
        removeClick: () => {
          this._itemDropdownCtrl.close();
          this.removeClick.emit();
        }
      };
      if (this.dropdownOverlayConfig.openOnCreate) {
        this._itemDropdownCtrl.open();
      }
    } else {
      this.itemTemplateContext = {
        $implicit: this.itemData,
        removeClick: () => {
          this.removeClick.emit();
        }
      };
    }
  }

  onKeydown(event: KeyboardEvent): void {
    switch (event.keyCode) {
      case SPACE:
        this._itemDropdownCtrl.toggle(this.itemData);
        break;
      case UP_ARROW:
        this._itemDropdownCtrl.close();
        break;
      case DOWN_ARROW:
        this._itemDropdownCtrl.open(this.itemData);
        break;
    }
  }

  private get _hasDropdown(): boolean {
    return !!this.dropdownTemplate;
  }

}