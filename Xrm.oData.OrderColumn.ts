/// <reference path="Xrm.oData.OrderTypes.ts" />


namespace Xrm.oData {
    export class OrderColumn {
        constructor(init: any) {
            for (var prop in this) {
                if (this.hasOwnProperty(prop)) {
                    this[prop] = init[prop];
                }
            }
        }

        public column: string = '';

        public order: Xrm.oData.OrderTypes = Xrm.oData.OrderTypes.Asc;
    }
}