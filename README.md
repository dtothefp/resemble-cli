## Globally install for good times

```
npm install -g resemble-cli
run-resemble width=500 url=https://www.optimizely.com/ pages=about,contact,resources/sample-size-calculator/,resources/live-demo-webinar,customers,customers/customer-stories screensDir=mobile
```
### Diff your images on GitHub.

`resemble-cli` will compare screenshots, and overwrite previous versions if there was a visual change/mismatch.  This allows you to diff your images on GitHub through their pretty GUI.

### Options

#### screenshotRoot
`screenshotRoot=<name for screenshot directory>`
Default value: `'screenshots'`

The name of the directory that will be created in the root of your application.

#### screensDir
`screensDir=<name for subdirectory inside screenshot directory>`
Default value: `''`

#### url
`url=<some valid url>`
Default value: `'http://optimizely.com/'`

A string value specifying the root url where you would like screenshots taken and paths referenced from.

#### width
`width=<some seemingly reasonable screen width>`
Default value: `1024`

A number specifying the width at which screenshots should be taken.

#### tolerance
`tolerance=<some decimal tolerance>`
Default value: `0`

Mismatch tolerance allowed for overwriting.

#### selector
`selector=<some selector on the page>`
Default value: `body`

Selector for element on the page want the screenshot of, ex: #outer-wrapper.

#### --gm
*Note: If flagged as true ImageMagick or GraphicsMagick must be globally installed on the user's machine via HomeBrew or some other medium*

A flag specifying if you would like to compare screenshots with [GraphicsMagick](http://aheckmann.github.io/gm/). Resemble CLI was created in a way that the user does not have to globally install external dependencies such as PhantomJS, CasperJS, ImageMagick, and GraphicsMagick.  Therefore, default behavior is to compare images using [ResembleJS](http://huddle.github.io/Resemble.js/).  Comparing without GM is a much slower process as Phantom has to fire up a webpage to compare images within using Resemble.

#### --debug
This flag will will run the Phantom child process script in debug mode on port 5000.

If you would like to debug the node task I suggest globally installing node-inspector [build-debug](https://github.com/node-inspector/node-inspector) and running node-debug on the run-resemble.jsscript in the `bin' directory.

###### Mobile
![mobile](https://raw.githubusercontent.com/dtothefp/resemble-cli/master/demo/mobile/home.png)


###### Tablet
![tablet](https://raw.githubusercontent.com/dtothefp/resemble-cli/master/demo/tablet/home.png)


###### Desktop
![desktop](https://raw.githubusercontent.com/dtothefp/resemble-cli/master/demo/desktop/home.png)
