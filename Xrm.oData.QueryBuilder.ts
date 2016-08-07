/// <reference path="Xrm.oData.FilterInfo.ts" />
/// <reference path="Xrm.oData.OrderColumn.ts" />


namespace Xrm.oData {
    export class QueryBuilder {
        private _entityName: string = '';

        private _columns: Array<string> = [];

        private _expand: Array<string> = [];

        private _filters: Xrm.oData.FilterInfo;

        private _orders: Array<Xrm.oData.OrderColumn> = [];

        private _skip: number = 0;

        private _top: number = 0;

        constructor(private _url: string) {
            /// <summary>Создает новый экземпляр объекта.</summary>
            /// <param name="_url" type="string">URL к сервису.</param>

        }

        public setEntity(entityName: string): QueryBuilder {
            /// <summary>Задать имя сущности.</summary>
            /// <param name="entityName" type="string">Имя сущности.</param>
            
            this._entityName = entityName;

            return this;
        }

        public setColumns(columns: string): QueryBuilder {
            /// <summary>Задать поля для выборки.</summary>
            /// <param name="cols" type="string">Названия полей, перечисленные через запятую.</param>

            if (columns.length > 0) {
                this._columns = columns.split(',');
            }

            return this;
        }

        public setExpand(expand: string): QueryBuilder {
            /// <summary>Задать связанные сущности.</summary>
            /// <param name="expand" type="string">Названия сущностей, перечисленные через запятую.</param>

            if (expand.length > 0) {
                this._expand = expand.split(',');
            }

            return this;
        }

        public setFilters(filters: Xrm.oData.FilterInfo): QueryBuilder {
            /// <summary>Задать фильтры.</summary>
            /// <param name="filters" type="FilterInfo">Фильтры для выборки.</param>

            this._filters = filters;

            return this;
        }

        public setOrders(orders: Array<Xrm.oData.OrderColumn>): QueryBuilder {
            /// <summary>Задать порядок сортировки. Берет первые 12 значений из массива.</summary>
            /// <param name="orders" type="Array<OrderColumn>">Порядок сортировки.</param>

            this._orders = orders.slice(0, 12);

            return this;
        }

        public setSkip(skip: number): QueryBuilder {
            /// <summary>Задать количество пропускаемых строк.</summary>
            /// <param name="skip" type="number">Количество пропускаемых строк.</param>

            this._skip = skip;

            return this;
        }

        public setTop(top: number): QueryBuilder {
            /// <summary>Задать количество строк для выборки.</summary>
            /// <param name="top" type="number">Количество строк для выборки.</param>

            this._top = top;

            return this;
        }

        public toString(): string {
            /// <summary>Возвращает строку запроса из полученных данных.</summary>

            var urlPart: string = this.getQueryUrlPart(); 
            var queryFiltersPart: string = this.getQueryFiltersPart();

            var result: string = urlPart + ((queryFiltersPart !== '') ? '?' + queryFiltersPart : queryFiltersPart);
            return result;
        }

        private getQueryUrlPart(): string {
            /// <summary>Генерирует и возвращает Url для запроса.</summary>

            if (!this._url || !this._entityName) {
                throw new Error('Не задан URL или имя сущности.');
            }

            var url: string = this._url;
            url = url.concat(url[url.length - 1] == '/' ? '' : '/', this._entityName);
            return url;
        }

        private getQueryFiltersPart(): string {
            /// <summary>Генерирует и возвращает фильтры для запроса в формате "ключ=значение".</summary>

            var result: string = '';
            if (this._columns && (this._columns.length > 0)) {
                result = this.concatRequestPart(result, '$select=' + this._columns.join(','));
            }

            if (this._expand && (this._expand.length > 0)) {
                result = this.concatRequestPart(result, '$expand=' + this._expand.join(','));
            }

            if (this._filters) {
                result = this.concatRequestPart(result, '$filter=' + this._filters.toString());
            }

            if (this._orders && (this._orders.length > 0)) {
                result = this.concatRequestPart(result, '$orderby=');

                for (var i = 0; i < this._orders.length; i++) {
                    var order = this._orders[i];
                    result += order.column;

                    if (order.order == Xrm.oData.OrderTypes.Desc) {
                        result += ' desc';
                    }

                    if (i < (this._orders.length - 1)) {
                        result += ',';
                    }
                }
                
            }

            if (this._skip && (this._skip > 0)) {
                result = this.concatRequestPart(result, '$skip=' + this._skip);
            }

            if (this._top && (this._top > 0)) {
                result = this.concatRequestPart(result, '$top=' + this._top);
            }

            return result;
        }

        public sendQuery(successCallback, errorCallback): void {
            var req = new XMLHttpRequest();
            req.open("GET", this.toString(), true);
            req.setRequestHeader("Accept", "application/json");
            req.onreadystatechange = function () {
                var createAccountReq = this;
                if (createAccountReq.readyState == 4) {
                    createAccountReq.onreadystatechange = null;
                    if (createAccountReq.status == 200) {
                        if (successCallback) {
                            var data = JSON.parse(createAccountReq.responseText);
                            data = data.d || data;
                            successCallback(data);
                        }
                    }
                    else {
                        if (errorCallback) {
                            errorCallback(createAccountReq);
                        }
                    }
                }
            };
            req.send();
        }

        private concatRequestPart(request: string, part: string): string {
            /// <summary>Склеивает части запроса.</summary>
            /// <param name="request" type="string">Запрос.</param>
            /// <param name="part" type="string">Часть запроса для склеивания.</param>
            
            request = request || '';
            if (part) {
                if (request.length > 0) {
                    request = request.concat('&');
                }

                request = request.concat(part);
            }

            return request;
        }
    }
}