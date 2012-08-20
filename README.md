# dlsldr

A simple slider for html data lists (&lt;dl>)

> **Mhh... why I believe this slider is indispensable?**<br/>
> *Well, it doesn't touch your markup, and it's based on the scrolling position of the &lt;dl>-element.*

## Usage

### Markup
```
<dl>
    <dt>title markup</dt>
    <dd>content markup</dd>
    ...
</dl>
```
### Methods

#### Initialization - `init()`
```
jQuery( 'dl' ).dlsldr( [ options ] );
```
Initializes the plugin with the given [options](#default-options) which are explained below.
The [options](#default-options) are optional ;-) so you haven't to configure them.

#### Set the position - `setPos()`
```
jQuery( 'dl' ).dlsldr( 'setPos', pos [, animated [, delay [, easing ] ] ] );
```
This method is the *essence* of the plugin. It sets the current position of the slider and calculates the positioning of the titles.

The mandatory parameter `pos` must be a `number` (please integers) from `0` to `maxPos`, where `maxPos` is build from the width of the slider multiplied with the number of items less one (`maxPos = width * (n - 1)`).

The optional parameter `animated` is a boolean, to decide to animate the position change. By default `animated` is `false`.

The optional parameter `delay` is the same used in jQuery, so you can define a delay for animation in milliseconds or with the jQuery keywords. By default as delay is used the value from the given options. This parameter will be ignored, if `animated` isn't `true`.

The last and also optional parameter `easing` is like the `delay` parameter derived from jQuery. It's a `string` containing a typical name of the easing method to use. By default it uses the value defined by the given options. Also like `delay`, this parameter will be ignored if `animated` isn't `true`.

#### Get the position - `getPos()`
```
var pos = jQuery( 'dl ).dlsldr( 'getPos' );
```
The obligatory pendant to  [`setPos()`](#set-the-position---setpos), to determine the current position. The return value is a `number` from `0`to `maxPos` (for calculation of `maxPos` see [`setPos()`](#set-the-position---setpos) ).

#### Stop an animation - `stop()`
```
jQuery( 'dl' ).dlsldr( 'stop );
```
In the case you've started an animation (for example with [`setPos()`](#set-the-position---setpos)) you can stop it at the current status. It will stop immediately.

#### Get the number of items - `count()`
```
var count = jQuery( 'dl' ).dlsldr( 'count' );
```
Returns the number of items.

#### Get the maximum position - `maxPos()`
```
var maxPos = jQuery( 'dl' ).dlsldr( 'maxPos' );
```
Returns the highest possible value for usage in [`setPos()`](#set-the-position---setpos) and [`getPos()`](#get-the-position---getpos).

#### Go to an specific item - `goTo()`
```
jQuery( 'dl' ).dlsldr( 'goTo', num [, animated [, delay [, easing ] ] ] );
```
Sets the current position of the slider to view an item, specified by its number. This method is a simple wrapper for [`setPos()`](#set-the-position---setpos). Aside from `num`, all parameters are passed to [`setPos()`](#set-the-position---setpos).

#### Go to the first item - `goToFirst()`
```
jQuery( 'dl' ).dlsldr( 'goToFirst', [ animated [, delay [, easing ] ] ] );
```
Sets the current position to zero, so the first item is shown. All parameters are passed to [`goTo()`](#go-to-an-specific-item---goto).

#### Go to the last item - `goToLast()`
```
jQuery( 'dl' ).dlsldr( 'goToLast', [ animated [, delay [, easing ] ] ] );
```
Sets the current position to the maximum, so the last item is shown. All parameters are passed to [`goTo()`](#go-to-an-specific-item---goto).

#### Go to the previous item - `goToPrev()`
```
jQuery( 'dl' ).dlsldr( 'goToPrev', [ dontround [, animated [, delay [, easing ] ] ] ] );
```
Sets the current position to view the previous item. The optional parameter `dontround` has to be a boolean. If it's `false` (it is by default), the slider won't center the previous item automatically. All other parameters are passed to [`goTo()`](#go-to-an-specific-item---goto).

#### Go to the next item - `goToNext()`
```
jQuery( 'dl' ).dlsldr( 'goToNext', [ dontround [, animated [, delay [, easing ] ] ] ] );
```
Sets the current position to view the next item. The optional parameter `dontround` has to be a boolean. If it's `false` (it is by default), the slider won't center the next item automatically. All other parameters are passed to [`goTo()`](#go-to-an-specific-item---goto).

#### Get the current viewed item - `getCurrentNum()`
```
jQuery( 'dl' ).dlsldr( 'getCurrentNum', [ dontround ] );
```
The optional parameter `dontround` has to be a boolean. If it's `false` (it is by default) the result will be an `integer`, otherwise a `floating number`.

#### Get the default options - `getDefaultOptions()`
```
var defaultOptions = jQuery( 'dl' ).dlsldr( 'getDefaultOptions' );
```
Returns an object with the [default options](#default-options).

#### Get the current settings - `getSettings()`
```
var settings = jQuery( 'dl' ).dlsldr( 'getSettings' );
```
Returns an object with the internal settings.


## Configuration

While you [initialize](#initialization---init) the plugin, you can pass an options object.
To get this object, you can call [`getDefaultOptions()`](#get-the-default-options---getdefaultoptions), without the comments, of course ;-)

### Default options
These options are used by default as fallback for missing configurations.
```
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
```