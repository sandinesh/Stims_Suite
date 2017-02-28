

/// NOTE TODO - bug where if pageSize 10 - jumpTo 5 causes wrong page - see code in initPagination to fix


    var global = { app_options: { prefix: "" , url_group: "" },  baseUrl: "/" };
    global.prefix = "Customer";


    var jsLookups = {"CountryID":{"1":"Australia","2":"United Kingdom","3":"USA","4":"India","5":"China","6":"Turkey"},"CustomerID":{"1":"Carson","2":"Jones","3":"Barry","4":"Bill","5":"Polly","6":"Trevor","7":"Ivan","8":"Larry","9":"Molly","10":"Mark"},"DealerID":{"1":"Australia","2":"Italy","3":"USA 1 (Except California)","4":"USA 2 (California)","5":"UK","6":"Germany","7":"Denmark","8":"Benelux"}}

    

$(document).ready(function () {
    _setup_sortable_tables();
    refresh_autofills();
    $('#jsfiddle-jump-btn').on('click',function(e){ 
        e.preventDefault(); 
        var $table = $('#Customer-table')
        var jump_itemid = $('#jsfiddle-jump-input').val();
        console.info('!!!jumping to item!!!',jump_itemid);
        $table.bootstrapTable('setActiveItem', {'CustomerID':jump_itemid});
        $table.data('jumpToRowOnce', jump_itemid);
        /// NOTE - workaround, but could also just trigger search or other approaches, as desired code in initPagination
        $table.bootstrapTable('jsfiddleRefreshPagination');
    });

});
    
/*

This jsfiddle has been provided as per a request by https://github.com/djhvscf 
in https://github.com/wenzhixin/bootstrap-table/issues/725

This js includes:
    1. my own version of bootstrap-table.js
    2. new js file called sortable-table-app.dev.js
    3. Some Parts of my general scripts.js file for this project

This is from an EARLY ALPHA project - it is rough, there are many comments, and it is not completed.
Some TODO notes done, some not, some comments detail different than was chosen - but most accurate.

I welcome any and all feedback as to improvements or suggestions, as i do hope to clean up this code 
and maybe even migrate certains changes into extensions or similar - if this project is green lit in 
its current form (asp.net mvc webapplication, as opposed to c# windows application)

Common comments include:
 CHANGED = changed code, optionally combined with NEW to show drastic changes or new additions
 NOTE = worth noting, at least at the time
 IMPORTANT = greater importance for whatever reason at whatever time
 ///// = ajax call or similar, nested so didnt just commented instead of deleted

Much of the code in sortable-table.dev.js relies on code in general scripts file, and i have tried to 
include all that was used in both files, but there is always a chance i missed some. 

I have REMOVED or COMMENTED out referances to most of my own ajax code, as that had dependencies of its own.


*/

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///                     source: bootstrap-table.dev.js - modified by dabros - 10/4/15                            ///
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/**
 * @author dabros 
 * @author zhixin wen <wenzhixin2010@gmail.com>
 * version: 1.6.x - modified by dabros
 * https://github.com/wenzhixin/bootstrap-table/
 */

