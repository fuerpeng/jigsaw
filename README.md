# Jigsaw

[![npm version](https://badge.fury.io/js/%40rdkmaster%2Fjigsaw.svg)](https://badge.fury.io/js/%40rdkmaster%2Fjigsaw)
[![Build Status](https://travis-ci.org/rdkmaster/jigsaw.svg?branch=master)](https://travis-ci.org/rdkmaster/jigsaw)
[![Coverage Status](https://coveralls.io/repos/github/rdkmaster/jigsaw/badge.svg?branch=master)](https://coveralls.io/github/rdkmaster/jigsaw?branch=master)


## why is this name
Jigsaw is a jigsaw puzzle. The process of the game and the modern web page development process is very similar to the game in accordance with the established blueprint will be messy fragments into a map, we use this name is to allow web page developers to play like Jigsaw game, while playing edge development Your page.

**combination** is Jigsaw's soul, we are committed to the combination of the ultimate.

Once a few components are sorted and arranged in a certain order, you can get an application page, which is a normal combination. We combine this hierarchy as Level I. The combination of Level I treats the component as an atom and can no longer be split.

Jigsaw's component is no longer an atom, it is a secondary abstraction of the functionality of the component, while allowing the component's local height to be customized, and even the components are fully customizable. Small to similar to the `jigsaw-button` such basic components, large to` jigsaw-table` such a giant component, you see almost every UI element, can be combined with other components to cover its default behavior The Atomic components are limited, the combination can produce infinite possibilities. The customization mentioned here, in other words, is another form of combination, and we classify this hierarchy as Level II.

With Jigsaw, enjoy your imagination!


## Usage
### New start
We strongly recommend using [Jigsaw Seed](https://github.com/rdkmaster/jigsaw-seed) as the start of the new project.The specific steps are:
1. If node js is not installed, or if nodejs is less than 6.x.x and npm is less than 3.x.x, install [nodejs](https://nodejs.org) first.
2. [download](https://github.com/rdkmaster/jigsaw-seed/archive/master.zip)or[clone](https://github.com/rdkmaster/jigsaw-seed) Jigsaw Seed source code。Assumed to save to `d: \ jigsaw-seed`。
3. Download the dependency package, execute the following script
```
cd d:\jigsaw-seed
npm config set proxy=http://proxy.zte.com.cn:80                          # Direct command can not execute this command
npm config set registry=https://registry.npm.taobao.org/                 # for Chinese developers only
npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass # for Chinese developers only
npm install -g @angular/cli                                              # Strongly recommended, optional.
npm install
npm start
```
4. Browser open http: // localhost: 4200 If you see the welcome page, said your development environment is completed.
5. Follow the example of running the `npm start` command directly in the` d: \ jigsaw-seed` directory to start the development environment. Jigsaw specifically for the modern IDE to do the code optimization, so that these IDE can accurately prompt more information, saving you read the api document time. We recommend using [WebStorm](https://www.jetbrains.com/webstorm/) as the IDE.

### Integrated into existing projects
[See the specific process here](docs/integrate-your-project-with-jigsaw/index.md)

## Beginners 
[Jigsaw Tourist](https://github.com/rdkmaster/jigsaw-tourist) is a specialized tutorial for beginners, which shows how to use jigsaw from scratch to build a difficult application page.[Click here](docs/tourist/index.md)，bravely take your first step in Jigsaw。

There are any difficulties in getting started, please pay attention to Jigsaw official WeChat public number, where you can join the SOS group and our developers direct dialogue:

![](docs/image/qr-weixin.jpg)

## give me a star！One More Star Please!
Please give a star, this is the best of our encouragement!This is the best encouragement for us.

## Component state diagram
![](comp-map.png)

## Participate in contribution
We believe that the following acts are doing the contribution:
- Silent attention;
- watch/star/fork this project;
- Give us [bug/demand/suggestion](https://github.com/rdkmaster/jigsaw/issues/new)；
- Write us a document, write a small article;
- More effective is to push us PR, all PR we welcome and will be dealt with seriously;
	- give priority to the [issue](https://github.com/rdkmaster/jigsaw/issues) without the `suspend` tag;
	- [here](https://github.com/rdkmaster/jigsaw/blob/master/docs/coding-spec.md) is a simple code specification, please try to keep it;

## Are you planning to change jobs?
Join us, cabbage price to send the city house! Located in Ning Shuang Road Chu Qiaodong east 200m Department. Is not bragging, I am very serious!

- we need to have some experienced web developer, his main responsibility is to join the component library development;
- we need to have some experienced service engineers, his main responsibility is to join the full-time [RDK](https://github.com/rdkmaster/rdk) backend development;
- Details[click here](https://mp.weixin.qq.com/s/GLV65kCIYF9pSCOvOG2sFQ)；
