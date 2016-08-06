/// <reference path="Xrm.oData.FilterTypes.ts" />


namespace Xrm.oData {
    export class FilterInfo {
        constructor(init: any) {
            for (var prop in this) {
                if (this.hasOwnProperty(prop)) {
                    this[prop] = init[prop];
                }
            }
        }

        public filterType: Xrm.oData.FilterTypes = Xrm.oData.FilterTypes.And;

        public filterExpressions: Array<string> = [];

        public filters: Array<Xrm.oData.FilterInfo> = [];

        public toString(): string {
            /// <summary>Возвращает строку фильтров в формате oData.</summary>

            var result = '';
            var concatWord = '';
            switch (this.filterType) {
                case Xrm.oData.FilterTypes.And:
                    concatWord = 'and';
                    break;
                case Xrm.oData.FilterTypes.Or:
                    concatWord = 'or';
                    break;
            }

            for (var i = 0; i < this.filterExpressions.length; i++) {
                var expression = this.filterExpressions[i];
                if (i > 0) {
                    result += ' ' + concatWord + ' ';
                }

                if (expression[0] !== '(') {
                    result += '(';
                }

                result += expression;

                if (expression[expression.length - 1] !== ')') {
                    result += ')';
                }
            }

            if ((result != '') && (this.filters && this.filters.length > 0)) {
                result += ' ' + concatWord + ' ';

                for (var i = 0; i < this.filters.length; i++) {
                    var filter = this.filters[i];
                    if (i > 0) {
                        result += ' ' + concatWord + ' ';
                    }

                    var isContainMoreThanOneExpressions: boolean = filter.filterExpressions && (filter.filterExpressions.length > 1);
                    var isContainFilters: boolean = filter.filters && (filter.filters.length > 0);

                    if (isContainMoreThanOneExpressions || isContainFilters) {
                        result += '(' + filter.toString() + ')';
                    } else {
                        result += filter.toString();
                    }
                }
            }

            return result;
        }
    }
}