!function ($) {

    'use strict';

    // TOOLS DEFINITION
    // ======================

    // it only does '%s', and return '' when arguments are undefined
    var sprintf = function (str) {
        var args = arguments,
            flag = true,
            i = 1;

        str = str.replace(/%s/g, function () {
            var arg = args[i++];

            if (typeof arg === 'undefined') {
                flag = false;
                return '';
            }
            return arg;
        });
        return flag ? str : '';
    };

    var getPropertyFromOther = function (list, from, to, value) {
        var result = '';
        $.each(list, function (i, item) {
            if (item[from] === value) {
                result = item[to];
                return false;
            }
            return true;
        });
        return result;
    };

    var getFieldIndex = function (columns, field) {
        var index = -1;

        $.each(columns, function (i, column) {
            if (column.field === field) {
                index = i;
                return false;
            }
            return true;
        });
        return index;
    };

    var getScrollBarWidth = function () {
        var inner = $('<p/>').addClass('fixed-table-scroll-inner'),
            outer = $('<div/>').addClass('fixed-table-scroll-outer'),
            w1, w2;

        outer.append(inner);
        $('body').append(outer);

        w1 = inner[0].offsetWidth;
        outer.css('overflow', 'scroll');
        w2 = inner[0].offsetWidth;

        if (w1 === w2) {
            w2 = outer[0].clientWidth;
        }

        outer.remove();
        return w1 - w2;
    };


    /// CHANGED IMPORTANT - changed all calls to this that used formatter to pass column name as arg
    var calculateObjectValue = function (self, name, args, defaultValue) {
        if (typeof name === 'string') {
            // support obj.func1.func2
            var names = name.split('.');

            if (names.length > 1) {
                name = window;
                $.each(names, function (i, f) {
                    name = name[f];
                });
            } else {
                name = window[name];
            }
        }
        if (typeof name === 'object') {
            return name;
        }
        if (typeof name === 'function') {
            return name.apply(self, args);
        }
        return defaultValue;
    };

    var escapeHTML = function (text) {
        if (typeof text === 'string') {
            return text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }
        return text;
    };

    // BOOTSTRAP TABLE CLASS DEFINITION
    // ======================

    var BootstrapTable = function (el, options) {
        this.options = options;
        this.$el = $(el);
        this.$el_ = this.$el.clone();
        this.timeoutId_ = 0;

        this.init();
    };

    BootstrapTable.DEFAULTS = {
        classes: 'table table-hover',
        height: undefined,
        undefinedText: '-',
        sortName: undefined,
        sortOrder: 'asc',
        striped: false,
        columns: [],
        data: [],
        method: 'get',
        url: undefined,
        cache: true,
        contentType: 'application/json',
        dataType: 'json',
        ajaxOptions: {},
        queryParams: function (params) { return params; },
        queryParamsType: 'limit', // undefined
        responseHandler: function (res) { return res; },
        pagination: false,
        sidePagination: 'client', // client or server
        totalRows: 0, // server side need to set
        pageNumber: 1,
        pageSize: 10,
        pageList: [10, 25, 50, 100],
        search: false,
        searchAlign: 'right',
        selectItemName: 'btSelectItem',
        showHeader: true,
        showColumns: false,
        showPaginationSwitch: false,
        showRefresh: false,
        showToggle: false,
        buttonsAlign: 'right',
        smartDisplay: true,
        minimumCountColumns: 1,
        idField: undefined, // NOTE - used in base plugin only for checkboxes, but used in my tweaks to pick activeItem
        cardView: false,
        trimOnSearch: true,
        clickToSelect: false,
        singleSelect: false,
        toolbar: undefined,
        toolbarAlign: 'left',
        checkboxHeader: true,
        sortable: true,
        maintainSelected: false,
        searchTimeOut: 500,
        iconSize: undefined,
        iconsPrefix: 'glyphicon', // glyphicon of fa (font awesome)
        icons: {
            paginationSwitchDown: 'glyphicon-collapse-down icon-chevron-down',
            paginationSwitchUp: 'glyphicon-collapse-up icon-chevron-up',
            refresh: 'glyphicon-refresh icon-refresh',
            toggle: 'glyphicon-list-alt icon-list-alt',
            columns: 'glyphicon-th icon-th'
        },

        rowStyle: function (row, index) { return {}; },

        rowAttributes: function (row, index) { return {}; },

        onAll: function (name, args) { return false; },
        onClickRow: function (item, $element) { return false; },
        onDblClickRow: function (item, $element) { return false; },
        onSort: function (name, order) { return false; },
        onCheck: function (row) { return false; },
        onUncheck: function (row) { return false; },
        onCheckAll: function () { return false; },
        onUncheckAll: function () { return false; },
        onLoadSuccess: function (data) { return false; },
        onLoadError: function (status) { return false; },
        onColumnSwitch: function (field, checked) { return false; },
        onPageChange: function (number, size) { return false; },
        onSearch: function (text) { return false; },
        onPreBody: function (data) { return false; },
        onPostBody: function () { return false; }

        /// CHANGED NEW - match new events to functions     
        , onPostToolbar: function () { return false; }
        , onPostPagination: function ($_container) { return false; }
        , onPostInit: function ($_container, _header) { return false; }
        , onPostHeader: function ($_header, _header) { return false; }

        /// CHANGED NEW - retain referance to active row, so can reapply styling and ect
        , activeItemId: undefined

    };


    BootstrapTable.LOCALES = [];

    BootstrapTable.LOCALES['en-US'] = {
        formatLoadingMessage: function () {
            return 'Loading, please wait...';
        },
        formatRecordsPerPage: function (pageNumber) {
            return sprintf('%s records per page', pageNumber);
        },
        formatShowingRows: function (pageFrom, pageTo, totalRows) {
            return sprintf('Showing %s to %s of %s rows', pageFrom, pageTo, totalRows);
        },
        formatSearch: function () {
            return 'Search';
        },
        formatNoMatches: function () {
            return 'No matching records found';
        },
        formatPaginationSwitch: function () {
            return 'Hide/Show pagination';
        },
        formatRefresh: function () {
            return 'Refresh';
        },
        formatToggle: function () {
            return 'Toggle';
        },
        formatColumns: function () {
            return 'Columns';
        }
    };

    $.extend(BootstrapTable.DEFAULTS, BootstrapTable.LOCALES['en-US']);

    BootstrapTable.COLUMN_DEFAULTS = {
        radio: false,
        checkbox: false,
        checkboxEnabled: true,
        field: undefined,
        title: undefined,
        'class': undefined,
        align: undefined, // left, right, center
        halign: undefined, // left, right, center
        valign: undefined, // top, middle, bottom
        width: undefined,
        sortable: false,
        order: 'asc', // asc, desc
        visible: true,
        switchable: true,
        clickToSelect: true,
        formatter: undefined,
        events: undefined,
        sorter: undefined,
        sortName: undefined,
        cellStyle: undefined,
        searchable: true
    };

    BootstrapTable.EVENTS = {
        'all.bs.table': 'onAll',
        'click-row.bs.table': 'onClickRow',
        'dbl-click-row.bs.table': 'onDblClickRow',
        'sort.bs.table': 'onSort',
        'check.bs.table': 'onCheck',
        'uncheck.bs.table': 'onUncheck',
        'check-all.bs.table': 'onCheckAll',
        'uncheck-all.bs.table': 'onUncheckAll',
        'load-success.bs.table': 'onLoadSuccess',
        'load-error.bs.table': 'onLoadError',
        'column-switch.bs.table': 'onColumnSwitch',
        'page-change.bs.table': 'onPageChange',
        'search.bs.table': 'onSearch',
        'pre-body.bs.table': 'onPreBody',
        'post-body.bs.table': 'onPostBody'

        /// CHANGED NEW - match new events to functions
        , 'post-toolbar.bs.table': 'onPostToolbar'
        , 'post-pagination.bs.table': 'onPostPagination'
        , 'post-init.bs.table': 'onPostInit'
        /// NOTE - be careful of unsynced user-doc, as doco existed but no function
        , 'post-header.bs.table': 'onPostHeader'

    };

    BootstrapTable.prototype.init = function () {
        this.initContainer();
        this.initTable();
        this.initHeader();
        this.initData();
        this.initToolbar();
        this.initPagination();
        this.initBody();
        this.initServer();

        /// CHANGED NEW - called only once ever, and passes container and header info out
        this.trigger('post-init', this.$container, this.header);
    };

    BootstrapTable.prototype.initContainer = function () {
        this.$container = $([
            '<div class="bootstrap-table">',
                '<div class="fixed-table-toolbar"></div>',
                '<div class="fixed-table-container">',
                    '<div class="fixed-table-header"><table></table></div>',
                    '<div class="fixed-table-body">',
                        '<div class="fixed-table-loading">',
                            this.options.formatLoadingMessage(),
                        '</div>',
                    '</div>',
                    '<div class="fixed-table-pagination"></div>',
                '</div>',
            '</div>'].join(''));

        this.$container.insertAfter(this.$el);
        this.$container.find('.fixed-table-body').append(this.$el);
        this.$container.after('<div class="clearfix"></div>');
        this.$loading = this.$container.find('.fixed-table-loading');

        this.$el.addClass(this.options.classes);
        if (this.options.striped) {
            this.$el.addClass('table-striped');
        }
    };

    BootstrapTable.prototype.initTable = function () {
        var that = this,
            columns = [],
            data = [];

        this.$header = this.$el.find('thead');
        if (!this.$header.length) {
            this.$header = $('<thead></thead>').appendTo(this.$el);
        }
        if (!this.$header.find('tr').length) {
            this.$header.append('<tr></tr>');
        }
        this.$header.find('th').each(function () {
            var column = $.extend({}, {
                title: $(this).html(),
                'class': $(this).attr('class')
            }, $(this).data());

            columns.push(column);
        });
        this.options.columns = $.extend([], columns, this.options.columns);
        $.each(this.options.columns, function (i, column) {
            that.options.columns[i] = $.extend({}, BootstrapTable.COLUMN_DEFAULTS,
                { field: i }, column); // when field is undefined, use index instead
        });

        // if options.data is setting, do not process tbody data
        if (this.options.data.length) {
            return;
        }

        this.$el.find('tbody tr').each(function () {
            var row = {};

            // save tr's id and class
            row._id = $(this).attr('id');
            row._class = $(this).attr('class');

            $(this).find('td').each(function (i) {
                var field = that.options.columns[i].field;

                row[field] = $(this).html();
                // save td's id and class
                row['_' + field + '_id'] = $(this).attr('id');
                row['_' + field + '_class'] = $(this).attr('class');
            });
            data.push(row);
        });
        this.options.data = data;
    };

    BootstrapTable.prototype.initHeader = function () {
        var that = this,
            visibleColumns = [],
            html = [];

        this.header = {
            fields: [],
            styles: [],
            classes: [],
            formatters: [],
            events: [],
            sorters: [],
            sortNames: [],
            cellStyles: [],
            clickToSelects: [],
            searchables: []
        };
        $.each(this.options.columns, function (i, column) {
            var text = '',
                halign = '', // header align style
                align = '', // body align style
                style = '',
                class_ = sprintf(' class="%s"', column['class']),
                order = that.options.sortOrder || column.order,
                searchable = true;

            if (!column.visible) {
                // Fix #229. Default Sort order is wrong if data-visible="false" is set on the field referenced by data-sort-name.
                if (column.field === that.options.sortName) {
                    that.header.fields.push(column.field);
                }
                return;
            }

            halign = sprintf('text-align: %s; ', column.halign ? column.halign : column.align);
            align = sprintf('text-align: %s; ', column.align);
            style = sprintf('vertical-align: %s; ', column.valign);
            style += sprintf('width: %spx; ', column.checkbox || column.radio ? 36 : column.width);

            visibleColumns.push(column);
            that.header.fields.push(column.field);
            that.header.styles.push(align + style);
            that.header.classes.push(class_);
            that.header.formatters.push(column.formatter);
            that.header.events.push(column.events);
            that.header.sorters.push(column.sorter);
            that.header.sortNames.push(column.sortName);
            that.header.cellStyles.push(column.cellStyle);
            that.header.clickToSelects.push(column.clickToSelect);
            that.header.searchables.push(column.searchable);

            html.push('<th',
                column.checkbox || column.radio ?
                    sprintf(' class="bs-checkbox %s"', column['class'] || '') :
                    class_,
                sprintf(' style="%s"', halign + style),
                '>');
            html.push(sprintf('<div class="th-inner %s">', that.options.sortable && column.sortable ?
                'sortable' : ''));

            text = column.title;
            if (that.options.sortName === column.field && that.options.sortable && column.sortable) {
                text += that.getCaretHtml();
            }

            if (column.checkbox) {
                if (!that.options.singleSelect && that.options.checkboxHeader) {
                    text = '<input name="btSelectAll" type="checkbox" />';
                }
                that.header.stateField = column.field;
            }
            if (column.radio) {
                text = '';
                that.header.stateField = column.field;
                that.options.singleSelect = true;
            }

            html.push(text);
            html.push('</div>');
            html.push('<div class="fht-cell"></div>');
            html.push('</th>');
        });

        this.$header.find('tr').html(html.join(''));
        this.$header.find('th').each(function (i) {
            $(this).data(visibleColumns[i]);
        });
        this.$container.off('click', 'th').on('click', 'th', function (event) {
            if (that.options.sortable && $(this).data().sortable) {
                that.onSort(event);
            }
        });

        if (!this.options.showHeader || this.options.cardView) {
            this.$header.hide();
            this.$container.find('.fixed-table-header').hide();
            this.$loading.css('top', 0);
        } else {
            this.$header.show();
            this.$container.find('.fixed-table-header').show();
            this.$loading.css('top', '37px');
        }

        this.$selectAll = this.$header.find('[name="btSelectAll"]');
        this.$container.off('click', '[name="btSelectAll"]')
            .on('click', '[name="btSelectAll"]', function () {
                var checked = $(this).prop('checked');
                that[checked ? 'checkAll' : 'uncheckAll']();
            });

        this.trigger('post-header', this.$header, this.header);

    };

    /**
     * @param data
     * @param type: append / prepend
     */
    BootstrapTable.prototype.initData = function (data, type) {
        if (type === 'append') {
            this.data = this.data.concat(data);
        } else if (type === 'prepend') {
            this.data = data.concat(this.data);
        } else {
            this.data = data || this.options.data;
        }
        this.options.data = this.data;

        if (this.options.sidePagination === 'server') {
            return;
        }
        this.initSort();
    };

    /// CHANGED - merged in some changes to initSort and new this.header.sortNames (in 1.7.0) to answer bug with sorting 
    BootstrapTable.prototype.initSort = function () {
        var that = this,
            name = this.options.sortName,
            order = this.options.sortOrder === 'desc' ? -1 : 1,
            index = $.inArray(this.options.sortName, this.header.fields);

        if (index !== -1) {
            this.data.sort(function (a, b) {

                /// console.info('this.data.sort', { 'index': index, 'that.data': that.data, 'a': a, 'b': b, 'that.header': that.header });

                if (that.header.sortNames[index]) {
                    name = that.header.sortNames[index];
                }
                var aa = a[name],
                    bb = b[name],
                    value = calculateObjectValue(that.header, that.header.sorters[index], [aa, bb]);

                if (value !== undefined) {
                    return order * value;
                }

                // Fix #161: undefined or null string sort bug.
                if (aa === undefined || aa === null) {
                    aa = '';
                }
                if (bb === undefined || bb === null) {
                    bb = '';
                }

                // IF both values are numeric, do a numeric comparison
                if ($.isNumeric(aa) && $.isNumeric(bb)) {
                    // Convert numerical values form string to float.
                    aa = parseFloat(aa);
                    bb = parseFloat(bb);
                    if (aa < bb) {
                        return order * -1;
                    }
                    return order;
                }

                if (aa === bb) {
                    return 0;
                }

                // If value is not a string, convert to string
                if (typeof aa !== 'string') {
                    aa = aa.toString();
                }

                if (aa.localeCompare(bb) === -1) {
                    return order * -1;
                }

                return order;
            });
        }
    };

    BootstrapTable.prototype.onSort = function (event) {
        var $this = $(event.currentTarget),
            $this_ = this.$header.find('th').eq($this.index());

        this.$header.add(this.$header_).find('span.order').remove();

        if (this.options.sortName === $this.data('field')) {
            this.options.sortOrder = this.options.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            this.options.sortName = $this.data('field');
            this.options.sortOrder = $this.data('order') === 'asc' ? 'desc' : 'asc';
        }
        this.trigger('sort', this.options.sortName, this.options.sortOrder);

        /// CHANGED - change to prepend so doesnt interfere with my-filterable-table
        $this.add($this_).data('order', this.options.sortOrder)
            .find('.th-inner').prepend(this.getCaretHtml());
        // .find('.th-inner').append(this.getCaretHtml());

        if (this.options.sidePagination === 'server') {
            this.initServer();
            return;
        }
        this.initSort();
        this.initBody();
    };

    BootstrapTable.prototype.initToolbar = function () {
        var that = this,
            html = [],
            timeoutId = 0,
            $keepOpen,
            $search,
            switchableCount = 0;

        this.$toolbar = this.$container.find('.fixed-table-toolbar').html('');

        if (typeof this.options.toolbar === 'string') {
            $(sprintf('<div class="bars pull-%s"></div>', this.options.toolbarAlign))
                .appendTo(this.$toolbar)
                .append($(this.options.toolbar));
        }

        // showColumns, showToggle, showRefresh
        html = [sprintf('<div class="columns columns-%s btn-group pull-%s">',
            this.options.buttonsAlign, this.options.buttonsAlign)];

        if (typeof this.options.icons === 'string') {
            this.options.icons = calculateObjectValue(null, this.options.icons);
        }

        if (this.options.showPaginationSwitch) {
            html.push(sprintf('<button class="btn btn-default" type="button" name="paginationSwitch" title="%s">',
                this.options.formatPaginationSwitch()),
                sprintf('<i class="%s %s"></i>', this.options.iconsPrefix, this.options.icons.paginationSwitchDown),
                '</button>');
        }

        if (this.options.showRefresh) {
            html.push(sprintf('<button class="btn btn-default' + (this.options.iconSize == undefined ? '' : ' btn-' + this.options.iconSize) + '" type="button" name="refresh" title="%s">',
                this.options.formatRefresh()),
                sprintf('<i class="%s %s"></i>', this.options.iconsPrefix, this.options.icons.refresh),
                '</button>');
        }

        if (this.options.showToggle) {
            html.push(sprintf('<button class="btn btn-default' + (this.options.iconSize == undefined ? '' : ' btn-' + this.options.iconSize) + '" type="button" name="toggle" title="%s">',
                this.options.formatToggle()),
                sprintf('<i class="%s %s"></i>', this.options.iconsPrefix, this.options.icons.toggle),
                '</button>');
        }

        if (this.options.showColumns) {
            html.push(sprintf('<div class="keep-open btn-group" title="%s">',
                this.options.formatColumns()),
                '<button type="button" class="btn btn-default' + (this.options.iconSize == undefined ? '' : ' btn-' + this.options.iconSize) + ' dropdown-toggle" data-toggle="dropdown">',
                sprintf('<i class="%s %s"></i>', this.options.iconsPrefix, this.options.icons.columns),
                ' <span class="caret"></span>',
                '</button>',
                '<ul class="dropdown-menu" role="menu">');

            $.each(this.options.columns, function (i, column) {
                if (column.radio || column.checkbox) {
                    return;
                }
                var checked = column.visible ? ' checked="checked"' : '';

                if (column.switchable) {
                    html.push(sprintf('<li>' +
                        '<label><input type="checkbox" data-field="%s" value="%s"%s> %s</label>' +
                        '</li>', column.field, i, checked, column.title));
                    switchableCount++;
                }
            });
            html.push('</ul>',
                '</div>');
        }

        html.push('</div>');

        // Fix #188: this.showToolbar is for extentions
        if (this.showToolbar || html.length > 2) {
            this.$toolbar.append(html.join(''));
        }

        if (this.options.showPaginationSwitch) {
            this.$toolbar.find('button[name="paginationSwitch"]')
                .off('click').on('click', $.proxy(this.togglePagination, this));
        }

        if (this.options.showRefresh) {
            this.$toolbar.find('button[name="refresh"]')
                .off('click').on('click', $.proxy(this.refresh, this));
        }

        if (this.options.showToggle) {
            this.$toolbar.find('button[name="toggle"]')
                .off('click').on('click', function () {
                    that.options.cardView = !that.options.cardView;

                    /// CHANGED - need more obvious 'active' state for this toggle button
                    if (that.options.cardView)
                        $(this).addClass('active');
                    else
                        $(this).removeClass('active');

                    that.initHeader();
                    that.initBody();
                });
        }

        if (this.options.showColumns) {
            $keepOpen = this.$toolbar.find('.keep-open');

            if (switchableCount <= this.options.minimumCountColumns) {
                $keepOpen.find('input').prop('disabled', true);
            }

            $keepOpen.find('li').off('click').on('click', function (event) {
                event.stopImmediatePropagation();
            });
            $keepOpen.find('input').off('click').on('click', function () {
                var $this = $(this);

                that.toggleColumn($this.val(), $this.prop('checked'), false);
                that.trigger('column-switch', $(this).data('field'), $this.prop('checked'));
            });
        }

        if (this.options.search) {
            html = [];
            html.push(
                '<div class="pull-' + this.options.searchAlign + ' search">',
                    sprintf('<input class="form-control' + (this.options.iconSize == undefined ? '' : ' input-' + this.options.iconSize) + '" type="text" placeholder="%s">',
                        this.options.formatSearch()),
                '</div>');

            this.$toolbar.append(html.join(''));
            $search = this.$toolbar.find('.search input');
            $search.off('keyup').on('keyup', function (event) {
                clearTimeout(timeoutId); // doesn't matter if it's 0
                timeoutId = setTimeout(function () {
                    that.onSearch(event);
                }, that.options.searchTimeOut);
            });
        }

        /// CHANGED NEW - trigger event after initToolbar so we can manipulate DOM easier
        this.trigger('post-toolbar');
    };

    BootstrapTable.prototype.onSearch = function (event) {
        var text = $.trim($(event.currentTarget).val());

        // trim search input
        if (this.options.trimOnSearch) {
            $(event.currentTarget).val(text);
        }

        if (text === this.searchText) {
            return;
        }
        this.searchText = text;

        this.options.pageNumber = 1;
        this.initSearch();
        this.updatePagination();
        this.trigger('search', text);
    };



    BootstrapTable.prototype.initSearch = function () {
        var that = this;

        if (this.options.sidePagination !== 'server') {
            var s = this.searchText && this.searchText.toLowerCase();
            var f = $.isEmptyObject(this.filterColumns) ? null : this.filterColumns;

            /// console.log('bootstrapTable.initSearch', { s: s, f: f });

            /// CHANGED IMPORTANT - custom code to allow partial filter checks on multiple columns
            // Check filter
            this.data = f ? $.grep(this.options.data, function (item, i) {

                var passCount = 0;
                for (var key in f) {
                    key = $.isNumeric(key) ? parseInt(key, 10) : key;
                    var value = item[key];

                    var fval = f[key].toLowerCase().trim();
                    value = calculateObjectValue(that.header,
                        that.header.formatters[$.inArray(key, that.header.fields)],
                        [value, item, i, key], value);

                    // If fval is EXACTLY the same as options.undefinedText value, then find empty values
                    if ((that.options.undefinedText === fval) && (value === null))
                        passCount++
                        // Else check for partial matches of each fval
                    else if ((typeof value === 'string' || typeof value === 'number') &&
                        (value + '').toLowerCase().indexOf(fval) !== -1)
                        passCount++;

                    /// DEBUG ///
                    /// console.info('filter debug', { value: value, fval: fval, item: item, i: i, f: f, key: key, 'that.header': that.header, passCount: passCount });
                }

                /// NOTE - f.size solution from http://stackoverflow.com/a/5527037/3770004
                ///      - if issues with hasOwnProperty or other, use a second int++ inside loop
                return passCount >= Object.keys(f).length;

            }) : this.options.data;


            this.data = s ? $.grep(this.data, function (item, i) {
                for (var key in item) {
                    key = $.isNumeric(key) ? parseInt(key, 10) : key;
                    var value = item[key];

                    // Fix #142: search use formated data
                    value = calculateObjectValue(that.header,
                        that.header.formatters[$.inArray(key, that.header.fields)],
                        [value, item, i, key], value);

                    var index = $.inArray(key, that.header.fields);
                    if (index !== -1 && that.header.searchables[index] &&
                        (typeof value === 'string' ||
                        typeof value === 'number') &&
                        (value + '').toLowerCase().indexOf(s) !== -1) {
                        return true;
                    }
                }
                return false;
            }) : this.data;
        }
    };

    BootstrapTable.prototype.initPagination = function () {
        this.$pagination = this.$container.find('.fixed-table-pagination');

        if (!this.options.pagination) {
            this.$pagination.hide();
            return;
        } else {
            this.$pagination.show();
        }

        var that = this,
            html = [],
            i, from, to,
            $pageList,
            $first, $pre,
            $next, $last,
            $number,
            data = this.getData();

        if (this.options.sidePagination !== 'server') {
            this.options.totalRows = data.length;
        }

        this.totalPages = 0;
        if (this.options.totalRows) {
            this.totalPages = ~~((this.options.totalRows - 1) / this.options.pageSize) + 1;
            this.options.totalPages = this.totalPages;
        }
        if (this.totalPages > 0 && this.options.pageNumber > this.totalPages) {
            this.options.pageNumber = this.totalPages;
        }

        this.pageFrom = (this.options.pageNumber - 1) * this.options.pageSize + 1;
        this.pageTo = this.options.pageNumber * this.options.pageSize;
        if (this.pageTo > this.options.totalRows) {
            this.pageTo = this.options.totalRows;
        }

        html.push(
            '<div class="pull-left pagination-detail">',
                '<span class="pagination-info">',
                    this.options.formatShowingRows(this.pageFrom, this.pageTo, this.options.totalRows),
                '</span>');

        html.push('<span class="page-list">');

        var pageNumber = [
            '<span class="btn-group dropup">',
            '<button type="button" class="btn btn-default ' + (this.options.iconSize == undefined ? '' : ' btn-' + this.options.iconSize) + ' dropdown-toggle" data-toggle="dropdown">',
            '<span class="page-size">',
            this.options.pageSize,
            '</span>',
            ' <span class="caret"></span>',
            '</button>',
            '<ul class="dropdown-menu" role="menu">'],
            pageList = this.options.pageList;

        if (typeof this.options.pageList === 'string') {
            var list = this.options.pageList.replace('[', '').replace(']', '').replace(/ /g, '').split(',');

            pageList = [];
            $.each(list, function (i, value) {
                pageList.push(+value);
            });
        }

        $.each(pageList, function (i, page) {
            if (!that.options.smartDisplay || i === 0 || pageList[i - 1] <= that.options.totalRows) {
                var active = page === that.options.pageSize ? ' class="active"' : '';
                pageNumber.push(sprintf('<li%s><a href="javascript:void(0)">%s</a></li>', active, page));
            }
        });
        pageNumber.push('</ul></span>');

        html.push(this.options.formatRecordsPerPage(pageNumber.join('')));
        html.push('</span>');

        html.push('</div>',
            '<div class="pull-right pagination">',
                '<ul class="pagination' + (this.options.iconSize == undefined ? '' : ' pagination-' + this.options.iconSize) + '">',
                    '<li class="page-first"><a href="javascript:void(0)">&lt;&lt;</a></li>',
                    '<li class="page-pre"><a href="javascript:void(0)">&lt;</a></li>');

        if (this.totalPages < 5) {
            from = 1;
            to = this.totalPages;
        } else {
            from = this.options.pageNumber - 2;
            to = from + 4;
            if (from < 1) {
                from = 1;
                to = 5;
            }
            if (to > this.totalPages) {
                to = this.totalPages;
                from = to - 4;
            }
        }
        for (i = from; i <= to; i++) {
            /// CHANGED - why 'disabled' class too - breaks css
            html.push('<li class="page-number' + (i === this.options.pageNumber ? ' active XXdisabled' : '') + '">',
                '<a href="javascript:void(0)">', i, '</a>',
                '</li>');
        }

        html.push(
                    '<li class="page-next"><a href="javascript:void(0)">&gt;</a></li>',
                    '<li class="page-last"><a href="javascript:void(0)">&gt;&gt;</a></li>',
                '</ul>',
            '</div>');

        this.$pagination.html(html.join(''));

        $pageList = this.$pagination.find('.page-list a');
        $first = this.$pagination.find('.page-first');
        $pre = this.$pagination.find('.page-pre');
        $next = this.$pagination.find('.page-next');
        $last = this.$pagination.find('.page-last');
        $number = this.$pagination.find('.page-number');

        if (this.options.pageNumber <= 1) {
            $first.addClass('disabled');
            $pre.addClass('disabled');
        }
        if (this.options.pageNumber >= this.totalPages) {
            $next.addClass('disabled');
            $last.addClass('disabled');
        }
        if (this.options.smartDisplay) {
            if (this.totalPages <= 1) {
                this.$pagination.find('div.pagination').hide();
            }
            if (this.options.pageList.length < 2 || this.options.totalRows <= this.options.pageList[0]) {
                this.$pagination.find('span.page-list').hide();
            }

            // when data is empty, hide the pagination
            this.$pagination[this.getData().length ? 'show' : 'hide']();
        }
        $pageList.off('click').on('click', $.proxy(this.onPageListChange, this));
        $first.off('click').on('click', $.proxy(this.onPageFirst, this));
        $pre.off('click').on('click', $.proxy(this.onPagePre, this));
        $next.off('click').on('click', $.proxy(this.onPageNext, this));
        $last.off('click').on('click', $.proxy(this.onPageLast, this));
        $number.off('click').on('click', $.proxy(this.onPageNumber, this));

        /// CHANGED NEW - trigger event after initToolbar so we can manipulate DOM easier
        this.trigger('post-pagination', this.$container);
    };

    BootstrapTable.prototype.updatePagination = function (event) {
        // Fix #171: IE disabled button can be clicked bug.
        if (event && $(event.currentTarget).hasClass('disabled')) {
            return;
        }

        if (!this.options.maintainSelected) {
            this.resetRows();
        }

        this.initPagination();
        if (this.options.sidePagination === 'server') {
            this.initServer();
        } else {
            this.initBody();
        }

        this.trigger('page-change', this.options.pageNumber, this.options.pageSize);
    };

    BootstrapTable.prototype.onPageListChange = function (event) {
        var $this = $(event.currentTarget);

        $this.parent().addClass('active').siblings().removeClass('active');
        this.options.pageSize = +$this.text();
        this.$toolbar.find('.page-size').text(this.options.pageSize);
        this.updatePagination(event);
    };

    BootstrapTable.prototype.onPageFirst = function (event) {
        this.options.pageNumber = 1;
        this.updatePagination(event);
    };

    BootstrapTable.prototype.onPagePre = function (event) {
        this.options.pageNumber--;
        this.updatePagination(event);
    };

    BootstrapTable.prototype.onPageNext = function (event) {
        this.options.pageNumber++;
        this.updatePagination(event);
    };

    BootstrapTable.prototype.onPageLast = function (event) {
        this.options.pageNumber = this.totalPages;
        this.updatePagination(event);
    };

    BootstrapTable.prototype.onPageNumber = function (event) {
        if (this.options.pageNumber === +$(event.currentTarget).text()) {
            return;
        }
        this.options.pageNumber = +$(event.currentTarget).text();
        this.updatePagination(event);
    };

    BootstrapTable.prototype.initBody = function (fixedScroll) {
        var that = this,
            html = [],
            data = this.getData();

        this.trigger('pre-body', data);

        this.$body = this.$el.find('tbody');
        if (!this.$body.length) {
            this.$body = $('<tbody></tbody>').appendTo(this.$el);
        }

        //Fix #389 Bootstrap-table-flatJSON is not working

        if (!this.options.pagination || this.options.sidePagination === 'server') {
            this.pageFrom = 1;
            this.pageTo = data.length;
        }

        for (var i = this.pageFrom - 1; i < this.pageTo; i++) {
            var item = data[i],
                style = {},
                csses = [],
                attributes = {},
                htmlAttributes = [];

            style = calculateObjectValue(this.options, this.options.rowStyle, [item, i], style);

            if (style && style.css) {
                for (var key in style.css) {
                    csses.push(key + ': ' + style.css[key]);
                }
            }

            attributes = calculateObjectValue(this.options,
                this.options.rowAttributes, [item, i], attributes);

            if (attributes) {
                for (var key in attributes) {
                    htmlAttributes.push(sprintf('%s="%s"', key, escapeHTML(attributes[key])));
                }
            }

            /// DEBUG ///
            /// console.log('DEBUG: checking row for activeItemId', { 'that.options.activeItemId': that.options.activeItemId, 'that.options.itemId': that.options.itemId, 'item.hasOwnProperty(that.options.itemId)': item.hasOwnProperty(that.options.itemId), '$.inArray(that.options.itemId, item)': $.inArray(that.options.itemId, item), 'item': item, 'style': style, 'attributes': attributes, 'i': i, });


            /// CHANGED NEW - pickup on activeItem in initBody
            ///             - requires both options.itemId and options.activeItemId to be set correctly
            if (that.options.activeItemId !== undefined
                && that.options.itemId !== undefined
                && item.hasOwnProperty(that.options.itemId)
                && item[that.options.itemId] == that.options.activeItemId) {
                // Append desired 'active' classes (if need, can pass these in as option)
                style["classes"] = ((style.hasOwnProperty("classes")) ? style["classes"] : '') + ' info active ';
            }

            html.push('<tr',
                sprintf(' %s', htmlAttributes.join(' ')),
                sprintf(' id="%s"', $.isArray(item) ? undefined : item._id),
                sprintf(' class="%s"', style.classes || ($.isArray(item) ? undefined : item._class)),
                sprintf(' data-index="%s"', i),
                '>'
            );

            if (this.options.cardView) {
                html.push(sprintf('<td colspan="%s">', this.header.fields.length));
            }

            $.each(this.header.fields, function (j, field) {
                var text = '',
                    value = item[field],
                    type = '',
                    cellStyle = {},
                    id_ = '',
                    class_ = that.header.classes[j],
                    column = that.options.columns[getFieldIndex(that.options.columns, field)];

                style = sprintf('style="%s"', csses.concat(that.header.styles[j]).join('; '));

                value = calculateObjectValue(that.header,
                    that.header.formatters[j], [value, item, i, field], value);

                // handle td's id and class
                if (item['_' + field + '_id']) {
                    id_ = sprintf(' id="%s"', item['_' + field + '_id']);
                }
                if (item['_' + field + '_class']) {
                    class_ = sprintf(' class="%s"', item['_' + field + '_class']);
                }

                cellStyle = calculateObjectValue(that.header,
                    that.header.cellStyles[j], [value, item, i], cellStyle);
                if (cellStyle.classes) {
                    class_ = sprintf(' class="%s"', cellStyle.classes);
                }
                if (cellStyle.css) {
                    var csses_ = [];
                    for (var key in cellStyle.css) {
                        csses_.push(key + ': ' + cellStyle.css[key]);
                    }
                    style = sprintf('style="%s"', csses_.concat(that.header.styles[j]).join('; '));
                }

                if (column.checkbox || column.radio) {
                    //if card view mode bypass
                    if (that.options.cardView) {
                        return true;
                    }

                    type = column.checkbox ? 'checkbox' : type;
                    type = column.radio ? 'radio' : type;

                    text = ['<td class="bs-checkbox">',
                        '<input' +
                            sprintf(' data-index="%s"', i) +
                            sprintf(' name="%s"', that.options.selectItemName) +
                            sprintf(' type="%s"', type) +
                            sprintf(' value="%s"', item[that.options.idField]) +
                            sprintf(' checked="%s"', value === true ||
                                (value && value.checked) ? 'checked' : undefined) +
                            sprintf(' disabled="%s"', !column.checkboxEnabled ||
                                (value && value.disabled) ? 'disabled' : undefined) +
                            ' />',
                        '</td>'].join('');
                } else {
                    value = typeof value === 'undefined' || value === null ?
                        that.options.undefinedText : value;

                    text = that.options.cardView ?
                        ['<div class="card-view">',
                            that.options.showHeader ? sprintf('<span class="title" %s>%s</span>', style,
                                getPropertyFromOther(that.options.columns, 'field', 'title', field)) : '',
                            sprintf('<span class="value">%s</span>', value),
                            '</div>'].join('') :
                        [sprintf('<td%s %s %s>', id_, class_, style),
                            value,
                            '</td>'].join('');

                    // Hide empty data on Card view when smartDisplay is set to true.
                    if (that.options.cardView && that.options.smartDisplay && value === '') {
                        text = '';
                    }
                }

                html.push(text);
            });

            if (this.options.cardView) {
                html.push('</td>');
            }

            html.push('</tr>');
        }

        // show no records
        if (!html.length) {
            html.push('<tr class="no-records-found">',
                sprintf('<td colspan="%s">%s</td>', this.header.fields.length, this.options.formatNoMatches()),
                '</tr>');
        }

        this.$body.html(html.join(''));

        if (!fixedScroll) {
            this.scrollTo(0);
        }

        // click to select by column
        this.$body.find('> tr > td').off('click').on('click', function () {
            var $tr = $(this).parent();
            that.trigger('click-row', that.data[$tr.data('index')], $tr);
            // if click to select - then trigger the checkbox/radio click
            if (that.options.clickToSelect) {
                if (that.header.clickToSelects[$tr.children().index($(this))]) {
                    $tr.find(sprintf('[name="%s"]',
                        that.options.selectItemName))[0].click(); // #144: .trigger('click') bug
                }
            }
        });
        this.$body.find('tr').off('dblclick').on('dblclick', function () {
            that.trigger('dbl-click-row', that.data[$(this).data('index')], $(this));
        });

        this.$selectItem = this.$body.find(sprintf('[name="%s"]', this.options.selectItemName));
        this.$selectItem.off('click').on('click', function (event) {
            event.stopImmediatePropagation();

            var checked = $(this).prop('checked'),
                row = that.data[$(this).data('index')];

            row[that.header.stateField] = checked;
            that.trigger(checked ? 'check' : 'uncheck', row);

            if (that.options.singleSelect) {
                that.$selectItem.not(this).each(function () {
                    that.data[$(this).data('index')][that.header.stateField] = false;
                });
                that.$selectItem.filter(':checked').not(this).prop('checked', false);
            }

            that.updateSelected();
        });

        $.each(this.header.events, function (i, events) {
            if (!events) {
                return;
            }
            // fix bug, if events is defined with namespace
            if (typeof events === 'string') {
                events = calculateObjectValue(null, events);
            }
            for (var key in events) {
                that.$body.find('tr').each(function () {
                    var $tr = $(this),
                        $td = $tr.find(that.options.cardView ? '.card-view' : 'td').eq(i),
                        index = key.indexOf(' '),
                        name = key.substring(0, index),
                        el = key.substring(index + 1),
                        func = events[key];

                    $td.find(el).off(name).on(name, function (e) {
                        var index = $tr.data('index'),
                            row = that.data[index],
                            value = row[that.header.fields[i]];

                        func.apply(this, [e, value, row, index]);
                    });
                });
            }
        });

        this.updateSelected();
        this.resetView();

        this.trigger('post-body');
    };

    BootstrapTable.prototype.initServer = function (silent, query) {
        var that = this,
            data = {},
            params = {
                pageSize: this.options.pageSize,
                pageNumber: this.options.pageNumber,
                searchText: this.searchText,
                sortName: this.options.sortName,
                sortOrder: this.options.sortOrder
            };

        if (!this.options.url) {
            return;
        }

        if (this.options.queryParamsType === 'limit') {
            params = {
                search: params.searchText,
                sort: params.sortName,
                order: params.sortOrder
            };
            if (this.options.pagination) {
                params.limit = this.options.pageSize;
                params.offset = this.options.pageSize * (this.options.pageNumber - 1);
            }
        }
        data = calculateObjectValue(this.options, this.options.queryParams, [params], data);

        $.extend(data, query || {});

        // false to stop request
        if (data === false) {
            return;
        }

        if (!silent) {
            this.$loading.show();
        }

        $.ajax($.extend({}, calculateObjectValue(null, this.options.ajaxOptions), {
            type: this.options.method,
            url: this.options.url,
            data: this.options.contentType === 'application/json' && this.options.method === 'post' ?
                JSON.stringify(data) : data,
            cache: this.options.cache,
            contentType: this.options.contentType,
            dataType: this.options.dataType,
            success: function (res) {
                res = calculateObjectValue(that.options, that.options.responseHandler, [res], res);

                that.load(res);
                that.trigger('load-success', res);
            },
            error: function (res) {
                that.trigger('load-error', res.status);
            },
            complete: function () {
                if (!silent) {
                    that.$loading.hide();
                }
            }
        }));
    };

    BootstrapTable.prototype.getCaretHtml = function () {
        return ['<span class="order' + (this.options.sortOrder === 'desc' ? '' : ' dropup') + '">',
                '<span class="caret" style="margin: 10px 5px;"></span>',
            '</span>'].join('');
    };

    BootstrapTable.prototype.updateSelected = function () {
        var checkAll = this.$selectItem.filter(':enabled').length ===
            this.$selectItem.filter(':enabled').filter(':checked').length;

        this.$selectAll.add(this.$selectAll_).prop('checked', checkAll);

        this.$selectItem.each(function () {
            $(this).parents('tr')[$(this).prop('checked') ? 'addClass' : 'removeClass']('selected');
        });
    };

    BootstrapTable.prototype.updateRows = function (checked) {
        var that = this;

        this.$selectItem.each(function () {
            that.data[$(this).data('index')][that.header.stateField] = checked;
        });
    };

    BootstrapTable.prototype.resetRows = function () {
        var that = this;

        $.each(this.data, function (i, row) {
            that.$selectAll.prop('checked', false);
            that.$selectItem.prop('checked', false);
            row[that.header.stateField] = false;
        });
    };

    BootstrapTable.prototype.trigger = function (name) {
        var args = Array.prototype.slice.call(arguments, 1);

        name += '.bs.table';
        this.options[BootstrapTable.EVENTS[name]].apply(this.options, args);
        this.$el.trigger($.Event(name), args);

        this.options.onAll(name, args);
        this.$el.trigger($.Event('all.bs.table'), [name, args]);
    };

    BootstrapTable.prototype.resetHeader = function () {
        var that = this,
            $fixedHeader = this.$container.find('.fixed-table-header'),
            $fixedBody = this.$container.find('.fixed-table-body'),
            scrollWidth = this.$el.width() > $fixedBody.width() ? getScrollBarWidth() : 0;

        // fix #61: the hidden table reset header bug.
        if (this.$el.is(':hidden')) {
            clearTimeout(this.timeoutId_); // doesn't matter if it's 0
            this.timeoutId_ = setTimeout($.proxy(this.resetHeader, this), 100); // 100ms
            return;
        }

        this.$header_ = this.$header.clone(true, true);
        this.$selectAll_ = this.$header_.find('[name="btSelectAll"]');

        // fix bug: get $el.css('width') error sometime (height = 500)
        setTimeout(function () {
            $fixedHeader.css({
                'height': '37px',
                'border-bottom': '1px solid #dddddd',
                'margin-right': scrollWidth
            }).find('table').css('width', that.$el.css('width'))
                .html('').attr('class', that.$el.attr('class'))
                .append(that.$header_);

            // fix bug: $.data() is not working as expected after $.append()
            that.$header.find('th').each(function (i) {
                that.$header_.find('th').eq(i).data($(this).data());
            });

            that.$body.find('tr:first-child:not(.no-records-found) > *').each(function (i) {
                that.$header_.find('div.fht-cell').eq(i).width($(this).innerWidth());
            });

            that.$el.css('margin-top', -that.$header.height());

            // horizontal scroll event
            $fixedBody.off('scroll').on('scroll', function () {
                $fixedHeader.scrollLeft($(this).scrollLeft());
            });
        });
    };

    BootstrapTable.prototype.toggleColumn = function (index, checked, needUpdate) {
        if (index === -1) {
            return;
        }
        this.options.columns[index].visible = checked;
        this.initHeader();
        this.initSearch();
        this.initPagination();
        this.initBody();

        if (this.options.showColumns) {
            var $items = this.$toolbar.find('.keep-open input').prop('disabled', false);

            if (needUpdate) {
                $items.filter(sprintf('[value="%s"]', index)).prop('checked', checked);
            }

            if ($items.filter(':checked').length <= this.options.minimumCountColumns) {
                $items.filter(':checked').prop('disabled', true);
            }
        }
    };

    // PUBLIC FUNCTION DEFINITION
    // =======================

    BootstrapTable.prototype.resetView = function (params) {
        var that = this,
            header = this.header;

        if (params && params.height) {
            this.options.height = params.height;
        }

        this.$selectAll.prop('checked', this.$selectItem.length > 0 &&
            this.$selectItem.length === this.$selectItem.filter(':checked').length);

        if (this.options.height) {
            var toolbarHeight = +this.$toolbar.children().outerHeight(true),
                paginationHeight = +this.$pagination.children().outerHeight(true),
                height = this.options.height - toolbarHeight - paginationHeight;

            this.$container.find('.fixed-table-container').css('height', height + 'px');
        }

        if (this.options.cardView) {
            // remove the element css
            that.$el.css('margin-top', '0');
            that.$container.find('.fixed-table-container').css('padding-bottom', '0');
            return;
        }

        if (this.options.showHeader && this.options.height) {
            this.resetHeader();
        }

        if (this.options.height && this.options.showHeader) {
            this.$container.find('.fixed-table-container').css('padding-bottom', '37px');
        }
    };

    BootstrapTable.prototype.getData = function () {
        return (this.searchText || !$.isEmptyObject(this.filterColumns)) ? this.data : this.options.data;
    };

    BootstrapTable.prototype.load = function (data) {
        // #431: support pagination
        if (this.options.sidePagination === 'server') {
            this.options.totalRows = data.total;
            data = data.rows;
        }

        this.initData(data);
        this.initSearch();
        this.initPagination();
        this.initBody();
    };

    BootstrapTable.prototype.append = function (data) {
        this.initData(data, 'append');
        this.initSearch();
        this.initPagination();
        this.initBody(true);
    };

    BootstrapTable.prototype.prepend = function (data) {
        this.initData(data, 'prepend');
        this.initSearch();
        this.initPagination();
        this.initBody(true);
    };

    BootstrapTable.prototype.remove = function (params) {
        var len = this.options.data.length,
            i, row;

        if (!params.hasOwnProperty('field') || !params.hasOwnProperty('values')) {
            return;
        }

        for (i = len - 1; i >= 0; i--) {
            row = this.options.data[i];

            if (!row.hasOwnProperty(params.field)) {
                return;
            }
            if ($.inArray(row[params.field], params.values) !== -1) {
                this.options.data.splice(i, 1);
            }
        }

        if (len === this.options.data.length) {
            return;
        }

        this.initSearch();
        this.initPagination();
        this.initBody(true);
    };

    BootstrapTable.prototype.insertRow = function (params) {
        if (!params.hasOwnProperty('index') || !params.hasOwnProperty('row')) {
            return;
        }
        this.data.splice(params.index, 0, params.row);
        this.initBody(true);
    };

    BootstrapTable.prototype.updateRow = function (params) {

        /// CHANGED - allow unknown index rows to be updated
        /// TODO NOTE - documentation exists claiming index can just be itemId, but confirm if just in new version
        if (params.hasOwnProperty('row') && (!params.hasOwnProperty('index') || params.hasOwnProperty('index') == null) && params['row'].hasOwnProperty(this.options.itemId)) {
            params['index'] = this.getRowByItemId(params['row'][this.options.itemId], true);
        }

        if (!params.hasOwnProperty('index') || params.hasOwnProperty('index') == null || !params.hasOwnProperty('row')) {
            console.error('BootstrapTable.prototype.updateRow error, row or index undefined', params);
            return;
        }
        $.extend(this.data[params.index], params.row);
        this.initBody(true);
    };

    BootstrapTable.prototype.mergeCells = function (options) {
        var row = options.index,
            col = $.inArray(options.field, this.header.fields),
            rowspan = options.rowspan || 1,
            colspan = options.colspan || 1,
            i, j,
            $tr = this.$body.find('tr'),
            $td = $tr.eq(row).find('td').eq(col);

        if (row < 0 || col < 0 || row >= this.data.length) {
            return;
        }

        for (i = row; i < row + rowspan; i++) {
            for (j = col; j < col + colspan; j++) {
                $tr.eq(i).find('td').eq(j).hide();
            }
        }

        $td.attr('rowspan', rowspan).attr('colspan', colspan).show();
    };

    /// CHANGED - allow retrieval of specific option, for efficiency
    BootstrapTable.prototype.getOptions = function (opt_name) {
        if (typeof opt_name !== 'undefined' && opt_name != null)
            return this.options[opt_name];
        return this.options;
    };

    BootstrapTable.prototype.getSelections = function () {
        var that = this;

        return $.grep(this.data, function (row) {
            return row[that.header.stateField];
        });
    };

    BootstrapTable.prototype.checkAll = function () {
        this.checkAll_(true);
    };

    BootstrapTable.prototype.uncheckAll = function () {
        this.checkAll_(false);
    };

    BootstrapTable.prototype.checkAll_ = function (checked) {
        this.$selectItem.filter(':enabled').prop('checked', checked);
        this.updateRows(checked);
        this.updateSelected();
        this.trigger(checked ? 'check-all' : 'uncheck-all');
    };

    BootstrapTable.prototype.check = function (index) {
        this.check_(true, index);
    };

    BootstrapTable.prototype.uncheck = function (index) {
        this.check_(false, index);
    };

    BootstrapTable.prototype.check_ = function (checked, index) {
        this.$selectItem.filter(sprintf('[data-index="%s"]', index)).prop('checked', checked);
        this.data[index][this.header.stateField] = checked;
        this.updateSelected();
    };

    BootstrapTable.prototype.destroy = function () {
        this.$el.insertBefore(this.$container);
        $(this.options.toolbar).insertBefore(this.$el);
        this.$container.next().remove();
        this.$container.remove();
        this.$el.html(this.$el_.html())
            .css('margin-top', '0')
            .attr('class', this.$el_.attr('class') || ''); // reset the class
    };

    BootstrapTable.prototype.showLoading = function () {
        this.$loading.show();
    };

    BootstrapTable.prototype.hideLoading = function () {
        this.$loading.hide();
    };

    BootstrapTable.prototype.togglePagination = function () {
        this.options.pagination = !this.options.pagination;
        /// CHANGED - need more obvious 'active' state for this toggle button
        var button = this.$toolbar.find('button[name="paginationSwitch"]');
        var icon = button.find('i');
        if (this.options.pagination) {
            button.removeClass('active');
            icon.attr("class", this.options.iconsPrefix + " " + this.options.icons.paginationSwitchDown);
        } else {
            button.addClass('active');
            icon.attr("class", this.options.iconsPrefix + " " + this.options.icons.paginationSwitchUp);
        }
        this.updatePagination();
    };

    BootstrapTable.prototype.refresh = function (params) {
        if (params && params.url) {
            this.options.url = params.url;
            this.options.pageNumber = 1;
        }
        this.initServer(params && params.silent, params && params.query);
    };

    BootstrapTable.prototype.showColumn = function (field) {
        this.toggleColumn(getFieldIndex(this.options.columns, field), true, true);
    };

    BootstrapTable.prototype.hideColumn = function (field) {
        this.toggleColumn(getFieldIndex(this.options.columns, field), false, true);
    };

    BootstrapTable.prototype.filterBy = function (columns) {
        this.filterColumns = $.isEmptyObject(columns) ? {} : columns;
        this.options.pageNumber = 1;
        this.initSearch();
        this.updatePagination();
    };

    BootstrapTable.prototype.scrollTo = function (value) {
        var $tbody = this.$container.find('.fixed-table-body');
        if (typeof value === 'string') {
            value = value === 'bottom' ? $tbody[0].scrollHeight : 0;
        }
        if (typeof value === 'number') {
            $tbody.scrollTop(value);
        }
    };

    BootstrapTable.prototype.selectPage = function (page) {
        if (page > 0 && page <= this.options.totalPages) {
            this.options.pageNumber = page;
            this.updatePagination();
        }
    };

    BootstrapTable.prototype.prevPage = function () {
        if (this.options.pageNumber > 1) {
            this.options.pageNumber--;
            this.updatePagination();
        }
    };

    BootstrapTable.prototype.nextPage = function () {
        if (this.options.pageNumber < this.options.totalPages) {
            this.options.pageNumber++;
            this.updatePagination();
        }
    };

    BootstrapTable.prototype.toggleView = function () {
        this.options.cardView = !this.options.cardView;
        this.initHeader();
        this.initBody();
    };



    /// TODO - finish, maybe using this.options.data and iterator till match found
    /// TODO - AND/OR  we could seperate and create more generic 'findMatchingRow' function for wider use, but wait for use case first
    /// CHANGED NEW - takes setActiveItem even further by allowing calls where only the row itemId value is known
    BootstrapTable.prototype.getRowByItemId = function (row_itemid, justIndex) {
        /// console.info('BootstrapTable.selectRowByItemId started', { row_itemid: row_itemid, data: this.options.data });
        var that = this;
        justIndex = (typeof justIndex !== 'undefined' && !!justIndex);
        var matching_row = null;
        if (that.options.itemId !== undefined) {
            $.each(that.options.data, function (d_i, d_val) {
                /// console.log('BootstrapTable.selectRowByItemId checking row', [d_i, d_val, row_itemid]);
                if (d_val != null && d_val.hasOwnProperty(that.options.itemId) && d_val[that.options.itemId] == row_itemid) {
                    /// console.log('BootstrapTable.selectRowByItemId match found!!', d_val);
                    matching_row = ((justIndex) ? d_i : d_val);
                    // Return false to exit loop
                    return false;
                }
            });
        }
        else
            console.error('BootstrapTable.selectRowByItemId error: itemId must be defined', { 'row_itemid': row_itemid, 'that.options.itemId': that.options.itemId });

        return matching_row;
    };
    
    
    /// CHANGED NEW IMPORTANT - made for jsfiddle demo as substitute for other code with dependencies
    BootstrapTable.prototype.jsfiddleRefreshPagination = function (row_itemid) {
        this.initPagination();
    }


    /// CHANGED NEW - convienience function needed to keep public methods accessor simple
    BootstrapTable.prototype.getRowIndexByItemId = function (row_itemid) {
        return this.getRowByItemId(row_itemid, true);
    }

    /// CHANGED NEW - expose functionality for active_item 
    BootstrapTable.prototype.setActiveItem = function (row) {

        console.log('BootstrapTable.setActiveItem started', [row, this.options.itemId]);

        /// NOTE - low priority, we could also use options.uniqueId, if use-case arrises
        if (this.options.itemId !== undefined && row.hasOwnProperty(this.options.itemId))
            this.options.activeItemId = row[this.options.itemId];
        else
            console.error('BootstrapTable.setActiveItem error: itemId must be defined', { 'row': row, 'this.options.itemId': this.options.itemId });
    };

    /// CHANGED NEW - returns the 'activeItemId' matching row
    /// TODO - if needed, seperate and make public getter for activeItemId, but keep as convienience function till use case arrises
    BootstrapTable.prototype.getActiveRow = function (justIndex) {
        /// NOTE - low priority, we could also use options.uniqueId, if use-case arrises
        if (this.options.itemId !== undefined && this.options.activeItemId !== undefined)
            return this.getRowByItemId(this.options.activeItemId, justIndex);

        console.error('BootstrapTable.setActiveItem error: itemId and activeItemId must be defined', { 'this.options.itemId': this.options.itemId, 'this.options.activeItemId': this.options.activeItemId });
        return null;
    };
    // BOOTSTRAP TABLE PLUGIN DEFINITION
    // =======================

    var allowedMethods = [
        'getOptions',
        'getSelections', 'getData',
        'load', 'append', 'prepend', 'remove',
        'insertRow', 'updateRow',
        'mergeCells',
        'checkAll', 'uncheckAll',
        'check', 'uncheck',
        'refresh',
        'resetView',
        'destroy',
        'showLoading', 'hideLoading',
        'showColumn', 'hideColumn',
        'filterBy',
        'scrollTo',
        'selectPage', 'prevPage', 'nextPage',
        'togglePagination',
        'toggleView',
        /// CHANGED - allow public access
        'setActiveItem',
        'getActiveRow',
        'getRowByItemId',
        'getRowIndexByItemId',
        'jsfiddleRefreshPagination'
    ];

    $.fn.bootstrapTable = function (option, _relatedTarget) {
        var value;

        this.each(function () {
            var $this = $(this),
                data = $this.data('bootstrap.table'),
                options = $.extend({}, BootstrapTable.DEFAULTS, $this.data(),
                    typeof option === 'object' && option);

            if (typeof option === 'string') {
                if ($.inArray(option, allowedMethods) < 0) {
                    throw "Unknown method: " + option;
                }

                if (!data) {
                    return;
                }

                value = data[option](_relatedTarget);

                if (option === 'destroy') {
                    $this.removeData('bootstrap.table');
                }
            }

            if (!data) {
                $this.data('bootstrap.table', (data = new BootstrapTable(this, options)));
            }
        });

        return typeof value === 'undefined' ? this : value;
    };

    $.fn.bootstrapTable.Constructor = BootstrapTable;
    $.fn.bootstrapTable.defaults = BootstrapTable.DEFAULTS;
    $.fn.bootstrapTable.columnDefaults = BootstrapTable.COLUMN_DEFAULTS;
    $.fn.bootstrapTable.locales = BootstrapTable.LOCALES;
    $.fn.bootstrapTable.methods = allowedMethods;

    // BOOTSTRAP TABLE INIT
    // =======================

    $(function () {
        $('[data-toggle="table"]').bootstrapTable();
    });

}(jQuery);




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///                                     END OF bootstrap-table.dev.js                                            ///
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////







