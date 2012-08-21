
/**
 * A simple slider for html definition lists (<dl>…</dl>)
 *
 * @name dlsldr
 * @version 0.0.1
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

    function baseplugin ()
    {

        var _UNSPC_ = _NSPC_ + ( new Date() ).getTime() + Math.round( ( new Date() ).getTime() * Math.random() );

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
                'style'                 : {}                // some styles to be initially applied
                                                            // to each databox
            },
            'animation'             :
            {
                'delay'                 : '',               // the delay of the animated transition
                                                            // allowed values: number >= 0, string
                                                            // all jQuery delays are possible here
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
                    //'margin'                : '0',
                    'position'              : 'absolute',
                    'top'                   : '0',
                    'left'                  : '0'/*,
                    'box-sizing'            : 'border-box'*/
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
                    //'margin'                : '0',
                    'position'              : 'absolute'/*,
                    'box-sizing'            : 'border-box'*/
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


        // helper object to organize the parts, i.e. the involved DOM objects
        var parts =
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
        // > pattern for setting/getting parts data

        var _parts2settingsName
            = methods.private.part2settingsName
            = function( partsName )
        {
            var partsNames =
            {
                '$container'        : 'container',
                '$headers'          : 'headers',
                '$databoxes'        : 'databoxes'
            };

            return partsNames[ partsName ]
                ? partsNames[ partsName ]
                : false;
        };


        var _settings2partsName
            = methods.private.settings2partsName
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


        var _partsNameExists
            = methods.private.partsNameExists
            = function( partsName )
        {
            return _parts2settingsName( partsName ) != false;
        };


        var _settingsNameExists
            = methods.private.settingsNameExists
            = function( settingsName )
        {
            return _settings2partsName( settingsName ) != false;
        };


        var _setPartWidth
            = methods.private.setPartWidth
            = function( settingsName, width )
        {
            if ( _settingsNameExists( settingsName ) )
            {
                var ow = parts[ _settings2partsName( settingsName ) ].outerWidth();
                var iw = parts[ _settings2partsName( settingsName ) ].width();
                var dw = ow - iw;

                parts[ _settings2partsName( settingsName ) ].width(
                    ( settings[ settingsName ]._applied.width = width ) - dw
                );
            }
        };


        var _getPartWidth
            = methods.private.getPartWidth
            = function( settingsName )
        {
            return _settingsNameExists( settingsName )
                ? settings[ settingsName ]._applied.width
                : false;
        };


        var _setPartHeight
            = methods.private.setPartHeight
            = function( settingsName, height )
        {
            if ( _settingsNameExists( settingsName ) )
            {
                var oh = parts[ _settings2partsName( settingsName ) ].outerHeight();
                var ih = parts[ _settings2partsName( settingsName ) ].height();
                var dh = oh - ih;

                parts[ _settings2partsName( settingsName ) ].height(
                    ( settings[ settingsName ]._applied.height = height ) - dh
                );
            }
        };


        var _getPartHeight
            = methods.private.getPartHeight
            = function( settingsName )
        {
            return _settingsNameExists( settingsName )
                ? settings[ settingsName ]._applied.height
                : false;
        };


        var _setPartMaxWidth
            = methods.private.setPartMaxWidth
            = function( settingsName, maxWidth )
        {
            if ( _settingsNameExists( settingsName ) )
            {
                parts[ _settings2partsName( settingsName ) ].maxWidth(
                    settings[ settingsName ]._applied.size.maxWidth = maxWidth
                );
            }
        };


        var _getPartMaxWidth
            = methods.private.getPartMaxWidth
            = function( settingsName )
        {
            return _settingsNameExists( settingsName )
                ? settings[ settingsName ]._applied.size.maxWidth
                : false;
        };


        var _setPartMaxHeight
            = methods.private.setPartMaxHeight
            = function( settingsName, maxHeight )
        {
            if ( _settingsNameExists( settingsName ) )
            {
                parts[ _settings2partsName( settingsName ) ].maxHeight(
                    settings[ settingsName ]._applied.size.maxHeight = maxHeight
                );
            }
        };


        var _getPartMaxHeight
            = methods.private.getPartMaxHeight
            = function( settingsName )
        {
            return _settingsNameExists( settingsName )
                ? settings[ settingsName ]._applied.size.maxHeight
                : false;
        };


        var _setPartStyle
            = methods.private.setPartStyle
            = function( settingsName, style )
        {
            if ( _settingsNameExists( settingsName ) )
            {
                _writePartStyle( settingsName, style );
                settings[ settingsName ]._applied.style = _readPartStyle( settingsName );
            }
        };


        var _getPartStyle
            = methods.private.getPartStyle
            = function( settingsName )
        {
            return _settingsNameExists( settingsName )
                ? settings[ settingsName ]._applied.style
                : false;
        };


        var _writePartStyle
            = methods.private.writePartStyle
            = function( settingsName, style )
        {
            if ( _settingsNameExists( settingsName ) )
            {
                if ( 'string' == typeof style )
                {
                    parts[ _settings2partsName( settingsName ) ].attr( 'style', style );
                }
                else if ( 'object' == typeof style )
                {
                    parts[ _settings2partsName( settingsName ) ].css( style );
                }
            }
        };


        var _readPartStyle
            = methods.private.readPartStyle
            = function( settingsName )
        {
            if ( _settingsNameExists( settingsName ) ) {
                var style = parts[ _settings2partsName( settingsName ) ].attr( 'style' );
            }
            return style ? style : '';
        };


        var _savePartStyle
            = methods.private.savePartStyle
            = function( settingsName )
        {
            if ( _settingsNameExists( settingsName ) )
            {
                settings[ settingsName ]._applied.style = _readPartStyle( settingsName );
            }
        };


        var _saveAndWritePartStyle
            = methods.private.savePartStyle
            = function( settingsName, style )
        {
            if ( _settingsNameExists( settingsName ) )
            {
                _savePartStyle( settingsName );
                _writePartStyle( settingsName, style );
            }
        };


        var _restorePartStyle
            = methods.private.restorePartStyle
            = function( settingsName )
        {
            if ( _settingsNameExists( settingsName ) ) {
                _setPartStyle( settingsName, _getPartStyle( settingsName ) );
            }
        };

        // < pattern for setting/getting parts data
        // ·························································································

        // ·························································································
        // > aliases for setting/getting container's data

        var _setContainerWidth
            = methods.private.setContainerWidth
            = function( width )
        {
            _setPartWidth( 'container', width );
        };

        var _getContainerWidth
            = methods.private.getContainerWidth
            = function()
        {
            return _getPartWidth( 'container' );
        };

        var _setContainerHeight
            = methods.private.setContainerHeight
            = function( height )
        {
            _setPartHeight( 'container', height );
        };

        var _getContainerHeight
            = methods.private.getContainerHeight
            = function()
        {
            return _getPartHeight( 'container' );
        };

        var _setContainerStyle
            = methods.private.setContainerStyle
            = function( style )
        {
            _setPartStyle( 'container', style );
        };

        var _getContainerStyle
            = methods.private.getContainerStyle
            = function()
        {
            return _getPartStyle( 'container' );
        };

        var _writeContainerStyle
            = methods.private.writeContainerStyle
            = function( style )
        {
            _writePartStyle( 'container', style );
        };

        var _readContainerStyle
            = methods.private.readContainerStyle
            = function()
        {
            return _readPartStyle( 'container' );
        };

        var _saveContainerStyle
            = methods.private.saveContainerStyle
            = function()
        {
            _savePartStyle( 'container' );
        };

        var _saveAndWriteContainerStyle
            = methods.private.saveContainerStyle
            = function( style )
        {
            _saveAndWritePartStyle( 'container', style );
        };

        var _restoreContainerStyle
            = methods.private.restoreContainerStyle
            = function()
        {
            _restorePartStyle( 'container' );
        };

        // < aliases for setting/getting container's data
        // ·························································································


        // ·························································································
        // > aliases for setting/getting headers' data

        var _setHeadersWidth
            = methods.private.setHeadersWidth
            = function( width )
        {
            _setPartWidth( 'headers', width );
        };

        var _getHeadersWidth
            = methods.private.getHeadersWidth
            = function()
        {
            return _getPartWidth( 'headers' );
        };

        var _setHeadersHeight
            = methods.private.setHeadersHeight
            = function( height )
        {
            _setPartHeight( 'headers', height );
        };

        var _getHeadersHeight
            = methods.private.getHeadersHeight
            = function()
        {
            return _getPartHeight( 'headers' );
        };

        var _setHeadersMaxWidth
            = methods.private.setHeadersMaxWidth
            = function( width )
        {
            _setPartMaxWidth( 'headers', width );
        };

        var _getHeadersMaxWidth
            = methods.private.getHeadersMaxWidth
            = function()
        {
            return _getPartMaxWidth( 'headers' );
        };

        var _setHeadersMaxHeight
            = methods.private.setHeadersMaxHeight
            = function( height )
        {
            _setPartMaxHeight( 'headers', height );
        };

        var _getHeadersMaxHeight
            = methods.private.getHeadersMaxHeight
            = function()
        {
            return _getPartMaxHeight( 'headers' );
        };

        var _setHeadersStyle
            = methods.private.setHeadersStyle
            = function( style )
        {
            _setPartStyle( 'headers' );
        };

        var _getHeadersStyle
            = methods.private.getHeadersStyle
            = function()
        {
            return _getPartStyle( 'headers' );
        };

        var _writeHeadersStyle
            = methods.private.writeHeadersStyle
            = function( style )
        {
            _writePartStyle( 'headers', style );
        };

        var _readHeadersStyle
            = methods.private.readHeadersStyle
            = function()
        {
            return _readPartStyle( 'headers' );
        };

        var _saveHeadersStyle
            = methods.private.saveHeadersStyle
            = function()
        {
            _savePartStyle( 'headers' );
        };

        var _saveAndWriteHeadersStyle
            = methods.private.saveHeadersStyle
            = function( style )
        {
            _saveAndWritePartStyle( 'headers', style );
        };

        var _restoreHeadersStyle
            = methods.private.restoreHeadersStyle
            = function()
        {
            _restorePartStyle( 'headers' );
        };

        // < aliases for setting/getting headers' data
        // ·························································································


        // ·························································································
        // > extra methods for headers

        var _setHeadersWidths
            = methods.private.setHeadersWidths
            = function( widths )
        {
            parts.$headers.each( function ( num )
            {
                if ( 'undefined' != typeof widths[ num ] )
                {
                    $( this ).width( widths[ num ] );
                }
            } );
            settings.headers._applied.widths = widths;
        };

        var _getHeadersWidths
            = methods.private.getHeadersWidths
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
            = methods.private.setDataboxesWidth
            = function( width )
        {
            _setPartWidth( 'databoxes', width );
        };

        var _getDataboxesWidth
            = methods.private.getDataboxesWidth
            = function()
        {
            return _getPartWidth( 'databoxes' );
        };

        var _setDataboxesHeight
            = methods.private.setDataboxesHeight
            = function( height )
        {
            _setPartHeight( 'databoxes', height );
        };

        var _getDataboxesHeight
            = methods.private.getDataboxesHeight
            = function()
        {
            return _getPartHeight( 'databoxes' );
        };

        var _setDataboxesMaxWidth
            = methods.private.setDataboxesMaxWidth
            = function( width )
        {
            _setPartMaxWidth( 'databoxes', width );
        };

        var _getDataboxesMaxWidth
            = methods.private.getDataboxesMaxWidth
            = function()
        {
            return _getPartMaxWidth( 'databoxes' );
        };

        var _setDataboxesMaxHeight
            = methods.private.setDataboxesMaxHeight
            = function( height )
        {
            _setPartMaxHeight( 'databoxes', height );
        };

        var _getDataboxesMaxHeight
            = methods.private.getDataboxesMaxHeight
            = function()
        {
            return _getPartMaxHeight( 'databoxes' );
        };

        var _setDataboxesStyle
            = methods.private.setDataboxesStyle
            = function( style )
        {
            _setPartStyle( 'databoxes', style );
        };

        var _getDataboxesStyle
            = methods.private.getDataboxesStyle
            = function()
        {
            return _getPartStyle( 'databoxes' );
        };

        var _writeDataboxesStyle
            = methods.private.writeDataboxesStyle
            = function( style )
        {
            _writePartStyle( 'databoxes', style );
        };

        var _readDataboxesStyle
            = methods.private.readDataboxesStyle
            = function()
        {
            return _readPartStyle( 'databoxes' );
        };

        var _saveDataboxesStyle
            = methods.private.saveDataboxesStyle
            = function()
        {
            _savePartStyle( 'databoxes' );
        };

        var _saveAndWriteDataboxesStyle
            = methods.private.saveDataboxesStyle
            = function( style )
        {
            _saveAndWritePartStyle( 'databoxes', style );
        };

        var _restoreDataboxesStyle
            = methods.private.restoreDataboxesStyle
            = function()
        {
            _restorePartStyle( 'databoxes' );
        };

        // < aliases for setting/getting databoxes' data
        // ·························································································


        // << setters and getters en masse
        // -----------------------------------------------------------------------------------------


        // -----------------------------------------------------------------------------------------
        // >> helpers to analyze and initialize

        var _splitClassList
            = methods.private.splitClassList
            = function( classList )
        {
            return classList.split( /[^\w\d\.\-\_]+/ );
        }; // var _splitClassList = function( classList )


        var _px2number
            = methods.private.px2number
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


        var _scanParts
            = methods.private.scanParts
            = function( settingsName, $parts )
        {
            if ( _settingsNameExists( settingsName ) )
            {
                var partsName = _settings2partsName( settingsName );
                $parts = $parts ? $parts : parts[ partsName ];

                var scanResult =
                {
                    'count'         : $parts.size(),
                    'size'          :
                    {
                        'minWidth'      : false,
                        'maxWidth'      : false,
                        'minHeight'     : false,
                        'maxHeight'     : false
                    },
                    'items'         : []
                };

                $parts.each( function ( num )
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
        }; // var _scanParts = function( $parts ) {


        var _findParts
            = methods.private.findParts
            = function( $container )
        {
            parts.$container    = $container;
            parts.$headers      = $(
                settings.headers.selector,
                parts.$container
            );
            parts.$databoxes    = $(
                settings.databoxes.selector,
                parts.$container
            );

            for ( var i in parts ) {
                parts[ i ].data( _NSPC_, self );
            }
        }; // var _findParts = function( $container )


        var _applyCssToParts
            = methods.private.applyCssToParts
            = function()
        {
            var settingsNames = [ 'container', 'headers', 'databoxes' ];
            for ( var i in settingsNames )
            {
                var settingsName = settingsNames[ i ];
                parts[ _settings2partsName( settingsName ) ].css( settings[ settingsName ].style );
            }
        }; // var _applyCssToParts = function()


        var _applyClassesToParts
            = methods.private.applyClassesToParts
            = function()
        {
            var settingsNames = [ 'container', 'headers', 'databoxes' ];
            for ( var i in settingsNames )
            {
                var settingsName = settingsNames[ i ];
                var partsName = _settings2partsName( settingsName );
                var classesToAdd = _splitClassList(
                    settings[ settingsName ].classesToAdd
                ).join( ' ' );

                parts[ partsName ].addClass(
                    classesToAdd + ' ' + settings[ settingsName ].classToAdd
                );
            }
        }; // var _applyCssToParts = function()


        var _initializeSettings
            = methods.private.initializeSettings
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


        var _scanalyzePart
            = methods.private.scanalyzePart
            = function( settingsName, resultsCallback )
        {
            if ( _settingsNameExists( settingsName ) )
            {
                _saveAndWritePartStyle( settingsName, settings[ settingsName ].styleBeforeScan );

                var partsName = _settings2partsName( settingsName );

                var results =
                {
                    'classesToAdd'          : _splitClassList(
                        settings[ settingsName ].classesToAdd
                    ),
                    'width'                 : settings[ settingsName ].width,
                    'height'                : settings[ settingsName ].height,
                    'size'                  :
                    {
                        'width'                 : parts[ partsName ].outerWidth(),
                        'height'                : parts[ partsName ].outerHeight()
                    }
                };

                if ( 'function' == typeof resultsCallback ) {
                    results = resultsCallback.call( this, settingsName, results );
                }

                $.extend( true, settings[ settingsName ]._applied, results );

                _restorePartStyle( settingsName );
            }
        }; // var _scanalyzePart = function( settingsName, resultsCallback )


        var _processPartsResults
            = methods.private.processPartsResults
            = function( settingsName, partsResults )
        {
            if ( _settingsNameExists( settingsName ) )
            {
                var partsName = _settings2partsName( settingsName );
                var scanResult = _scanParts( settingsName );

                var results =
                {
                    'count'                 : scanResult.count,
                    'classesToAddActive'    : _splitClassList(
                        settings[ settingsName ].classesToAddActive
                    ),
                    'size'                  : scanResult.size
                };

                delete partsResults.size.width;
                delete partsResults.size.height;

                status[ settingsName ] = scanResult.items;
                parts[ partsName ].each( function( num )
                {
                    var data =
                    {
                        'num'           : num,
                        'data'          : status[ settingsName ][ num ]
                    };
                    $( this ).data( _DATA_, data );
                } );

                return $.extend( true, partsResults, results );
            }
        }; // var _processPartsResults = function( settingsName, partsResults )


        var _applyContainerDimensions
            = methods.private.applyContainerDimensions
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
            = methods.private.applyHeadersDimensions
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
            = methods.private.applyDataboxesDimensions
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
            = methods.private.applyDimensionsFinally
            = function()
        {
            _applyHeadersDimensions( true );
            _applyDataboxesDimensions( true );
            _applyContainerDimensions();
            _applyHeadersDimensions();
            _applyDataboxesDimensions();
        }; // var _applyDimensionsFinally = function( onlyfixed )Finally


        var _positioningParts
            = methods.private.positioningParts
            = function()
        {
            var settingsName = 'headers';
            var partsName = _settings2partsName( settingsName );
            parts[ partsName ].each( function( num ) {
                var $this = $( this );

                var width = status[ settingsName ][ num ].size.width;

                $this.css( {
                    'top'           : 0,
                    'left'          : _getContainerWidth() * ( num + 0.5 ) - width/2
                } );

            } );

            var settingsName = 'databoxes';
            var partsName = _settings2partsName( settingsName );
            parts[ partsName ].each( function( num ) {
                var $this = $( this );

                var width = status[ settingsName ][ num ].size.width;

                $this.css( {
                    'top'           : _getHeadersHeight(),
                    'left'          : _getContainerWidth() * ( num )
                } );

            } );

        }; // var _positioningParts = function( onlyfixed )Finally


        var _updateEventHandler
            = methods.private.updateEventHandler
            = function()
        {
            if ( settings.headers.clickable )
            {
                parts.$headers
                    .unbind( 'click' + _NSPC_ )
                    .bind( 'click' + _NSPC_, _clickHeader );
            }

            if ( settings.headers.draggable )
            {
                parts.$headers
                    .unbind( 'mousedown' + _NSPC_ )
                    .bind( 'mousedown' + _NSPC_, _startDragHeader );

                var $document = $( document );
                $document
                    .unbind( 'mouseup' + _UNSPC_ )
                    .bind( 'mouseup' + _UNSPC_, _documentMouseUp );
                $document
                    .unbind( 'mousemove' + _UNSPC_ )
                    .bind( 'mousemove' + _UNSPC_, _documentMouseMove );
            }

            parts.$container
                .unbind( 'scroll' + _NSPC_ )
                .bind( 'scroll' + _NSPC_, _scrollContainer );
        }; // var _updateEventHandler = function( onlyfixed )Finally

        // << helpers to analyze and initialize
        // -----------------------------------------------------------------------------------------


        // -----------------------------------------------------------------------------------------
        // >> callbacks for events handler

        var _scrollContainer
            = methods.private.scrollContainer
            = function( e )
        {
            setPos( $( this ).scrollLeft() );
        }; // var _scrollContainer = function( e )


        var _clickHeader
            = methods.private.clickHeader
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


        var _startDragHeader
            = methods.private.startDragHeader
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


        var _documentMouseUp
            = methods.private.documentMouseUp
            = function( e )
        {
            if ( status.draggingHeader.active )
            {
                status.draggingHeader.active = false;
            }
        }; // var _documentMouseUp = function( e )


        var _documentMouseMove
            = methods.private.documentMouseMove
            = function( e )
        {

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
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }
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
            _findParts( $this );

            // apply given styles to the components
            _applyCssToParts();

            // detect data for the container
            _scanalyzePart( 'container' );

            // set container to fixed size, if necessary
            _applyContainerDimensions( true );

            // detect data for headers and databoxes
            _scanalyzePart( 'headers', _processPartsResults );
            _scanalyzePart( 'databoxes', _processPartsResults );

            // add classes to the components and refresh the given styles
            _applyClassesToParts();
            _applyCssToParts();

            // set the dimensions of all components
            _applyDimensionsFinally();

            // arrange headers and databoxes
            _positioningParts();

            // bind event handler
            _updateEventHandler();

            // party
            goTo( 0 );

            return $this;
        }; // var init = function ( options )


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
            parts.$container.stop();
        }; // var stop = function()


        var setPos
            = methods.public.setPos
            = function( pos, animated, delay, easing )
        {
            if ( status.activated_setPos || 'number' != typeof pos )
            {
                return;
            }

            animated = ( 'boolean' != typeof animated ) ? false : animated;
            if ( animated )
            {
                easing = ( 'string' != typeof easing ) ? settings.animation.easing : easing;
                delay = ( 'number' != typeof delay && 'string' != typeof delay )
                    ? settings.animation.delay
                    : delay;
                stop();
                parts.$container.animate(
                {
                    'scrollLeft'            : pos
                }, delay, easing );
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
                'active'    : ( false !== active ? parts.$headers.eq( active ) : false ),
                'prev'      : ( false !== prev ? parts.$headers.eq( prev ) : false ),
                'next'      : ( false !== next ? parts.$headers.eq( next ) : false )
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
                headers.active.$        = parts.$headers.eq( active );
                headers.active.width    = status.headers[ active ].size.width;
                headers.active.pos      = _getContainerWidth() * ( active + 0.5 );
                headers.active.min      = headers.active.pos - headerWidths.active / 2;
                headers.active.max      = headers.active.pos + headerWidths.active / 2;
                headers.active.deltamin = pos - headers.active.min;
                headers.active.deltamax = headers.active.max - posmax;
            }

            if ( false !== prev )
            {
                headers.prev.$          = parts.$headers.eq( prev );
                headers.prev.width      = status.headers[ prev ].size.width;
                headers.prev.pos        = _getContainerWidth() * ( prev + 0.5 );
                headers.prev.min        = headers.prev.pos - headerWidths.prev / 2;
                headers.prev.max        = headers.prev.pos + headerWidths.prev / 2;
                headers.prev.deltamin   = pos - headers.prev.min;
                headers.prev.deltamax   = headers.prev.max - posmax;
            }

            if ( false !== next )
            {
                headers.next.$          = parts.$headers.eq( next );
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

            parts.$container.scrollLeft( pos );

            var $otherheaders = parts.$headers.not( headers.active.$ );
            var classNames = settings.headers._applied.classesToAddActive.join( ' ' );
            $otherheaders.removeClass( classNames );
            headers.active.$.addClass( classNames );

            status.activated_setPos = false;

        }; // var setPos = function( pos, animated, delay, easing )


        var goTo
            = methods.public.goTo
            = function( num, animated, delay, easing )
        {
            if ( 'number' != typeof num ) {
                return;
            }

            setPos( _getContainerWidth() * num, animated, delay, easing );
        }; // var goTo = function( num, animated, delay, easing )


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


    }

    // >>>> THE PLUGIN CLASS ITSELF >>>>
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
                $.error( 'Method ' +  method + ' does not exist on jQuery.dlsldr' );
            }
        } );

        return firstreturn;
    }; // $.fn.dlsldr = function( method )

    // >>>> PLUG IN THE PLUGIN >>>>
    // *********************************************************************************************
}
( jQuery ) );