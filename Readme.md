<p align="center"><a href="https://hyderjs.tech" target="_blank" rel="noopener noreferrer"><img width="160" src="lib/logo-sm.png" alt="Hyderjs logo"></a></p>

<p align="center">
    <a href="https://img.shields.io/badge/Maintained-yes-green.svg"><img src="https://img.shields.io/badge/Maintained-yes-green.svg" alt="Maintenance Status" /></a>    
    <a href="https://hyderjs.tech/license/"><img src="https://img.shields.io/badge/license-MIT-brightgreen" alt="GitHub MIT License"/></a>
    <a href=""><img src="https://img.shields.io/badge/stable-v1.0.0-blue" alt="GitHub Release"</a>
    <a href="https://github.com/imprakashraghu/hyderjs/issues"><img alt="Github Issues" src="https://img.shields.io/github/issues/imprakashraghu/hyderjs"><a/>        
</p>

# [HyderJS](https://hyderjs.tech)

Hyder is an javascript library used to build UI for web using JSON 🔥
- Used to create components in the form of json array and then contcate them into a single block.
- Being simple json can be in the form a file or javascript objects to render the interface on web.
- All html dom attributes are supported that anything done in html can be done in hyder.

## Installation
Installing for development is way simple by adding just the cdn link to you html file and following the process gets your brand new website.

**New to web?**
Don't forget to use our [playground service](https://hyderjs.tech/play) to get things so simple.

Add [Hyderjs CDN](https://hyderjs.tech/) and use to create your website as a script tag.

## Documentation
Find the entire documentation of HyderJS on the official [website](https://hyderjs.tech/docs/v1)

This is completely an open sourced javascript library where it is seeking more number of upgrades that you can do [here](https://hyderjs.tech/contribute).

## Quick Tip
We have several components created where you can use those for free on the [website](https://hyderjs.tech/docs/v1).

***To initialize an instance***

```js
    new HyderJS({
        bricks: [...], // entire block
        wall: "root_container_id"
    });
```

***To create a simple block***
```js
    let blocks = [
        {
            type: "text",
            data: {
                className: "custom-classes-here",
                text: "Text Here",
                style: {
                    // styles here
                },
                padding: {
                    y: 1,
                    x: 1
                }
            }
        }
    ];
```

## License
HyderJS is [MIT licensed](https://github.com/imprakashraghu/hyderjs/blob/master/LICENSE).