////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///                    source: sortable-table-app.dev.js - created by dabros - 10/4/15                           ///
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



/// TODO - pass in all variables via data-url, including selectable-rows and button options (if applicable anymore)
function _setup_sortable_tables() {
    // http://bootstrap-table.wenzhixin.net.cn/documentation/
    /// NOTE TODO - if filtering highly desired, tie in 1.6.0 filter method to something like http://bootsnipp.com/snippets/featured/panel-table-with-filters-per-column
    ///           - thats assuming no ui presented already, like in the 1.3.0 (buggy) filter extension


    // Initialises all tables at once, using data-attributes for each to define different behaiviour
    $('.my-sortable-table').each(function () {
        var $tt = $(this);

        $tt.bootstrapTable({
            data: [{ "CustomerID": 1, "CustomerName": "Carson", "CountryID": 1, "DealerID": 4, "CustomerCreated": "\/Date(1125496800000)\/", "DonglesCount": 3 }, { "CustomerID": 2, "CustomerName": "Jones", "CountryID": 2, "DealerID": 1, "CustomerCreated": "\/Date(1125496800000)\/", "DonglesCount": 2 }, { "CustomerID": 3, "CustomerName": "Barry", "CountryID": 3, "DealerID": 4, "CustomerCreated": "\/Date(1231077600000)\/", "DonglesCount": 4 }, { "CustomerID": 4, "CustomerName": "Bill", "CountryID": 3, "DealerID": 6, "CustomerCreated": "\/Date(1114869600000)\/", "DonglesCount": 1 }, { "CustomerID": 5, "CustomerName": "Polly", "CountryID": 4, "DealerID": 3, "CustomerCreated": "\/Date(1054562400000)\/", "DonglesCount": 2 }, { "CustomerID": 6, "CustomerName": "Trevor", "CountryID": 1, "DealerID": 4, "CustomerCreated": "\/Date(1120140000000)\/", "DonglesCount": 1 }, { "CustomerID": 7, "CustomerName": "Ivan", "CountryID": 2, "DealerID": 1, "CustomerCreated": "\/Date(1009893600000)\/", "DonglesCount": 0 }, { "CustomerID": 8, "CustomerName": "Larry", "CountryID": 3, "DealerID": 4, "CustomerCreated": "\/Date(1041343200000)\/", "DonglesCount": 4 }, { "CustomerID": 9, "CustomerName": "Molly", "CountryID": 5, "DealerID": 1, "CustomerCreated": "\/Date(1000994400000)\/", "DonglesCount": 1 }, { "CustomerID": 10, "CustomerName": "Mark", "CountryID": 3, "DealerID": 3, "CustomerCreated": "\/Date(969372000000)\/", "DonglesCount": 0 }],


            /// NOTE - pagination recreated from several events, so need to reapply tweak each time initPagination is called
            onPostPagination: function () {
                var $wrap = $tt.parents('.bootstrap-table').first().find('.fixed-table-pagination');
                $wrap.find('ul.pagination').addClass('pagination-sm');
                $wrap.find('.btn').addClass('btn-sm');
                $wrap.find('input.form-control').addClass('input-sm');

                /// NOTE IMPORTANT - jump to active row if temp data-attribute found
                var jump_itemid = $tt.data('jumpToRowOnce');
                var jump_table_data = $tt.bootstrapTable('getData');
                if (typeof jump_table_data !== 'undefined' && jump_itemid) {
                    var jump_to_index = $tt.bootstrapTable('getRowIndexByItemId', jump_itemid);
                    if (jump_to_index != null) {
                        // Null the attr so no infinite loop
                        $tt.data('jumpToRowOnce', '');
                        // Change page number to match
                        var jump_to_page = (Math.ceil(jump_to_index / $tt.bootstrapTable('getOptions', 'pageSize')));
                        $tt.bootstrapTable('selectPage', ((jump_to_page > 0) ? jump_to_page : 1))
                        console.info("DEBUG activeItem pagination ##", [jump_itemid, jump_table_data, jump_to_index, jump_to_page]);
                    }
                }
            },

            onPostBody: function () {
            },

            /// NOTE - header can be refreshed by toggleView and other calls, so need to update accordingly
            onPostHeader: function ($_header, _header) {

                ///console.log('onPostHeader', [$_header, _header]);

                if (!!$tt.data('filters')) {
                    $_header.find('.th-inner').each(function (th_i) {
                        // Sanity check if needed
                        if (!$(this).find('input').length) {
                            var colPlaceholder = $(this).text();
                            var colName = _header.fields[th_i];
                            var $colInput = $('<input type="text" name="' + colName + '" class="form-control my-filterable-input XXinput-sm" placeholder="' + colPlaceholder + '" disabled/>')
                                .off('keyup change').on('keyup change', function () {
                                    var _filterdata = {}; // $tt.find('.my-filterable-table-tr .my-filterable-input').serializeArray();
                                    $_header.find('.my-filterable-input').each(function () {
                                        if ($(this).val().trim() !== "")
                                            _filterdata[$(this).attr('name')] = $(this).val().trim();
                                    });
                                    $tt.bootstrapTable('filterBy', _filterdata);
                                    /// console.log('my-filterable-input keyup|change', _filterdata);
                                }).on('click', function (e) { e.stopPropagation(); });
                            $(this).empty().append($colInput);
                        }
                    });
                }


                /// REVERTED - low priority - add sortable icons to all sortable th to show them as such - https://github.com/wenzhixin/bootstrap-table/issues/585
                // $_header.find('.th-inner.sortable:not(:has(span.order))').each(function () { $(this).append($('<span class=" pull-left"><span class="glyphicon text-muted glyphicon-sort"></span></span>')) });

            },

            // NOTE IMPORTANT - custom event that only fires once ever, after all table UI constructed
            onPostInit: function ($_container, _header) {


                /// NOTE IMPORTANT - use the arguments keyword to pass in any number of parameters/arguments
                console.log('my-sortable-table onPostInit', { 'id': $tt.attr('id'), 'arguments': arguments });

                var $wrap = $_container;  // $tt.parents('.bootstrap-table').first(); //
                $wrap.find('.btn').addClass('btn-sm');
                $wrap.find('input.form-control').addClass('input-sm');

                var controller_item_name = $tt.data('controllerItemName');
                var $item_modal = $('#' + controller_item_name + 'Modal');

                /// TODO - look at http://jquery.malsup.com/form/#validation for client-side validation

                // Check for modals related to this table, and setup some contextual logic
                if ($item_modal.length) {

                    /// TODO - move this into into form submission logic so only on submitSuccess - Submit buttons also close the Modal
                    // $item_modal.find('form button[type="submit"]').on('click', function (e) { $item_modal.modal('hide'); });

                    $item_modal.on('show.bs.modal', function (e) {
                        var $trigger = $(e.relatedTarget);
                        var context = $trigger.data('context');

                        $item_modal.data('context', context);

                        console.log('$item_modal for ' + controller_item_name + ' show.bs.modal', [e, context, $item_modal, $trigger]);

                        // Form always cleared first, just in case
                        // NOTE IMPORTANT - workaround for certain fields showing issues if clearForm called before populated using loadJson (jquery.loadJson plugin)
                        $item_modal.find('form .form-control:not(.clearform-item-skip)').clearFields();

                        // Use class and data-attribute to toggle UI elements based on context
                        var $context_only_items = $item_modal.find('.context-only-item');
                        $context_only_items.filter('[data-wrong-context-action="disable"]').addClass('disabled').attr('disabled', 'true').filter('[data-context="' + context + '"]').removeClass('disabled').removeAttr('disabled');
                        $context_only_items.filter('[data-wrong-context-action="readonly"]').addClass('disabled').attr('readonly', 'true').filter('[data-context="' + context + '"]').removeClass('disabled').removeAttr('readonly');

                        // Extra contextual logic like modal-title and setting up links and the like
                        switch (context) {
                            case 'add':
                                $item_modal.find('.modal-title').text('Add New ' + controller_item_name);
                                // $item_modal.find('form .form-control.clearfield-on-context-only[.clearfield-on-context-only[data-clearfield-context="' + context + '"]]').val('');
                                $item_modal.find('input#DongleID').val('');
                                // $item_modal.find('.' + $(this).data('context') + '-context-only-item')
                                break;
                            case 'edit':
                                // Get the url needed to retrieve current data
                                //var item_uid = $tt.bootstrapTable('getOptions', 'activeItemId');
                                var item_row = $tt.bootstrapTable('getActiveRow');
                                var selected_row_id = $trigger.data('selectedRowId');
                                var selected_row_index = $trigger.data('selectedRowIndex');

                                console.info('$item_modal edit context', [item_row, selected_row_id, selected_row_index]);

                                var item_uid = item_row[$tt.bootstrapTable('getOptions', 'itemId')];
                                var edit_url = '/' + controller_item_name + '/edit/' + item_uid;
                                // Update title
                                $item_modal.find('.modal-title').text('Edit Basic ' + controller_item_name + ' Details: ' + item_uid);
                                // Update reset link
                                $item_modal.find('.form-reset-btn').attr('href', edit_url);
                                // Make call, assuming return will be processed into the passed target
                                /////_ajax_make_call(edit_url, $item_modal.find('form'));
                                break;
                        }

                    });
                }



                if (!!$tt.data('selectable-rows')) {
                    $tt.addClass('my-selectable-table');


                    /// NOTE - action_bar refers to dedicated action_bar
                    if ($tt.data('selectableRowsAction') == 'action_bar') {

                        /// NOTE - call to disable or enable later, used too many times to print to UI and no need to add to bootstrap-table.dev.js direct (maybe extension??)
                        $action_bar = $('<div class="selectable-table-action-bar row" id="' + $tt.attr('id') + '-action-bar" style="margin-left:0;"></div>');
                        $ab_add = $('<a class="btn btn-default btn-success-on-hover btn-sm" data-toggle="modal" data-target="#' + controller_item_name + 'Modal" data-context="add"><span class="glyphicon glyphicon-plus"></span> Add New ' + controller_item_name + '</a>');
                        $ab_edit = $('<a class="btn btn-default btn-primary-on-hover btn-sm disabled" data-requires-selection="true" data-toggle="modal" data-target="#' + controller_item_name + 'Modal" data-context="edit"><span class="glyphicon glyphicon-edit"></span> Edit ' + controller_item_name + '</a>');
                        $ab_delete = $('<a class="btn btn-default btn-danger-on-hover btn-sm disabled" data-requires-selection="true"><span class="glyphicon glyphicon-remove"></span> Delete ' + controller_item_name + '</a>');
                        $ab_openlist = $('<a class="btn btn-default btn-info-on-hover btn-sm disabled action-bar-open-item-btn"  data-requires-selection="true" data-selection-url-to-update="/' + controller_item_name + '/index" target="_blank" href="/' + controller_item_name + '/index"><span class="glyphicon glyphicon-new-window"></span> Open in ' + controller_item_name + 's List</a>');

                        $action_bar.append($ab_add, "&nbsp;", $ab_edit, "&nbsp;", $ab_delete, "&nbsp;", $ab_openlist);


                        $wrap.append('<div class="clearfix"></div>', $action_bar);
                    }

                    $tt.on('click-row.bs.table', function (e, row, $element) {
                        // When row is clicked
                        $tt.find('tbody tr.active').removeClass('active info');
                        $element.addClass('active info');

                        // 
                        console.info('Event: click-row.bs.table', [e, row, $element, $tt.data('itemId')]);

                        // Use simple switch with predifined values to determine action to take
                        switch ($tt.data('selectableRowsAction')) {
                            case 'load_panels':
                                ///// ajax_populate_panels($tt.attr('id'), row);
                                break;
                            case 'action_bar':
                                $('#' + $tt.attr('id') + '-action-bar .btn[data-requires-selection="true"]').removeClass('disabled').removeAttr('disabled').each(function () {
                                    $(this).data('selectedRowId', row[$tt.data('itemId')]).data('selectedRowIndex', $element.data('index'));
                                    if ($(this).data('selectionUrlToUpdate'))
                                        $(this).attr('href', $(this).data('selectionUrlToUpdate') + '/' + row[$tt.data('itemId')]);
                                });
                                break;
                        }

                        $tt.bootstrapTable('setActiveItem', row);


                    });

                    /// NOTE IMPORTANT - if activeItemId set on init the panels wont automattically load, so simulate the action
                    if ($tt.data('active-item-id')) {
                        /// REVERTED - need to also scroll to row, so find that first
                        /*
                        */
                        // Pass in the assumed primary key and its active-item-id value
                        var row_data = {};
                        row_data[$tt.data('item-id')] = $tt.data('active-item-id');
                        ///// ajax_populate_panels($tt.attr('id'), row_data);

                        /// NOTE IMPORTANT - use temp data-attribute to convey action required
                        $tt.data('jumpToRowOnce', $tt.data('active-item-id'));
                    }
                }



                if ($wrap.find('.btn-filter')) {
                    if (!!$tt.data('filters')) {
                        $tt.addClass('my-filterable-table');
                        $wrap.find('.btn[name=filtertoggle]').on('click', function () {
                            $filters = $tt.find('thead .my-filterable-input');
                            // $tbody = $tt.find('.table tbody');
                            if ($filters.prop('disabled') == true) {
                                $filters.prop('disabled', false).addClass('input-sm');
                                $filters.first().focus();
                            } else {
                                $filters.val('').prop('disabled', true).removeClass('input-sm');
                                $tt.bootstrapTable('filterBy', {});
                            }
                        });

                    } else {
                        $wrap.find('.btn-filter').remove();
                    }
                }
            }
        });
    });

}

