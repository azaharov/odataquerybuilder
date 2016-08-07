var Xrm;
(function (Xrm) {
    var oData;
    (function (oData) {
        (function (FilterTypes) {
            FilterTypes[FilterTypes["And"] = 0] = "And";
            FilterTypes[FilterTypes["Or"] = 1] = "Or";
        })(oData.FilterTypes || (oData.FilterTypes = {}));
        var FilterTypes = oData.FilterTypes;
    })(oData = Xrm.oData || (Xrm.oData = {}));
})(Xrm || (Xrm = {}));
/// <reference path="Xrm.oData.FilterTypes.ts" />
var Xrm;
(function (Xrm) {
    var oData;
    (function (oData) {
        var FilterInfo = (function () {
            function FilterInfo(init) {
                this.filterType = Xrm.oData.FilterTypes.And;
                this.filterExpressions = [];
                this.filters = [];
                for (var prop in this) {
                    if (this.hasOwnProperty(prop)) {
                        this[prop] = init[prop];
                    }
                }
            }
            FilterInfo.prototype.toString = function () {
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
                        var isContainMoreThanOneExpressions = filter.filterExpressions && (filter.filterExpressions.length > 1);
                        var isContainFilters = filter.filters && (filter.filters.length > 0);
                        if (isContainMoreThanOneExpressions || isContainFilters) {
                            result += '(' + filter.toString() + ')';
                        }
                        else {
                            result += filter.toString();
                        }
                    }
                }
                return result;
            };
            return FilterInfo;
        })();
        oData.FilterInfo = FilterInfo;
    })(oData = Xrm.oData || (Xrm.oData = {}));
})(Xrm || (Xrm = {}));
var Xrm;
(function (Xrm) {
    var oData;
    (function (oData) {
        (function (OrderTypes) {
            OrderTypes[OrderTypes["Asc"] = 0] = "Asc";
            OrderTypes[OrderTypes["Desc"] = 1] = "Desc";
        })(oData.OrderTypes || (oData.OrderTypes = {}));
        var OrderTypes = oData.OrderTypes;
    })(oData = Xrm.oData || (Xrm.oData = {}));
})(Xrm || (Xrm = {}));
/// <reference path="Xrm.oData.OrderTypes.ts" />
var Xrm;
(function (Xrm) {
    var oData;
    (function (oData) {
        var OrderColumn = (function () {
            function OrderColumn(init) {
                this.column = '';
                this.order = Xrm.oData.OrderTypes.Asc;
                for (var prop in this) {
                    if (this.hasOwnProperty(prop)) {
                        this[prop] = init[prop];
                    }
                }
            }
            return OrderColumn;
        })();
        oData.OrderColumn = OrderColumn;
    })(oData = Xrm.oData || (Xrm.oData = {}));
})(Xrm || (Xrm = {}));
/// <reference path="Xrm.oData.FilterInfo.ts" />
/// <reference path="Xrm.oData.OrderColumn.ts" />
var Xrm;
(function (Xrm) {
    var oData;
    (function (oData) {
        var QueryBuilder = (function () {
            function QueryBuilder(_url) {
                /// <summary>Создает новый экземпляр объекта.</summary>
                /// <param name="_url" type="string">URL к сервису.</param>
                this._url = _url;
                this._entityName = '';
                this._columns = [];
                this._expand = [];
                this._orders = [];
                this._skip = 0;
                this._top = 0;
            }
            QueryBuilder.prototype.setEntity = function (entityName) {
                /// <summary>Задать имя сущности.</summary>
                /// <param name="entityName" type="string">Имя сущности.</param>
                this._entityName = entityName;
                return this;
            };
            QueryBuilder.prototype.setColumns = function (columns) {
                /// <summary>Задать поля для выборки.</summary>
                /// <param name="cols" type="string">Названия полей, перечисленные через запятую.</param>
                if (columns.length > 0) {
                    this._columns = columns.split(',');
                }
                return this;
            };
            QueryBuilder.prototype.setExpand = function (expand) {
                /// <summary>Задать связанные сущности.</summary>
                /// <param name="expand" type="string">Названия сущностей, перечисленные через запятую.</param>
                if (expand.length > 0) {
                    this._expand = expand.split(',');
                }
                return this;
            };
            QueryBuilder.prototype.setFilters = function (filters) {
                /// <summary>Задать фильтры.</summary>
                /// <param name="filters" type="FilterInfo">Фильтры для выборки.</param>
                this._filters = filters;
                return this;
            };
            QueryBuilder.prototype.setOrders = function (orders) {
                /// <summary>Задать порядок сортировки. Берет первые 12 значений из массива.</summary>
                /// <param name="orders" type="Array<OrderColumn>">Порядок сортировки.</param>
                this._orders = orders.slice(0, 12);
                return this;
            };
            QueryBuilder.prototype.setSkip = function (skip) {
                /// <summary>Задать количество пропускаемых строк.</summary>
                /// <param name="skip" type="number">Количество пропускаемых строк.</param>
                this._skip = skip;
                return this;
            };
            QueryBuilder.prototype.setTop = function (top) {
                /// <summary>Задать количество строк для выборки.</summary>
                /// <param name="top" type="number">Количество строк для выборки.</param>
                this._top = top;
                return this;
            };
            QueryBuilder.prototype.toString = function () {
                /// <summary>Возвращает строку запроса из полученных данных.</summary>
                var urlPart = this.getQueryUrlPart();
                var queryFiltersPart = this.getQueryFiltersPart();
                var result = urlPart + ((queryFiltersPart !== '') ? '?' + queryFiltersPart : queryFiltersPart);
                return result;
            };
            QueryBuilder.prototype.getQueryUrlPart = function () {
                /// <summary>Генерирует и возвращает Url для запроса.</summary>
                if (!this._url || !this._entityName) {
                    throw new Error('Не задан URL или имя сущности.');
                }
                var url = this._url;
                url = url.concat(url[url.length - 1] == '/' ? '' : '/', this._entityName);
                return url;
            };
            QueryBuilder.prototype.getQueryFiltersPart = function () {
                /// <summary>Генерирует и возвращает фильтры для запроса в формате "ключ=значение".</summary>
                var result = '';
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
            };
            QueryBuilder.prototype.sendQuery = function (successCallback, errorCallback) {
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
            };
            QueryBuilder.prototype.concatRequestPart = function (request, part) {
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
            };
            return QueryBuilder;
        })();
        oData.QueryBuilder = QueryBuilder;
    })(oData = Xrm.oData || (Xrm.oData = {}));
})(Xrm || (Xrm = {}));
//# sourceMappingURL=odata.querybuilder.js.map