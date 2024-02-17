export class Item {
    code!: string;
    name!: string;
    into!: string[]
    consumed!: boolean;
    requiredChampion!: string
    requiredAlly!: string
    maps!: { [map: number]: boolean}
    inStore!: boolean;
}