/// TODO IMPORTANT - finish and tie into UI
// Sets active class, activeItemId and loads panels for that row
/// TODO - this should navigate pagination to the row also
function jumpToRow(table_id, rowId) {
    var data = $(table_id).bootstrapTable('getData');
    console.log('jumpToRow', data);
}


// Convienience functions
function sortable_formatter_via_lookup(value, row, index, name) {
    return sortable_formatter(value, row, index, name, "lookup");
}

function sortable_formatter_for_datetime(value, row, index, name) {
    return sortable_formatter(value, row, index, name, "datetime");
}

// Generic formatter function that uses name to determine action
function sortable_formatter(value, row, index, name, context) {

    /// console.log('sortable_formatter', [value, row, index, name, context]);

    // Use default to "lookup" just in case, though ideally use convienience function above
    if (typeof context === 'undefined')
        context = "lookup";

    if (typeof value !== 'undefined') {
        // The default for empty is null with bootstrap-table, so no error msg if null
        if (value !== null) {
            /// NOTE - if extra steps needed, use switch(name){} as well, storing return in var temp
            return my_formatter(value, context, name);

            console.error('sortable_formatter: no match for', [value, row, index, name]);
        }
    } else {
        console.info('sortable_formatter: undefined value', [value, row, index, name]);
    }
    return value;
}

