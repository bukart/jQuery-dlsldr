/**
 * A simple slider for html data lists (<dl>)
 *
 * @name dlsldr
 * @version 0.0.2
 * @requires jQuery v1.7.0+
 * @author Burkhard Krethlow
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright (c) 2012, Burkhard Krethlow (buk -[at]- bukart [*dot*] de)
 */

;( function ( $ )
{

    // *********************************************************************************************
    // >>>> NAMESPACE STUFF >>>>

    var _NSPC_ = '.dlsldr';
    var _NAME_ = 'dlsldr';
    var _DATA_ = _NSPC_ + '.data';

    // <<<< NAMESPACE STUFF <<<<
    // *********************************************************************************************


    // *********************************************************************************************
    // >>>> THE PLUGIN CLASS ITSELF >>>>

    function baseplugin()
    {

        var _UNSPC_ = _NSPC_ + ( new Date() ).getTime()
                                    + Math.round( ( new Date() ).getTime() * Math.random() );

        var self = this;

        // *****************************************************************************************
        // >>>> DEFINITIONS >>>>

        // all these options can be changed with the option parameter from init()
        var defaultOptions =
        {
            'container'             :
            {
                'classesToAdd'          : '',               // a list of css class names to be added
                                                            // to the container (space sep.)
                'width'                 : 'auto',           // the width used by the container,
                                                            // allowed values: number > 0, 'auto'
                                                            // while using 'auto' the with will be
                                                            // the maximum of the widths of headers
                                                            // and databoxes
                'height'                : 'auto',           // the height used by the container,
                                                            // allowed values: number > 0, 'auto'
                                                            // while using 'auto' the height will be
                                                            // the total of the maximum from header
                                                            // and databoxes
                'style'                 : {}                // some styles to be initially applied
                                                            // to the container
            },
            'headers'               :
            {
                'classesToAdd'          : '',               // a list of css class names to be added
                                                            // to each header (space sep.)
                'classesToAddActive'    : 'dlsldr-active',  // a list of css class names to be added
                                                            // to the active header (space sep.)
                'selector'              : '> dt',           // the selector relative to the
                                                            // container to match the headers,
                                                            // typically <dt>-elements ('> dt')
                'width'                 : 'auto',           // the width used by the headers,
                                                            // allowed values: number > 0, 'auto',
                                                            // 'max'
                                                            // number gives every header the same
                                                            // width, while 'auto' allows
                                                            // individuall widths for each header
                                                            // 'max' sets all headers to the same
                                                            // maximum width of all headers
                'height'                : 'auto',           // the height used by the headers,
                                                            // allowed values: number > 0, 'auto'
                                                            // while using 'auto' the height for all
                                                            // headers is the height of the highest
                                                            // header
                'gapSize'               : 0,                // the minimal gap between two clashing
                                                            // headers
                                                            // allowed values: number >= 0
                'clickable'             : true,             // true: clicking on a header scrolls to
                                                            // the corresponding content
                'draggable'             : true,             // true: headers can be dragged
                'preventClickEvent'     : true,             // true: calls stopPropagation() and
                                                            // preventDefault() for the click event
                'preventDragEvent'      : true,             // true: calls stopPropagation() and
                                                            // preventDefault() for the click and
                                                            // move events while dragging
                'style'                 : {}                // some styles to be initially applied
                                                            // to each header
            },
            'databoxes'             :
            {
                'classesToAdd'          : '',               // a list of css class names to be added
                                                            // to each databox (space sep.)
                'classesToAddActive'    : 'dlsldr-active',  // a list of css class names to be added
                                                            // to the active databox (space sep.)
                'selector'              : '> dd',           // the selector relative to the
                                                            // container to match the databoxes,
                                                            // typically <dd>-elements ('> dd')
                'width'                 : 'auto',           // the width used by the databoxes,
                                                            // allowed values: number > 0, 'auto',
                                                            // 'max'
                                                            // number gives every databox the same
                                                            // width, while 'auto' gives the
                                                            // databoxes the container's width
                                                            // 'max' sets all databoxes to the same
                                                            // maximum width of all headers
                'height'                : 'auto',           // the height used by the databoxes,
                                                            // allowed values: number > 0, 'auto'
                                                            // 'max'
                                                            // number gives every databox the same
                                                            // height, while 'auto' gives the
                                                            // databoxes the container's height less
                                                            // the headers' height
                                                            // 'max' sets all databoxes to the same
                                                            // maximum height
                'draggable'             : true,             // true: databoxes can be dragged
                'preventDragEvent'      : true,             // true: calls stopPropagation() and
                                                            // preventDefault() for the click and
                                                            // move events while dragging
                'style'                 : {}                // some styles to be initially applied
                                                            // to each databox
            },
            'animation'             :
            {
                'duration'                 : '',            // the duration of the animated
                                                            // transition
                                                            // allowed values: number >= 0, string
                                                            // all jQuery durations are possible
                                                            // here
                'easing'                : 'swing'           // the easing method to be used with the
                                                            // animation
            }
        };
        // end of defaultOptions


        // internal essential options, these options overides some given default options !
        var settings =
        {
            'container'             :
            {
                'classToAdd'            : 'dlsldr-container',
                'style'                 :
                {
                    'overflow'              : 'hidden',
                    'position'              : 'relative'
                },
                'styleBeforeScan'       : {}
            },
            'headers'               :
            {
                'classToAdd'            : 'dlsldr-header',
                'style'                 :
                {
                    'position'              : 'absolute',
                    'top'                   : '0',
                    'left'                  : '0'
                },
                'styleBeforeScan'       :
                {
                    'float'                 : 'left'
                }
            },
            'databoxes'             :
            {
                'classToAdd'            : 'dlsldr-databox',
                'style'                 :
                {
                    'position'              : 'absolute'
                },
                'styleBeforeScan'       :
                {
                    'float'                 : 'left'
                }
            }
        };
        // end of settings


        // helper object to organize the plugin's methods
        var methods = this.methods =
        {
            'public'                : {},
            'private'               : {}
        };


        // helper object to organize the components, i.e. the involved DOM objects
        var components =
        {
            '$container'            : null,
            '$headers'              : null,
            '$databoxes'            : null
        };


        // contains all calculated and variable values while running the plugin
        var status =
        {
            'headers'               : [],
            'databoxes'             : [],
            'pos'                   : 0,
            'draggingHeader'        :
            {
                'active'                : false,
                'startEvent'            : null,
                'initialPos'            : 0,
                'dragged'               : false
            },
            'draggingDatabox'       :
            {
                'active'                : false,
                'startEvent'            : null,
                'initialPos'            : 0,
                'dragged'               : false,
                'maxDist'               : 0
            },
            'activated_setPos'    : false
        };
        // end of status

        // <<<< DEFINITIONS <<<<
        // *****************************************************************************************


        // *****************************************************************************************
        // >>>> THE "PRIVATES" >>>>


        // -----------------------------------------------------------------------------------------
        // >> setters and getters en masse


        // ·························································································
        // > pattern for setting/getting components data

        var _components2settingsName
            = function( componentsName )
        {
            var componentsNames =
            {
                '$container'        : 'container',
                '$headers'          : 'headers',
                '$databoxes'        : 'databoxes'
            };

            return componentsNames[ componentsName ]
                ? componentsNames[ componentsName ]
                : false;
        };


        var _settings2componentsName
            = function( settingsName )
        {
            var settingsNames =
            {
                'container'         : '$container',
                'headers'           : '$headers',
                'databoxes'         : '$databoxes'
            };

            return settingsNames[ settingsName ]
                ? settingsNames[ settingsName ]
                : false;
        };


        var _componentsNameExists
            = function( componentsName )
        {
            return _components2settingsName( componentsName ) != false;
        };


        var _settingsNameExists
            = function( settingsName )
        {
            return _settings2componentsName( settingsName ) != false;
        };


        var _setComponentWidth
            = function( settingsName, width )
        {
            if ( _settingsNameExists( settingsName ) )
            {
                var ow = components[ _settings2componentsName( settingsName ) ].outerWidth();
                var iw = components[ _settings2componentsName( settingsName ) ].width();
                var dw = ow - iw;

                components[ _settings2componentsName( settingsName ) ].width(
                    ( settings[ settingsName ]._applied.width = width ) - dw
                );
            }
        };


        var _getComponentWidth
            = function( settingsName )
        {
            return _settingsNameExists( settingsName )
                ? settings[ settingsName ]._applied.width
                : false;
        };


        var _setComponentHeight
            = function( settingsName, height )
        {
            if ( _settingsNameExists( settingsName ) )
            {
                var oh = components[ _settings2componentsName( settingsName ) ].outerHeight();
                var ih = components[ _settings2componentsName( settingsName ) ].height();
                var dh = oh - ih;

                components[ _settings2componentsName( settingsName ) ].height(
                    ( settings[ settingsName ]._applied.height = height ) - dh
                );
            }
        };


        var _getComponentHeight
            = function( settingsName )
        {
            return _settingsNameExists( settingsName )
                ? settings[ settingsName ]._applied.height
                : false;
        };


        var _setComponentMaxWidth
            = function( settingsName, maxWidth )
        {
            if ( _settingsNameExists( settingsName ) )
            {
                components[ _settings2componentsName( settingsName ) ].maxWidth(
                    settings[ settingsName ]._applied.size.maxWidth = maxWidth
                );
            }
        };


        var _getComponentMaxWidth
            = function( settingsName )
        {
            return _settingsNameExists( settingsName )
                ? settings[ settingsName ]._applied.size.maxWidth
                : false;
        };


        var _setComponentMaxHeight
            = function( settingsName, maxHeight )
        {
            if ( _settingsNameExists( settingsName ) )
            {
                components[ _settings2componentsName( settingsName ) ].maxHeight(
                    settings[ settingsName ]._applied.size.maxHeight = maxHeight
                );
            }
        };


        var _getComponentMaxHeight
            = function( settingsName )
        {
            return _settingsNameExists( settingsName )
                ? settings[ settingsName ]._applied.size.maxHeight
                : false;
        };


        var _setComponentStyle
            = function( settingsName, style )
        {
            if ( _settingsNameExists( settingsName ) )
            {
                _writeComponentStyle( settingsName, style );
                settings[ settingsName ]._applied.style = _readComponentStyle( settingsName );
            }
        };


        var _getComponentStyle
            = function( settingsName )
        {
            return _settingsNameExists( settingsName )
                ? settings[ settingsName ]._applied.style
                : false;
        };


        var _writeComponentStyle
            = function( settingsName, style )
        {
            if ( _settingsNameExists( settingsName ) )
            {
                if ( 'string' == typeof style )
                {
                    components[ _settings2componentsName( settingsName ) ].attr( 'style', style );
                }
                else if ( 'object' == typeof style )
                {
                    components[ _settings2componentsName( settingsName ) ].css( style );
                }
            }
        };


        var _readComponentStyle
            = function( settingsName )
        {
            if ( _settingsNameExists( settingsName ) ) {
                var style = components[ _settings2componentsName( settingsName ) ].attr( 'style' );
            }
            return style ? style : '';
        };


        var _saveComponentStyle
            = function( settingsName )
        {
            if ( _settingsNameExists( settingsName ) )
            {
                settings[ settingsName ]._applied.style = _readComponentStyle( settingsName );
            }
        };


        var _saveAndWriteComponentStyle
            = function( settingsName, style )
        {
            if ( _settingsNameExists( settingsName ) )
            {
                _saveComponentStyle( settingsName );
                _writeComponentStyle( settingsName, style );
            }
        };


        var _restoreComponentStyle
            = function( settingsName )
        {
            if ( _settingsNameExists( settingsName ) ) {
                _setComponentStyle( settingsName, _getComponentStyle( settingsName ) );
            }
        };

        // < pattern for setting/getting components data
        // ·························································································

        // ·························································································
        // > aliases for setting/getting container's data

        var _setContainerWidth
            = function( width )
        {
            _setComponentWidth( 'container', width );
        };

        var _getContainerWidth
            = function()
        {
            return _getComponentWidth( 'container' );
        };

        var _setContainerHeight
            = function( height )
        {
            _setComponentHeight( 'container', height );
        };

        var _getContainerHeight
            = function()
        {
            return _getComponentHeight( 'container' );
        };

        var _setContainerStyle
            = function( style )
        {
            _setComponentStyle( 'container', style );
        };

        var _getContainerStyle
            = function()
        {
            return _getComponentStyle( 'container' );
        };

        var _writeContainerStyle
            = function( style )
        {
            _writeComponentStyle( 'container', style );
        };

        var _readContainerStyle
            = function()
        {
            return _readComponentStyle( 'container' );
        };

        var _saveContainerStyle
            = function()
        {
            _saveComponentStyle( 'container' );
        };

        var _saveAndWriteContainerStyle
            = function( style )
        {
            _saveAndWriteComponentStyle( 'container', style );
        };

        var _restoreContainerStyle
            = function()
        {
            _restoreComponentStyle( 'container' );
        };

        // < aliases for setting/getting container's data
        // ·························································································


        // ·························································································
        // > aliases for setting/getting headers' data

        var _setHeadersWidth
            = function( width )
        {
            _setComponentWidth( 'headers', width );
        };

        var _getHeadersWidth
            = function()
        {
            return _getComponentWidth( 'headers' );
        };

        var _setHeadersHeight
            = function( height )
        {
            _setComponentHeight( 'headers', height );
        };

        var _getHeadersHeight
            = function()
        {
            return _getComponentHeight( 'headers' );
        };

        var _setHeadersMaxWidth
            = function( width )
        {
            _setComponentMaxWidth( 'headers', width );
        };

        var _getHeadersMaxWidth
            = function()
        {
            return _getComponentMaxWidth( 'headers' );
        };

        var _setHeadersMaxHeight
            = function( height )
        {
            _setComponentMaxHeight( 'headers', height );
        };

        var _getHeadersMaxHeight
            = function()
        {
            return _getComponentMaxHeight( 'headers' );
        };

        var _setHeadersStyle
            = function( style )
        {
            _setComponentStyle( 'headers' );
        };

        var _getHeadersStyle
            = function()
        {
            return _getComponentStyle( 'headers' );
        };

        var _writeHeadersStyle
            = function( style )
        {
            _writeComponentStyle( 'headers', style );
        };

        var _readHeadersStyle
            = function()
        {
            return _readComponentStyle( 'headers' );
        };

        var _saveHeadersStyle
            = function()
        {
            _saveComponentStyle( 'headers' );
        };

        var _saveAndWriteHeadersStyle
            = function( style )
        {
            _saveAndWriteComponentStyle( 'headers', style );
        };

        var _restoreHeadersStyle
            = function()
        {
            _restoreComponentStyle( 'headers' );
        };

        // < aliases for setting/getting headers' data
        // ·························································································


        // ·························································································
        // > extra methods for headers

        var _setHeadersWidths
            = function( widths )
        {
            components.$headers.each( function ( num )
            {
                if ( 'undefined' != typeof widths[ num ] )
                {
                    $( this ).width( widths[ num ] );
                }
            } );
            settings.headers._applied.widths = widths;
        };

        var _getHeadersWidths
            = function( num )
        {
            if ( 'undefined' == typeof num )
            {
                return settings.headers._applied.widths;
            }
            else
            {
                return _getHeadersWidths()[ num ];
            }
        };

        // < extra methods for headers
        // ·························································································


        // ·························································································
        // > aliases for setting/getting databoxes' data

        var _setDataboxesWidth
            = function( width )
        {
            _setComponentWidth( 'databoxes', width );
        };

        var _getDataboxesWidth
            = function()
        {
            return _getComponentWidth( 'databoxes' );
        };

        var _setDataboxesHeight
            = function( height )
        {
            _setComponentHeight( 'databoxes', height );
        };

        var _getDataboxesHeight
            = function()
        {
            return _getComponentHeight( 'databoxes' );
        };

        var _setDataboxesMaxWidth
            = function( width )
        {
            _setComponentMaxWidth( 'databoxes', width );
        };

        var _getDataboxesMaxWidth
            = function()
        {
            return _getComponentMaxWidth( 'databoxes' );
        };

        var _setDataboxesMaxHeight
            = function( height )
        {
            _setComponentMaxHeight( 'databoxes', height );
        };

        var _getDataboxesMaxHeight
            = function()
        {
            return _getComponentMaxHeight( 'databoxes' );
        };

        var _setDataboxesStyle
            = function( style )
        {
            _setComponentStyle( 'databoxes', style );
        };

        var _getDataboxesStyle
            = function()
        {
            return _getComponentStyle( 'databoxes' );
        };

        var _writeDataboxesStyle
            = function( style )
        {
            _writeComponentStyle( 'databoxes', style );
        };

        var _readDataboxesStyle
            = function()
        {
            return _readComponentStyle( 'databoxes' );
        };

        var _saveDataboxesStyle
            = function()
        {
            _saveComponentStyle( 'databoxes' );
        };

        var _saveAndWriteDataboxesStyle
            = function( style )
        {
            _saveAndWriteComponentStyle( 'databoxes', style );
        };

        var _restoreDataboxesStyle
            = function()
        {
            _restoreComponentStyle( 'databoxes' );
        };

        // < aliases for setting/getting databoxes' data
        // ·························································································


        // << setters and getters en masse
        // -----------------------------------------------------------------------------------------


        // -----------------------------------------------------------------------------------------
        // >> helpers to analyze and initialize

        var _splitClassList
            = function( classList )
        {
            return classList.split( /[^\w\d\.\-\_]+/ );
        }; // var _splitClassList = function( classList )


        var _px2number
            = function( val )
        {
            if ( 'number' == typeof val )
            {
                return val;
            }
            var foo = val.replace( /^([+-]?\d+(?:\.\d+)?)px$/, '\1' );
            var bar = parseInt( foo, 10 );
            if ( bar == foo ) {
                return bar;
            }
            return false;
        }; // var _px2number = function( val )


        var _scanComponents
            = function( settingsName, $components )
        {
            if ( _settingsNameExists( settingsName ) )
            {
                var componentsName = _settings2componentsName( settingsName );
                $components = $components ? $components : components[ componentsName ];

                var scanResult =
                {
                    'count'         : $components.size(),
                    'size'          :
                    {
                        'minWidth'      : false,
                        'maxWidth'      : false,
                        'minHeight'     : false,
                        'maxHeight'     : false
                    },
                    'items'         : []
                };

                $components.each( function ( num )
                {
                    var $this = $( this );
                    var width = $this.outerWidth();
                    var height = $this.outerHeight();

                    if ( false === scanResult.size.minWidth
                        || scanResult.size.minWidth > width )
                    {
                        scanResult.size.minWidth = width;
                    }
                    if ( false === scanResult.size.maxWidth
                        || scanResult.size.maxWidth < width )
                    {
                        scanResult.size.maxWidth = width;
                    }
                    if ( false === scanResult.size.minHeight
                        || scanResult.size.minHeight > height )
                    {
                        scanResult.size.minHeight = height;
                    }
                    if ( false === scanResult.size.maxHeight
                        || scanResult.size.maxHeight < height )
                    {
                        scanResult.size.maxHeight = height;
                    }

                    scanResult.items[ num ] =
                    {
                        'size'     :
                        {
                            'width'     : width,
                            'height'    : height
                        }
                    };
                } );

                return scanResult;
            }
            return false;
        }; // var _scanComponents = function( $components ) {


        var _findComponents
            = function( $container )
        {
            components.$container    = $container;
            components.$headers      = $(
                settings.headers.selector,
                components.$container
            );
            components.$databoxes    = $(
                settings.databoxes.selector,
                components.$container
            );

            for ( var i in components ) {
                components[ i ].data( _NSPC_, self );
            }
        }; // var _findComponents = function( $container )


        var _applyCssToComponents
            = function()
        {
            var settingsNames = [ 'container', 'headers', 'databoxes' ];
            for ( var i in settingsNames )
            {
                var settingsName = settingsNames[ i ];
                components[ _settings2componentsName( settingsName ) ].css( settings[ settingsName ].style );
            }
        }; // var _applyCssToComponents = function()


        var _applyClassesToComponents
            = function()
        {
            var settingsNames = [ 'container', 'headers', 'databoxes' ];
            for ( var i in settingsNames )
            {
                var settingsName = settingsNames[ i ];
                var componentsName = _settings2componentsName( settingsName );
                var classesToAdd = _splitClassList(
                    settings[ settingsName ].classesToAdd
                ).join( ' ' );

                components[ componentsName ].addClass(
                    classesToAdd + ' ' + settings[ settingsName ].classToAdd
                );
            }
        }; // var _applyCssToComponents = function()


        var _initializeSettings
            = function( options )
        {
            var settingsNames = [ 'container', 'headers', 'databoxes' ];

            settings = $.extend( true, {}, defaultOptions, options, settings );

            for ( var i in settingsNames )
            {
                var settingsName = settingsNames[ i ];

                settings[ settingsName ]._applied =
                {
                    'classesToAdd'          : null,
                    'style'                 : null,
                    'width'                 : null,
                    'height'                : null,
                    'size'                  : null
                };

                if ( 'container' != settingsName )
                {
                    settings[ settingsName ]._applied[ 'classesToAddActive' ] = null;
                }
            }
        }; // var _initializeSettings = function( options )


        var _scanalyzeComponent
            = function( settingsName, resultsCallback )
        {
            if ( _settingsNameExists( settingsName ) )
            {
                _saveAndWriteComponentStyle( settingsName, settings[ settingsName ].styleBeforeScan );

                var componentsName = _settings2componentsName( settingsName );

                var results =
                {
                    'classesToAdd'          : _splitClassList(
                        settings[ settingsName ].classesToAdd
                    ),
                    'width'                 : settings[ settingsName ].width,
                    'height'                : settings[ settingsName ].height,
                    'size'                  :
                    {
                        'width'                 : components[ componentsName ].outerWidth(),
                        'height'                : components[ componentsName ].outerHeight()
                    }
                };

                if ( 'function' == typeof resultsCallback ) {
                    results = resultsCallback.call( this, settingsName, results );
                }

                $.extend( true, settings[ settingsName ]._applied, results );

                _restoreComponentStyle( settingsName );
            }
        }; // var _scanalyzeComponent = function( settingsName, resultsCallback )


        var _processComponentsResults
            = function( settingsName, componentsResults )
        {
            if ( _settingsNameExists( settingsName ) )
            {
                var componentsName = _settings2componentsName( settingsName );
                var scanResult = _scanComponents( settingsName );

                var results =
                {
                    'count'                 : scanResult.count,
                    'classesToAddActive'    : _splitClassList(
                        settings[ settingsName ].classesToAddActive
                    ),
                    'size'                  : scanResult.size
                };

                delete componentsResults.size.width;
                delete componentsResults.size.height;

                status[ settingsName ] = scanResult.items;
                components[ componentsName ].each( function( num )
                {
                    var data =
                    {
                        'num'           : num,
                        'data'          : status[ settingsName ][ num ]
                    };
                    $( this ).data( _DATA_, data );
                } );

                return $.extend( true, componentsResults, results );
            }
        }; // var _processComponentsResults = function( settingsName, componentsResults )


        var _applyContainerDimensions
            = function( onlyfixed )
        {
            var val = _px2number( settings.container.width );
            if ( false !== val )
            {
                _setContainerWidth( val );
            }
            else if ( !onlyfixed && 'auto' == settings.container.width )
            {
                _setContainerWidth( Math.max( _getHeadersMaxWidth(), _getDataboxesMaxWidth() ) );
            }

            var val = _px2number( settings.container.height );
            if ( false !== val )
            {
                _setContainerHeight( val );
            }
            else if ( !onlyfixed && 'auto' == settings.container.height )
            {
                _setContainerHeight( _getHeadersMaxHeight() + _getDataboxesMaxHeight() );
            }
        }; // var _applyContainerDimensions = function( onlyfixed )


        var _applyHeadersDimensions
            = function( onlyfixed )
        {
            var val = _px2number( settings.headers.width );
            if ( false !== val )
            {
                _setHeadersWidth( val );
            }
            else if ( 'max' == settings.headers.width )
            {
                _setHeadersWidth( _getHeadersMaxWidth() );
            }
            else if ( !onlyfixed && 'auto' == settings.headers.width )
            {
                var widths = [];
                for ( var i in status.headers )
                {
                    widths.push( status.headers[ i ].size.width );
                }
                _setHeadersWidths( widths );
            }

            var val = _px2number( settings.headers.height );
            if ( false !== val )
            {
                _setHeadersHeight( val );
            }
            else if ( 'max' == settings.headers.height )
            {
                _setHeadersHeight( _getHeadersMaxHeight() );
            }
            else if ( !onlyfixed && 'auto' == settings.headers.height )
            {
                _setHeadersHeight( _getHeadersMaxHeight() );
            }
        }; // var _applyHeadersDimensions = function( onlyfixed )


        var _applyDataboxesDimensions
            = function( onlyfixed )
        {
            var val = _px2number( settings.databoxes.width );
            if ( false !== val )
            {
                _setDataboxesWidth( val );
            }
            else if ( 'max' == settings.databoxes.width )
            {
                _setDataboxesWidth( _getDataboxesMaxWidth() );
            }
            else if ( !onlyfixed && 'auto' == settings.databoxes.width )
            {
                _setDataboxesWidth( _getContainerWidth() );
            }

            var val = _px2number( settings.databoxes.height );
            if ( false !== val )
            {
                _setDataboxesHeight( val );
            }
            else if ( 'max' == settings.databoxes.height )
            {
                _setDataboxesHeight( _getDataboxesMaxHeight() );
            }
            else if ( !onlyfixed && 'auto' == settings.databoxes.height )
            {
                _setDataboxesHeight( _getContainerHeight() - _getHeadersHeight() );
            }
        }; // var _applyDataboxesDimensions = function( onlyfixed )


        var _applyDimensionsFinally
            = function()
        {
            _applyHeadersDimensions( true );
            _applyDataboxesDimensions( true );
            _applyContainerDimensions();
            _applyHeadersDimensions();
            _applyDataboxesDimensions();
        }; // var _applyDimensionsFinally = function( onlyfixed )Finally


        var _positioningComponents
            = function()
        {
            var settingsName = 'headers';
            var componentsName = _settings2componentsName( settingsName );
            components[ componentsName ].each( function( num ) {
                var $this = $( this );

                var width = status[ settingsName ][ num ].size.width;

                $this.css( {
                    'top'           : 0,
                    'left'          : _getContainerWidth() * ( num + 0.5 ) - width/2
                } );

            } );

            var settingsName = 'databoxes';
            var componentsName = _settings2componentsName( settingsName );
            components[ componentsName ].each( function( num ) {
                var $this = $( this );

                var width = status[ settingsName ][ num ].size.width;

                $this.css( {
                    'top'           : _getHeadersHeight(),
                    'left'          : _getContainerWidth() * ( num )
                } );

            } );

        }; // var _positioningComponents = function( onlyfixed )Finally


        var _updateEventHandler
            = function()
        {
            var bindDraggingHandler = false;

            if ( settings.headers.clickable )
            {
                components.$headers
                    .unbind( 'click' + _NSPC_ )
                    .bind( 'click' + _NSPC_, _clickHeader );
            }

            if ( settings.headers.draggable )
            {
                components.$headers
                    .unbind( 'mousedown' + _NSPC_ )
                    .bind( 'mousedown' + _NSPC_, _startDragHeader );

                bindDraggingHandler = true;
            }

            if ( settings.databoxes.draggable )
            {
                components.$databoxes
                    .unbind( 'mousedown' + _NSPC_ )
                    .bind( 'mousedown' + _NSPC_, _startDragDatabox );
                $( '*', components.$databoxes )
                    .unbind( 'click' + _NSPC_ )
                    .bind( 'click' + _NSPC_, _clickDataboxChild );

                //$( 'a' ).bind( 'click', function(e) { e.preventDefault();return false;} );

                bindDraggingHandler = true;
            }

            if ( bindDraggingHandler )
            {
                var $document = $( document );
                $document
                    .unbind( 'mouseup' + _UNSPC_ )
                    .bind( 'mouseup' + _UNSPC_, _documentMouseUp );
                $document
                    .unbind( 'mousemove' + _UNSPC_ )
                    .bind( 'mousemove' + _UNSPC_, _documentMouseMove );
            }

            components.$container
                .unbind( 'scroll' + _NSPC_ )
                .bind( 'scroll' + _NSPC_, _scrollContainer );
        }; // var _updateEventHandler = function( onlyfixed )Finally

        // << helpers to analyze and initialize
        // -----------------------------------------------------------------------------------------


        // -----------------------------------------------------------------------------------------
        // >> callbacks for events handler

        var _scrollContainer
            = function( e )
        {
            setPos( $( this ).scrollLeft() );
        }; // var _scrollContainer = function( e )


        var _clickHeader
            = function( e )
        {
            if ( status.draggingHeader.dragged )
            {
                return;
            }

            var data = $( this ).data( _DATA_ );

            goTo( data.num, true );

            if ( settings.headers.preventClickEvent )
            {
                e.stopPropagation();
                e.preventDefault();
                return false;
            }
        }; // var _clickHeader = function( e )


        var _clickDataboxChild
            = function( e )
        {
            if ( !status.draggingDatabox.dragged )
            {
                return;
            }

            if ( settings.databoxes.preventDragEvent )
            {
                e.stopPropagation();
                e.preventDefault();
                return false;
             }
        }; // var _clickDatabox = function( e )


        var _startDragHeader
            = function( e )
        {
            status.draggingHeader.active = true;
            status.draggingHeader.startEvent = e;
            status.draggingHeader.initialPos = getPos();
            status.draggingHeader.dragged = false;

            if ( settings.headers.preventDragEvent )
            {
                e.stopPropagation();
                e.preventDefault();
                return false;
            }
        }; // var _startDragHeader = function( e )


        var _startDragDatabox
            = function( e )
        {
            status.draggingDatabox.active = true;
            status.draggingDatabox.startEvent = e;
            status.draggingDatabox.initialPos = getPos();
            status.draggingDatabox.dragged = false;

            if ( settings.databoxes.preventDragEvent )
            {
                e.stopPropagation();
                e.preventDefault();
                return false;
            }
        }; // var _startDragDatabox = function( e )


        var _documentMouseUp
            = function( e )
        {
            var preventDragEvent = false;

            if ( status.draggingHeader.active )
            {
                status.draggingHeader.active = false;
                if ( settings.headers.preventDragEvent )
                {
                    preventDragEvent = true;
                }
            }

            if ( status.draggingDatabox.active )
            {
                status.draggingDatabox.active = false;
                if ( settings.databoxes.preventDragEvent )
                {
                    preventDragEvent = true;
                }
            }

            if ( preventDragEvent )
            {
                e.stopPropagation();
                e.preventDefault();
                return false;
            }

        }; // var _documentMouseUp = function( e )


        var _documentMouseMove
            = function( e )
        {
            var preventDragEvent = false;

            if ( status.draggingHeader.active )
            {
                var delta = status.draggingHeader.startEvent.screenX - e.screenX;

                if ( 0 != delta )
                {
                    if ( !status.draggingHeader.dragged )
                    {
                        _startDragHeader( e );
                    }
                    status.draggingHeader.dragged = true;
                    stop();
                }

                setPos( status.draggingHeader.initialPos + delta );

                if ( settings.headers.preventDragEvent )
                {
                    preventDragEvent = true;
                }
            }

            if ( status.draggingDatabox.active )
            {
                var deltaV = status.draggingDatabox.startEvent.screenY - e.screenY;
                var delta = status.draggingDatabox.startEvent.screenX - e.screenX;

                if ( 0 != delta )
                {
                    if ( !status.draggingDatabox.dragged )
                    {
                        _startDragDatabox( e );
                    }
                    status.draggingDatabox.dragged = true;
                    status.draggingDatabox.maxDist = 0;
                    stop();
                }

                status.draggingDatabox.maxDist = Math.max(
                    Math.abs( delta ),
                    status.draggingDatabox.maxDist
                );

                if ( 10 < Math.abs( deltaV ) && 10 > status.draggingDatabox.maxDist )
                {
                    status.draggingDatabox.active = false;
                }


                setPos( status.draggingDatabox.initialPos + delta );

                if ( settings.databoxes.preventDragEvent )
                {
                    preventDragEvent = true;
                }
            }

            if ( preventDragEvent )
            {
                e.stopPropagation();
                e.preventDefault();
                return false;
            }

        }; // var _documentMouseMove = function( e )

        // << callbacks for events handler
        // -----------------------------------------------------------------------------------------


        // <<<< THE "PRIVATES" <<<<
        // *****************************************************************************************




        // *****************************************************************************************
        // >>>> THE PUBLIC ONES >>>>


        var init
            = methods.public.init
            = function ( options )
        {
            var $this = this;

            // build the settings object
            _initializeSettings( options );

            // find the components
            _findComponents( $this );

            // apply given styles to the components
            _applyCssToComponents();

            // detect data for the container
            _scanalyzeComponent( 'container' );

            // set container to fixed size, if necessary
            _applyContainerDimensions( true );

            // detect data for headers and databoxes
            _scanalyzeComponent( 'headers', _processComponentsResults );
            _scanalyzeComponent( 'databoxes', _processComponentsResults );

            // add classes to the components and refresh the given styles
            _applyClassesToComponents();
            _applyCssToComponents();

            // set the dimensions of all components
            _applyDimensionsFinally();

            // arrange headers and databoxes
            _positioningComponents();

            // bind event handler
            _updateEventHandler();

            // componenty
            goTo( 0 );

            return $this;
        }; // var init = function ( options )


        var setPos
            = methods.public.setPos
            = function( pos, animated, duration, easing )
        {
            if ( status.activated_setPos || 'number' != typeof pos )
            {
                return;
            }

            animated = ( 'boolean' != typeof animated ) ? false : animated;
            if ( animated )
            {
                easing = ( 'string' != typeof easing ) ? settings.animation.easing : easing;
                duration = ( 'number' != typeof duration && 'string' != typeof duration )
                    ? settings.animation.duration
                    : duration;
                stop();
                var propertyName = _NAME_ + '-rel';
                var currentProperties = {};
                currentProperties[ propertyName ] = 0;
                var properties = {};
                properties[ propertyName ] = 1;
                var startPos = getPos();
                components.$container.css( currentProperties ).animate( properties,
                {
                    'duration'              : duration,
                    'easing'                : easing,
                    'step'                  : function( now, fx )
                    {
                        setPos( startPos + ( pos - startPos ) * now );
                    }
                } );
                return;
            }


            var minPos = 0;
            var maxPos = _getContainerWidth() * ( status.headers.length - 1 );
            pos = Math.min( maxPos, Math.max( minPos, pos ) );

            status.activated_setPos = true;

            status.pos = pos;

            var posmax = pos + _getContainerWidth();

            // calculate numbers of active, next and previous items
            var active = Math.round( pos / _getContainerWidth() );
            active = ( 0 <= active && status.headers.length > active ? active : false );
            var next = ( false !== active && 0 <= active && status.headers.length - 1 > active ? active + 1 : false );
            var prev = ( false !== active && 0 < active && status.headers.length > active ? active - 1 : false );

            var $headers =
            {
                'active'    : ( false !== active ? components.$headers.eq( active ) : false ),
                'prev'      : ( false !== prev ? components.$headers.eq( prev ) : false ),
                'next'      : ( false !== next ? components.$headers.eq( next ) : false )
            };

            var headerWidths =
            {
                'active'    : ( false !== active ? status.headers[ active ].size.width : 0 ),
                'prev'      : ( false !== prev ? status.headers[ prev ].size.width : 0 ),
                'next'      : ( false !== next ? status.headers[ next ].size.width : 0 )
            };

            var headers =
            {
                'active'    :
                {
                    '$'         : false,
                    'width'     : 0,
                    'pos'       : false,
                    'min'       : false,
                    'max'       : false,
                    'deltamin'  : false,
                    'deltamax'  : false
                },
                'prev'      :
                {
                    '$'         : false,
                    'width'     : 0,
                    'pos'       : false,
                    'min'       : false,
                    'max'       : false,
                    'deltamin'  : false,
                    'deltamax'  : false
                },
                'next'      :
                {
                    '$'         : false,
                    'width'     : 0,
                    'pos'       : false,
                    'min'       : false,
                    'max'       : false,
                    'deltamin'  : false,
                    'deltamax'  : false
                }
            };

            if ( false !== active )
            {
                headers.active.$        = components.$headers.eq( active );
                headers.active.width    = status.headers[ active ].size.width;
                headers.active.pos      = _getContainerWidth() * ( active + 0.5 );
                headers.active.min      = headers.active.pos - headerWidths.active / 2;
                headers.active.max      = headers.active.pos + headerWidths.active / 2;
                headers.active.deltamin = pos - headers.active.min;
                headers.active.deltamax = headers.active.max - posmax;
            }

            if ( false !== prev )
            {
                headers.prev.$          = components.$headers.eq( prev );
                headers.prev.width      = status.headers[ prev ].size.width;
                headers.prev.pos        = _getContainerWidth() * ( prev + 0.5 );
                headers.prev.min        = headers.prev.pos - headerWidths.prev / 2;
                headers.prev.max        = headers.prev.pos + headerWidths.prev / 2;
                headers.prev.deltamin   = pos - headers.prev.min;
                headers.prev.deltamax   = headers.prev.max - posmax;
            }

            if ( false !== next )
            {
                headers.next.$          = components.$headers.eq( next );
                headers.next.width      = status.headers[ next ].size.width;
                headers.next.pos        = _getContainerWidth() * ( next + 0.5 );
                headers.next.min        = headers.next.pos - headerWidths.next / 2;
                headers.next.max        = headers.next.pos + headerWidths.next / 2;
                headers.next.deltamin   = pos - headers.next.min;
                headers.next.deltamax   = headers.next.max - posmax;
            }

            var pos2use = headers.active.pos;
            if ( 0 < headers.active.deltamin || 0 < headers.active.deltamax )
            {
                //if ( headerwidth < _getContainerWidth() ) {
                    if ( 0 < headers.active.deltamin )
                    {
                        var overlap = ( headers.active.width
                                        + headers.next.width
                                        + settings.headers.gapSize
                                        - _getContainerWidth() ) / 2;
                        var shift = 0 < overlap
                                        ? headers.active.deltamin < overlap
                                            ? 0 : headers.active.deltamin - overlap
                                        : headers.active.deltamin;
                        pos2use = headers.active.pos + shift;
                    }
                    else if ( 0 < headers.active.deltamax )
                    {
                        var overlap = ( headers.active.width
                                        + headers.prev.width
                                        + settings.headers.gapSize
                                        - _getContainerWidth() ) / 2;
                        var shift = 0 < overlap
                                        ? headers.active.deltamax < overlap
                                            ? 0 : headers.active.deltamax - overlap
                                        : headers.active.deltamax;
                        pos2use = headers.active.pos - shift;
                    }
                //}
            }
            //pos2use -= headers.active.width/2;


            var spaceBehind = posmax - ( pos2use + headers.active.width / 2 )
                                - settings.headers.gapSize;
            var spaceBefore = ( pos2use - headers.active.width / 2 ) - pos
                                - settings.headers.gapSize;

            var pos2useNext = headers.next.pos;
            if ( 0 < headers.next.deltamax )
            {
                var shift = headers.next.deltamax
                                - ( spaceBehind < headers.next.width
                                        ? headers.next.width - spaceBehind
                                        : 0 );
                pos2useNext = headers.next.pos - shift;
            }
            //pos2useNext -= headers.next.width/2;

            var pos2usePrev = headers.prev.pos;
            if ( 0 < headers.prev.deltamin )
            {
                var shift = headers.prev.deltamin
                                - ( spaceBefore < headers.prev.width
                                        ? headers.prev.width - spaceBefore
                                        : 0 );
                pos2usePrev = headers.prev.pos + shift;
            }
            //pos2usePrev -= headers.prev.width/2;


            if ( headers.active.$ )
            {
                headers.active.$.css(
                {
                    'left'          : pos2use - headers.active.width / 2
                } );
            }

            if ( headers.next.$ )
            {
                headers.next.$.css(
                {
                    'left'          : pos2useNext - headers.next.width / 2
                } );
            }

            if ( headers.prev.$ )
            {
                headers.prev.$.css(
                {
                    'left'          : pos2usePrev - headers.prev.width / 2
                } );
            }

            components.$container.scrollLeft( pos );

            var $otherheaders = components.$headers.not( headers.active.$ );
            var classNames = settings.headers._applied.classesToAddActive.join( ' ' );
            $otherheaders.removeClass( classNames );
            headers.active.$.addClass( classNames );



            status.activated_setPos = false;

        }; // var setPos = function( pos, animated, duration, easing )


        var getPos
            = methods.public.getPos
            = function()
        {
            return status.pos;
        }; // var getPos = function()


        var stop
            = methods.public.stop
            = function()
        {
            components.$container.stop();
        }; // var stop = function()


        var count
            = methods.public.count
            = function()
        {
            return Math.max( status.headers.length, status.databoxes.length );
        }; // var count = function()


        var maxPos
            = methods.public.maxPos
            = function()
        {
                return ( count() - 1 ) * _getContainerWidth();
        }; // var maxPos = function()


        var goToFirst
            = methods.public.goToFirst
            = function( animated, duration, easing )
        {
            goTo( 0, animated, duration, easing );
        }; // var goToFirst = function( animated, duration, easing )


        var goToLast
            = methods.public.goToLast
            = function( animated, duration, easing )
        {
            goTo( count() - 1, animated, duration, easing );
        }; // var goToLast = function( animated, duration, easing )


        var goToPrev
            = methods.public.goToPrev
            = function( dontround, animated, duration, easing )
        {
            goTo( getCurrentNum( dontround ) - 1, animated, duration, easing );
        }; // var goToPrev = function( animated, duration, easing )


        var goToNext
            = methods.public.goToNext
            = function( dontround, animated, duration, easing )
        {
            goTo( getCurrentNum( dontround ) + 1, animated, duration, easing );
        }; // var goToNext = function( animated, duration, easing )


        var goTo
            = methods.public.goTo
            = function( num, animated, duration, easing )
        {
            if ( 'number' != typeof num ) {
                return;
            }

            setPos( _getContainerWidth() * num, animated, duration, easing );
        }; // var goTo = function( num, animated, duration, easing )


        var getCurrentNum
            = methods.public.getCurrentNum
            = function( dontround )
        {
            var currentNum = getPos() / _getContainerWidth();
            if ( 'boolean' != typeof dontround || !dontround )
            {
                currentNum = Math.round( currentNum );
            }
            return currentNum;
        }; // var getCurrentNum = function()



        var getDefaultOptions
            = methods.public.getDefaultOptions
            = function ()
        {
            return defaultOptions;
        }; // var getDefaultOptions = function ()


        var getSettings
            = methods.public.getSettings
            = function ()
        {
            return settings;
        }; // var getSettings = function ()


        // <<<< THE PUBLIC ONES <<<<
        // *****************************************************************************************
    } // function baseplugin()

    // <<<< THE PLUGIN CLASS ITSELF <<<<
    // *********************************************************************************************


    // *********************************************************************************************
    // >>>> PLUG IN THE PLUGIN >>>>

    $.fn.dlsldr = function( method )
    {
        var $this = this;

        var firstreturn = null;

        var args = arguments;

        $this.each( function ()
        {
            var $this = $( this );

            var plugin = $this.data( _NSPC_ );
            if ( 'undefined' == typeof plugin )
            {
                plugin = new baseplugin();
                $this.data( _NSPC_, plugin );
            }

            if ( plugin.methods.public[ method ] )
            {
                var ret = plugin.methods.public[ method ].apply( $this, Array.prototype.slice.call( args, 1 ) );
                firstreturn = ( null !== firstreturn ) ? firstreturn : ret;
            }
            else if ( 'object' == typeof method || !method )
            {
                var ret = plugin.methods.public.init.apply( $this, args );
                firstreturn = ( null !== firstreturn ) ? firstreturn : ret;
            } else {
                $.error( 'Method ' +  method + ' does not exist on jQuery.' + _NAME_ );
            }
        } );

        return firstreturn;
    }; // $.fn.dlsldr = function( method )

    // <<<< PLUG IN THE PLUGIN <<<<
    // *********************************************************************************************
}
( jQuery ) );