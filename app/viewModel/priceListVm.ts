export class priceListVm
{
    totalCoast:number;

    adultNumber:number;
    adultCoast:number;

    adultBusShoubraNumber:number;
    adultBusShoubraCoast:number;

    adultBusMerilandNumber:number;
    adultBusMerilandCoast:number;

    childNumber:number;
    childCoast:number;

    childFoodNumber:number;
    childFoodCoast:number;

    childBedNumber:number;
    childbedCoast:number;

    childBusShoubraNumber:number;
    childBusShoubraCoast:number;

    childBusMerilandNumber:number;
    childBusMerilandCoast:number;

    constructor() {
        this.totalCoast=0;
        this.adultNumber=0;
        this.adultCoast=0;
        this.adultBusShoubraNumber=0;
        this.adultBusShoubraCoast=0;
        this.adultBusMerilandNumber=0;
        this.adultBusMerilandCoast=0;
        this.childNumber=0;
        this.childCoast=0;
        this.childFoodNumber=0;
        this.childFoodCoast=0;
        this.childBedNumber=0;
        this.childbedCoast=0;
        this.childBusShoubraNumber=0;
        this.childBusShoubraCoast=0;
        this.childBusMerilandNumber=0;
        this.childBusMerilandCoast=0;
    }
}

export enum acceptPrice {
  undefined,
  showPrice,
  readPrice,
  accepted
}