// Asp.Net Json date values need to be sorted differently, first padding the timestamp to make uniform
function my_date_sorter(a, b) {
    var avalue = parseInt(((a != null) ? a.replace("/Date(", "").replace(")/", "") : 0), 10);
    var bvalue = parseInt(((b != null) ? b.replace("/Date(", "").replace(")/", "") : 0), 10);
    /// console.log('my_date_sorter', [a, b, avalue, bvalue]);
    if (avalue < bvalue) return 1;
    if (avalue > bvalue) return -1;
    return 0;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///                                     END OF sortable-table-app.dev.js                                         ///
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///                    source: scripts.js - created by dabros - 10/4/15                           ///
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// End point for sortable_formatter, seperated for wider use
function my_formatter(value, context, name) {
    switch (context) {
        case "lookup":
            if (jsLookups.hasOwnProperty(name))
                value = jsLookups[name][value.toString()];
            break;
        case "datetime":
            if (value.indexOf("/Date") == 0) {
                var dvalue = new Date(parseInt(value.replace("/Date(", "").replace(")/", ""), 10));
                // value = dvalue.getDate() + "-" + (dvalue.getMonth() + 1) + "-" + dvalue.getFullYear();
                value = moment(dvalue).format("DD-MM-YYYY");
            }
    }
    return value;
}



// Just refreshes any ui loaded from jsLookup entries, doesnt call ajax itself to refresh the lookups themselves
function refresh_autofills(lookup_names) {
    //$.each(lookup_names.split(','), function (ln_i, ln_v) {
    lookup_names = (((typeof lookup_names == 'undefined' || !!!lookup_names)) ? null : lookup_names.split(','));
    $.each(jsLookups, function (jsl_i, jsl_val) {
        // if (typeof lookup_names == 'undefined' || !!!lookup_names || lookup_names == jsl_i)
        if (lookup_names == null || lookup_names.indexOf(jsl_i) > -1) {
            /// console.info('refresh_lookup_autofills running', { 'jsl_val': jsl_val, 'jsl_i': jsl_i });
            $('.js-lookups-autofill[data-js-lookup-name="' + jsl_i + '"]').each(function () {
                var $_select_el = $(this);
                $_select_el.empty();
                $.each(jsl_val, function (jsl_item_i, jsl_item_val) {
                    $_select_el.append($("<option />").val(jsl_item_i).text(jsl_item_val));
                });
                // Allow default empty option
                if ($_select_el.data('emptyOption'))
                    $_select_el.prepend($("<option />").val('').text($_select_el.data('emptyOption')));
            });
        }
    });
    //});
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///                                     END OF sortable-table-app.dev.js                                         ///
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
