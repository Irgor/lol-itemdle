import { Component, OnInit } from '@angular/core';
import { ItemsService } from 'src/app/services/items.service';
import { Item } from 'src/app/shared/models/item.model';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  items: any = {};
  usableItems: any = {}
  buildItens: Item[] = [];
  finalItems: Item[] = [];

  layers: number[] = [];
  currentLayer = 0;

  selecteds: string[] = []

  maxLayers = 10;
  end = false;

  intoBlackList = ['3005', '3047', '3117', '3006', '3009', '3020', '3111', '3158'];

  relativesHistory: string[][] = [];

  startItem!: any;
  finalItem!: any;

  constructor(
    private itemService: ItemsService
  ) { }

  ngOnInit(): void {
    this.itemService.getItens().subscribe(res => {
      this.items = res.data;

      const keys = Object.keys(this.items);
      for (let key of keys) {
        const item: Item = this.items[key];
        item.code = key;

        if (item && item.inStore != false && !!item.maps[11] && !item.requiredAlly && !item.requiredChampion && item.consumed != true) {
          this.usableItems[key] = item;
        }
      }

      const usableKeys = Object.keys(this.usableItems);
      for (let key of usableKeys) {
        const item = this.usableItems[key];
        item.code = key;
        const intos = item.into;

        if (intos && !!intos.length) {
          const cleanedIntos = this.cleanIntons(intos);

          !!cleanedIntos.length ? this.buildItens.push(item) : this.finalItems.push(item);
        }
      }

      this.initItems();
    })
  }

  initItems() {
    const startItemIndex = Math.floor(Math.random() * this.buildItens.length);
    this.startItem = this.buildItens[startItemIndex];
    this.selecteds.push(this.startItem.code + '0');

    const finalItemIndex = Math.floor(Math.random() * this.finalItems.length);
    this.finalItem = this.finalItems[finalItemIndex];
  }

  cleanIntons(intos: string[]): string[] {
    return intos.filter(into => into[0] != '7' && into.substring(0, 3) != '227' && !this.intoBlackList.includes(into));
  }

  removeUnusables(items: string[]) {
    let result = []
    for (let item of items) {
      const hasItem = !!this.usableItems[item];
      if (hasItem) {
        result.push(item);
      }
    }

    return result;
  }

  getItemImage(item: any) {
    return this.itemService.imageURL + item?.image?.full;
  }

  winEffect() {
    alert('VOCE VENCEU')
  }

  loseEffect() {
    alert('VOCE PERDEU')
  }

  checkWin(code: string): boolean {
    if (code == this.finalItem.code) {
      this.winEffect();
      this.end = true;
      return true;
    }

    return false;
  }

  checkEnds(item: any): boolean {
    if (this.checkWin(item.code)) {
      return true;
    }

    if (this.layers.length == this.maxLayers) {
      this.end = true;
      this.loseEffect();
      return true;
    }

    return false;
  }

  getRelatives(item: any, isFromLayer = false) {
    this.layers.push(1);
    this.layers = new Array(this.layers.length).fill(0).map((_, i) => i + 1);
    this.currentLayer = this.layers.length;

    this.selecteds.push(item.code + (this.currentLayer - 1));

    if (isFromLayer) {
      this.createLine();
    }

    const result = this.checkEnds(item);
    if (result) {
      return;
    }

    let relatives = [];
    let into: string[] = [];
    if (item.into && item.into.length) {
      into = [...item.into];
    }

    const keys = Object.keys(this.usableItems);
    for (let key of keys) {
      const itemIntos = this.usableItems[key].into;
      if (itemIntos && itemIntos.length && itemIntos.includes(item.code)) {
        into.push(key);
      }
    }

    relatives = Array.from(new Set([...into]));
    relatives = this.removeUnusables(relatives);
    this.relativesHistory.push(relatives);
  }

  createLine() {
    const lineStartId = this.selecteds[this.selecteds.length - 2];
    const lineEndId = this.selecteds[this.selecteds.length - 1];

    const lineStart = document.getElementById(lineStartId);
    const lineEnd = document.getElementById(lineEndId);

    const container = document.getElementById('lines-holder');

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');;

    const startData = lineStart?.getBoundingClientRect();
    const endData = lineEnd?.getBoundingClientRect();

    line.setAttribute('x1', ((startData?.left ?? 0) + 25) + '');
    line.setAttribute('y1', ((startData?.top ?? 0) + 25) + '');

    line.setAttribute('x2', ((endData?.left ?? 0) + 25) + '');
    line.setAttribute('y2', ((endData?.top ?? 0) + 25) + '');

    line.setAttribute("stroke", "purple")
    
    line.setAttribute("stroke-width", "2px")

    line.classList.add('line');

    container?.appendChild(line);
  }

  getItemsFromRelatives(index: number) {
    const returnItems = [];

    for (let relative of this.relativesHistory[index]) {
      returnItems.push(this.usableItems[relative]);
    }

    return returnItems;
  }

  isCurrentLayer(layer: number) {
    return this.layers[this.layers.length - 1] == layer
  }

}
